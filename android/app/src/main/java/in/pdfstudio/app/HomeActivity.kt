package `in`.pdfstudio.app

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color as AColor
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.text.format.DateUtils
import android.text.format.Formatter
import android.util.LruCache
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items as gridItems
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.pdfstudio.reader.PdfReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private val Bg = Color(0xFF0A0B10)
private val Surface1 = Color(0xFF12131B)
private val Surface2 = Color(0xFF14151D)
private val Line = Color(0xFF1C1E2C)
private val TextMain = Color(0xFFF2F2F7)
private val Muted = Color(0xFF8A8CA3)
private val Violet = Color(0xFF8B7CFF)
private val CatColors = mapOf(
    "Organise" to Color(0xFF8B7CFF), "Edit" to Color(0xFF5B8CFF), "Convert" to Color(0xFFF2D55B),
    "Secure" to Color(0xFF33D6C0), "Extract" to Color(0xFFFF7AA8), "Create" to Color(0xFFFF9F6B)
)

/** Native home: Library, Tools, My files, Settings and the bottom dock. Opens PDFs in the native reader; tools open on the site inside MainActivity. */
class HomeActivity : ComponentActivity() {
    private var recents by mutableStateOf<List<Recent>>(emptyList())
    private var tools by mutableStateOf<List<ToolDef>>(emptyList())
    private var pendingTool: ToolDef? = null
    private lateinit var readerLauncher: androidx.activity.result.ActivityResultLauncher<Intent>
    private lateinit var pickLauncher: androidx.activity.result.ActivityResultLauncher<Array<String>>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prewarmSite()
        RefreshRate.apply(this)
        recents = RecentStore.load(this)
        tools = ToolCatalog.load(this)
        readerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { r ->
            val d = r.data
            if (d != null && "open_document" == d.action) pickLauncher.launch(arrayOf("application/pdf"))
            // Edit/Tools results are ignored: tools live inside the reader now.
        }
        pickLauncher = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
            val tool = pendingTool
            pendingTool = null
            if (uri != null) {
                if (tool != null) openTool(tool, uri) else openPdf(uri)
            }
        }
        setContent { HomeApp() }
        intake(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        intake(intent)
    }

    override fun onResume() {
        super.onResume()
        recents = RecentStore.load(this)
    }

    private fun intake(i: Intent?) {
        if (i == null) return
        val uri: Uri? = when (i.action) {
            Intent.ACTION_VIEW -> i.data
            Intent.ACTION_SEND -> @Suppress("DEPRECATION") i.getParcelableExtra(Intent.EXTRA_STREAM)
            Intent.ACTION_SEND_MULTIPLE -> @Suppress("DEPRECATION") i.getParcelableArrayListExtra<Uri>(Intent.EXTRA_STREAM)?.firstOrNull()
            else -> null
        }
        if (uri != null) {
            i.action = Intent.ACTION_MAIN // do not reopen on rotation or resume
            openPdf(uri)
        }
    }

    private fun meta(uri: Uri): Pair<String, Long> {
        var name = uri.lastPathSegment?.substringAfterLast('/') ?: "document.pdf"
        var size = -1L
        try {
            contentResolver.query(uri, null, null, null, null)?.use { c ->
                if (c.moveToFirst()) {
                    val n = c.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val s = c.getColumnIndex(OpenableColumns.SIZE)
                    if (n >= 0) c.getString(n)?.let { name = it }
                    if (s >= 0 && !c.isNull(s)) size = c.getLong(s)
                }
            }
        } catch (_: Exception) {}
        return name to size
    }

    private fun persist(uri: Uri) {
        try { contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION) } catch (_: Exception) {}
    }

    fun openPdf(uri: Uri) {
        persist(uri)
        val (name, size) = meta(uri)
        recents = RecentStore.add(this, Recent(uri.toString(), name, size, System.currentTimeMillis()))
        if (PdfReader.isSupported()) {
            try {
                val ri = PdfReader.createIntent(this, uri, name)
                if (RefreshRate.desired(this) > 0) ri.putExtra("refresh_fps", RefreshRate.desired(this))
                ri.putExtra("dark_theme", (resources.configuration.uiMode and android.content.res.Configuration.UI_MODE_NIGHT_MASK) == android.content.res.Configuration.UI_MODE_NIGHT_YES)
                ri.putExtra("labs_enabled", Labs.enabled(this))
                ri.putExtra(PdfReader.EXTRA_SHOW_TOOLS, true)
                readerLauncher.launch(ri)
                return
            } catch (_: Exception) {}
        }
        startWeb(uri, name, "reader", null)
    }

    private fun openRecent(r: Recent) {
        val uri = Uri.parse(r.uri)
        val err: Throwable? = try {
            contentResolver.openFileDescriptor(uri, "r")?.close(); null
        } catch (e: Throwable) { e }
        when (RecentAccess.decide(err)) {
            RecentAction.OPEN -> openPdf(uri)
            RecentAction.REPICK -> {
                Toast.makeText(this, "Android no longer lets the app read this file. Pick it again to reopen.", Toast.LENGTH_LONG).show()
                pickPdf()
            }
            RecentAction.MISSING -> Toast.makeText(this, "This file was moved or deleted. Tap the X to remove it.", Toast.LENGTH_LONG).show()
        }
    }

    // Loads the tools page once in a throw-away WebView so the engine, HTTP cache and service worker are warm
    // before the user taps a tool. Dropped after 20 s.
    private fun prewarmSite() {
        try {
            val w = android.webkit.WebView(applicationContext)
            w.settings.javaScriptEnabled = true
            w.settings.domStorageEnabled = true
            w.loadUrl("https://pdf-studio.in/tools/")
            window.decorView.postDelayed({ try { w.stopLoading(); w.destroy() } catch (_: Throwable) {} }, 20000)
        } catch (_: Throwable) {}
    }

    fun pickPdf() { pendingTool = null; pickLauncher.launch(arrayOf("application/pdf")) }

    fun startTool(t: ToolDef) {
        // The tool's own page opens at once; the file is picked there (same as the site).
        startWeb(null, null, null, "/tools/" + t.slug)
    }

    private fun openTool(t: ToolDef, uri: Uri) {
        persist(uri)
        val (name, _) = meta(uri)
        startWeb(uri, name, "tool:" + t.slug, null)
    }

    private fun startWeb(uri: Uri?, name: String?, dest: String?, route: String?) {
        val i = Intent(this, MainActivity::class.java).setAction("in.pdfstudio.app.OPEN_WEB")
        if (uri != null) { i.data = uri; i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION) }
        if (name != null) i.putExtra("name", name)
        if (dest != null) i.putExtra("dest", dest)
        if (route != null) i.putExtra("route", route)
        startActivity(i)
        @Suppress("DEPRECATION") overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }

    fun openSite(route: String) = startWeb(null, null, null, route)

    @Composable
    private fun HomeApp() {
        var tab by rememberSaveable { mutableIntStateOf(0) }
        MaterialTheme(colorScheme = darkColorScheme(primary = Violet, background = Bg, surface = Surface1, onSurface = TextMain, onBackground = TextMain)) {
            Box(Modifier.fillMaxSize().background(Bg)) {
                BackHandler(enabled = tab != 0) { tab = 0 }
                Column(Modifier.fillMaxSize().statusBarsPadding()) {
                    TopBar()
                    Box(Modifier.weight(1f)) {
                        androidx.compose.animation.Crossfade(targetState = tab, animationSpec = androidx.compose.animation.core.tween(180), label = "tab") { t ->
                            when (t) {
                                0 -> LibraryScreen(onSeeAll = { tab = 2 })
                                1 -> ToolsScreen()
                                2 -> FilesScreen()
                                else -> SettingsScreen()
                            }
                        }
                    }
                }
                Dock(tab, { tab = it }, Modifier.align(Alignment.BottomCenter))
            }
        }
    }

    @Composable
    private fun TopBar() {
        Row(Modifier.fillMaxWidth().padding(horizontal = 22.dp, vertical = 14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(34.dp).clip(RoundedCornerShape(10.dp)).background(Surface2), contentAlignment = Alignment.Center) {
                Text("P", color = TextMain, fontWeight = FontWeight.ExtraBold, fontSize = 17.sp)
                Box(Modifier.align(Alignment.BottomEnd).padding(end = 7.dp, bottom = 7.dp).size(6.dp).clip(CircleShape).background(Violet))
            }
            Spacer(Modifier.width(10.dp))
            Text("pdf studio", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
    }

    @Composable
    private fun Title(t: String, sub: String) {
        Column(Modifier.padding(horizontal = 22.dp).padding(top = 8.dp)) {
            Text(t, color = TextMain, fontSize = 30.sp, fontWeight = FontWeight.Bold)
            Text(sub, color = Muted, fontSize = 14.sp, modifier = Modifier.padding(top = 4.dp))
        }
    }

    private val dockSpace = 112.dp

    @Composable
    private fun LibraryScreen(onSeeAll: () -> Unit) {
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = dockSpace + 24.dp)) {
            item { Title("Library", if (recents.isEmpty()) "Open a PDF to get started" else "${recents.size} recent file${if (recents.size == 1) "" else "s"}") }
            item {
                Column(
                    Modifier.padding(horizontal = 22.dp, vertical = 20.dp).fillMaxWidth().height(150.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(Brush.linearGradient(listOf(Color(0xFF8B7CFF), Color(0xFF5B8CFF), Color(0xFF33D6C0))))
                        .clickable { pickPdf() }.padding(22.dp),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Open a PDF", color = Bg, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                        Text("Read, annotate and save a copy. Works offline.", color = Bg.copy(alpha = .8f), fontSize = 13.sp)
                    }
                    Box(Modifier.clip(RoundedCornerShape(14.dp)).background(Bg).padding(horizontal = 18.dp, vertical = 10.dp)) {
                        Text("Choose file", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    }
                }
            }
            if (recents.isNotEmpty()) {
                item {
                    Row(Modifier.fillMaxWidth().padding(horizontal = 22.dp).padding(top = 4.dp, bottom = 10.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Recent", color = TextMain, fontWeight = FontWeight.SemiBold)
                        Text("See all", color = Violet, fontSize = 13.sp, modifier = Modifier.clickable { onSeeAll() })
                    }
                }
                items(recents.take(6), key = { it.uri }) { FileRow(it, onClick = { openRecent(it) }) }
            }
        }
    }

    @Composable
    private fun FileRow(r: Recent, onClick: () -> Unit, trailing: (@Composable () -> Unit)? = null) {
        val ctx = LocalContext.current
        Row(
            Modifier.padding(horizontal = 22.dp).padding(bottom = 10.dp).fillMaxWidth()
                .clip(RoundedCornerShape(18.dp)).background(Surface1).clickable { onClick() }.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Thumb(r.uri)
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Text(r.name, color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                val sz = if (r.size >= 0) Formatter.formatShortFileSize(ctx, r.size) + " · " else ""
                Text(sz + DateUtils.getRelativeTimeSpanString(r.time, System.currentTimeMillis(), DateUtils.MINUTE_IN_MILLIS), color = Muted, fontSize = 12.sp, maxLines = 1)
            }
            trailing?.invoke()
        }
    }

    @Composable
    private fun Thumb(uri: String) {
        val ctx = LocalContext.current
        val bmp by produceState<Bitmap?>(ThumbCache.get(uri), uri) {
            if (value == null) value = withContext(Dispatchers.IO) { renderThumb(ctx, uri) }
        }
        Box(Modifier.size(44.dp, 56.dp).clip(RoundedCornerShape(8.dp)).background(Color.White)) {
            bmp?.let { Image(it.asImageBitmap(), null, Modifier.fillMaxSize(), contentScale = ContentScale.Crop) }
        }
    }

    @Composable
    private fun ToolsScreen() {
        var cat by rememberSaveable { mutableStateOf("All") }
        var query by rememberSaveable { mutableStateOf("") }
        val shown = tools.filter { (cat == "All" || it.category == cat) && (query.isBlank() || it.title.contains(query, true) || it.desc.contains(query, true)) }
        Column(Modifier.fillMaxSize()) {
            Title("Tools", "Pick a tool, then a file")
            OutlinedTextField(
                value = query, onValueChange = { query = it }, singleLine = true,
                placeholder = { Text("Search tools", color = Muted) },
                leadingIcon = { Icon(Icons.Outlined.Search, null, tint = Muted) },
                trailingIcon = { if (query.isNotEmpty()) Icon(Icons.Outlined.Close, "Clear", tint = Muted, modifier = Modifier.clickable { query = "" }) },
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Violet, unfocusedBorderColor = Line, focusedContainerColor = Surface1, unfocusedContainerColor = Surface1, cursorColor = Violet, focusedTextColor = TextMain, unfocusedTextColor = TextMain),
                modifier = Modifier.fillMaxWidth().padding(horizontal = 22.dp, vertical = 12.dp)
            )
            androidx.compose.foundation.lazy.LazyRow(contentPadding = PaddingValues(horizontal = 22.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(listOf("All") + ToolCatalog.categories.filter { c -> tools.any { it.category == c } }) { c ->
                    val on = c == cat
                    Box(Modifier.clip(RoundedCornerShape(99.dp)).background(if (on) Violet else Surface2).clickable { cat = c }.padding(horizontal = 14.dp, vertical = 8.dp)) {
                        Text(c, color = if (on) Bg else Muted, fontSize = 13.sp, fontWeight = if (on) FontWeight.SemiBold else FontWeight.Normal)
                    }
                }
            }
            if (shown.isEmpty()) {
                Text(if (tools.isEmpty()) "Tools are being checked and will appear here." else "No tools match.", color = Muted, modifier = Modifier.padding(22.dp))
            }
            LazyVerticalGrid(
                columns = GridCells.Fixed(2), modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 22.dp, end = 22.dp, top = 20.dp, bottom = dockSpace + 40.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                gridItems(shown, key = { it.slug }) { t ->
                    Column(
                        Modifier.height(148.dp).clip(RoundedCornerShape(24.dp)).background(CatColors[t.category] ?: Violet)
                            .clickable { startTool(t) }.padding(18.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(Modifier.size(42.dp).clip(RoundedCornerShape(14.dp)).background(Bg.copy(alpha = .14f)), contentAlignment = Alignment.Center) {
                            Icon(ToolIcons.forTool(t.slug, t.category), null, tint = Bg, modifier = Modifier.size(24.dp))
                        }
                        Column {
                            Text(t.title, color = Bg, fontWeight = FontWeight.Bold, fontSize = 15.sp, maxLines = 2, overflow = TextOverflow.Ellipsis, lineHeight = 19.sp)
                            Text(t.desc, color = Bg.copy(alpha = .7f), fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                    }
                }
            }
        }
    }

    @Composable
    private fun FilesScreen() {
        var query by rememberSaveable { mutableStateOf("") }
        var sort by rememberSaveable { mutableIntStateOf(0) }
        var confirmClear by remember { mutableStateOf(false) }
        val list = recents.filter { query.isBlank() || it.name.contains(query, true) }.let {
            when (sort) { 1 -> it.sortedBy { r -> r.name.lowercase() }; 2 -> it.sortedByDescending { r -> r.size }; else -> it }
        }
        Column(Modifier.fillMaxSize()) {
            Title("My files", "${recents.size} file${if (recents.size == 1) "" else "s"} opened in the app")
            OutlinedTextField(
                value = query, onValueChange = { query = it }, singleLine = true,
                placeholder = { Text("Search files", color = Muted) },
                leadingIcon = { Icon(Icons.Outlined.Search, null, tint = Muted) },
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = Violet, unfocusedBorderColor = Line, focusedContainerColor = Surface1, unfocusedContainerColor = Surface1, cursorColor = Violet, focusedTextColor = TextMain, unfocusedTextColor = TextMain),
                modifier = Modifier.fillMaxWidth().padding(horizontal = 22.dp, vertical = 12.dp)
            )
            Row(Modifier.padding(horizontal = 22.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Recent", "Name", "Size").forEachIndexed { i, s ->
                    val on = sort == i
                    Box(Modifier.clip(RoundedCornerShape(99.dp)).background(if (on) Violet else Surface2).clickable { sort = i }.padding(horizontal = 14.dp, vertical = 8.dp)) {
                        Text(s, color = if (on) Bg else Muted, fontSize = 13.sp, fontWeight = if (on) FontWeight.SemiBold else FontWeight.Normal)
                    }
                }
                Spacer(Modifier.weight(1f))
                if (recents.isNotEmpty()) Text("Clear list", color = Violet, fontSize = 13.sp, modifier = Modifier.clickable { confirmClear = true }.padding(vertical = 8.dp))
            }
            if (list.isEmpty()) Text(if (recents.isEmpty()) "Files you open appear here." else "No files match.", color = Muted, modifier = Modifier.padding(22.dp))
            LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(top = 14.dp, bottom = dockSpace + 24.dp)) {
                items(list, key = { it.uri }) { r ->
                    FileRow(r, onClick = { openRecent(r) }) {
                        Icon(Icons.Outlined.Close, "Remove from list", tint = Muted, modifier = Modifier.padding(start = 8.dp).size(22.dp).clickable { recents = RecentStore.remove(this@HomeActivity, r.uri) })
                    }
                }
            }
        }
        if (confirmClear) AlertDialog(
            onDismissRequest = { confirmClear = false },
            title = { Text("Clear the list?") },
            text = { Text("This removes the entries only. Your PDFs are not deleted.") },
            confirmButton = { TextButton({ recents = RecentStore.clear(this@HomeActivity); confirmClear = false }) { Text("Clear", color = Violet) } },
            dismissButton = { TextButton({ confirmClear = false }) { Text("Cancel", color = Muted) } }
        )
    }

    @Composable
    private fun SettingsScreen() {
        val ctx = LocalContext.current
        var fps by remember { mutableIntStateOf(RefreshRate.desired(ctx)) }
        var licences by remember { mutableStateOf(false) }
        var labs by remember { mutableStateOf(Labs.enabled(ctx)) }
        var barPos by remember { mutableStateOf(PdfReader.getAnnotationBarPosition(ctx)) }
        val version = remember { try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" } }
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = dockSpace + 24.dp)) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.weight(1f)) { Title("Settings", "PDF Studio") }
                    Icon(Icons.Filled.Settings, null, tint = Violet, modifier = Modifier.padding(end = 22.dp).size(30.dp))
                }
            }
            item { SectionLabel("Reader smoothness") }
            item {
                Column(Modifier.padding(horizontal = 22.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1)) {
                    listOf(0 to "System default", 60 to "Battery saver (60 fps)", 90 to "Balanced (90 fps)", 120 to "Smooth (up to 120 fps)").forEach { (v, label) ->
                        Row(Modifier.fillMaxWidth().clickable { fps = v; RefreshRate.setDesired(ctx, v) }.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(label, color = TextMain, modifier = Modifier.weight(1f))
                            RadioButton(selected = fps == v, onClick = { fps = v; RefreshRate.setDesired(ctx, v) }, colors = RadioButtonDefaults.colors(selectedColor = Violet, unselectedColor = Muted))
                        }
                    }
                }
            }
            item { Text("Applies the next time you open a PDF. Phones that cannot go that high use their closest mode.", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 22.dp, vertical = 8.dp)) }
            item { SectionLabel("Annotation bar position") }
            item {
                Column(Modifier.padding(horizontal = 22.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1)) {
                    listOf("top" to "Top", "bottom" to "Bottom").forEach { (v, label) ->
                        Row(Modifier.fillMaxWidth().clickable { barPos = v; PdfReader.setAnnotationBarPosition(ctx, v) }.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(label, color = TextMain, modifier = Modifier.weight(1f))
                            RadioButton(selected = barPos == v, onClick = { barPos = v; PdfReader.setAnnotationBarPosition(ctx, v) }, colors = RadioButtonDefaults.colors(selectedColor = Violet, unselectedColor = Muted))
                        }
                    }
                }
            }
            item { SectionLabel("Labs") }
            item {
                Row(Modifier.padding(horizontal = 22.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("Show experimental tools", color = TextMain, modifier = Modifier.weight(1f))
                    Switch(checked = labs, onCheckedChange = { labs = it; Labs.set(ctx, it) })
                }
            }
            item { Text("Off by default. Turns on redaction, signature check and other tools that are still being tested. They can be incomplete.", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 22.dp, vertical = 8.dp)) }
            item { SectionLabel("About") }
            item {
                Column(Modifier.padding(horizontal = 22.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1)) {
                    SettingRow("Privacy policy") { openSite("/privacy") }
                    SettingRow("Contact and feedback") { openSite("/contact") }
                    SettingRow("Open source licences") { licences = true }
                }
            }
            item { Text("Your PDFs stay on this phone. The reader works offline; web tools need an internet connection.", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(22.dp)) }
        }
        if (licences) AlertDialog(
            onDismissRequest = { licences = false },
            title = { Text("Open source") },
            text = { Text("PDFium (Apache-2.0 / BSD), PDFium Android bindings (Apache-2.0), Apache PDFBox Android (Apache-2.0), Capacitor (MIT), AndroidX and Jetpack Compose (Apache-2.0), Kotlin (Apache-2.0), Bouncy Castle (MIT), Tesseract (Apache-2.0), Leptonica (BSD-2), libjpeg-turbo (BSD), libpng (libpng licence), Guava (Apache-2.0).") },
            confirmButton = { TextButton({ licences = false }) { Text("Close", color = Violet) } }
        )
    }

    @Composable
    private fun SectionLabel(t: String) = Text(t, color = Muted, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(start = 22.dp, top = 22.dp, bottom = 8.dp))

    @Composable
    private fun SettingRow(t: String, onClick: () -> Unit) {
        Row(Modifier.fillMaxWidth().clickable { onClick() }.padding(16.dp)) { Text(t, color = TextMain) }
    }

    @Composable
    private fun Dock(tab: Int, onTab: (Int) -> Unit, modifier: Modifier) {
        Box(modifier.fillMaxWidth()) {
            Row(
                Modifier.fillMaxWidth().background(Color(0xFF0E0F16)).navigationBarsPadding().height(84.dp).padding(horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                DockItem("Library", AppIcons.Description, AppIcons.Description, tab == 0, Modifier.weight(1f)) { onTab(0) }
                DockItem("Tools", AppIcons.Apps, AppIcons.Apps, tab == 1, Modifier.weight(1f)) { onTab(1) }
                Spacer(Modifier.width(88.dp))
                DockItem("Scan", AppIcons.CameraAlt, AppIcons.CameraAlt, false, Modifier.weight(1f)) { openSite("/tools/scan-to-pdf") }
                DockItem("My files", AppIcons.Folder, AppIcons.Folder, tab == 2, Modifier.weight(1f)) { onTab(2) }
                DockItem("Settings", Icons.Outlined.Settings, Icons.Filled.Settings, tab == 3, Modifier.weight(1f)) { onTab(3) }
            }
            Box(
                Modifier.align(Alignment.TopCenter).offset(y = (-24).dp).size(60.dp).clip(RoundedCornerShape(22.dp)).background(Violet)
                    .clickable { pickPdf() },
                contentAlignment = Alignment.Center
            ) { Icon(Icons.Filled.Add, "Open a PDF", tint = Bg, modifier = Modifier.size(30.dp)) }
        }
    }

    @Composable
    private fun DockItem(label: String, off: ImageVector, on: ImageVector, selected: Boolean, modifier: Modifier, click: () -> Unit) {
        Column(modifier.clip(RoundedCornerShape(14.dp)).clickable { click() }.padding(vertical = 8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(if (selected) on else off, label, tint = if (selected) Violet else Color(0xFF8A8FA4), modifier = Modifier.size(24.dp))
            Text(label, color = if (selected) Violet else Color(0xFF8A8FA4), fontSize = 11.sp, maxLines = 1, modifier = Modifier.padding(top = 4.dp))
        }
    }
}

private object ThumbCache {
    private val cache = LruCache<String, Bitmap>(48)
    fun get(k: String): Bitmap? = cache.get(k)
    fun put(k: String, b: Bitmap) { cache.put(k, b) }
}

/** First-page thumbnail via the system PdfRenderer; null for protected or unreadable files. */
private fun renderThumb(ctx: Context, uri: String): Bitmap? = try {
    ctx.contentResolver.openFileDescriptor(Uri.parse(uri), "r")?.use { fd ->
        PdfRenderer(fd).use { pr ->
            if (pr.pageCount == 0) null else pr.openPage(0).use { p ->
                val w = 132
                val h = (w * p.height.toFloat() / p.width.toFloat()).toInt().coerceIn(80, 260)
                val b = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
                b.eraseColor(AColor.WHITE)
                p.render(b, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                ThumbCache.put(uri, b)
                b
            }
        }
    }
} catch (_: Throwable) { null }
