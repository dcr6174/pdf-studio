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
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.HazeStyle
import dev.chrisbanes.haze.HazeTint
import dev.chrisbanes.haze.hazeEffect
import dev.chrisbanes.haze.hazeSource
import dev.chrisbanes.haze.rememberHazeState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.graphicsLayer
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
    private var tabRequest by mutableIntStateOf(-1)
    private lateinit var readerLauncher: androidx.activity.result.ActivityResultLauncher<Intent>
    private lateinit var pickLauncher: androidx.activity.result.ActivityResultLauncher<Array<String>>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        NoteHook.install(this)
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
        if (intent.hasExtra("tab")) tabRequest = intent.getIntExtra("tab", 0)
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

    fun openScan() {
        val i = Intent(this, MainActivity::class.java).setAction("in.pdfstudio.app.OPEN_WEB").putExtra("route", "/tools/scan-to-pdf").putExtra("bar", 2)
        startActivity(i)
        @Suppress("DEPRECATION") overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
    }

    @Composable
    private fun HomeApp() {
        var tab by rememberSaveable { mutableIntStateOf(0) }
        val hazeState = rememberHazeState()
        LaunchedEffect(tabRequest) { if (tabRequest >= 0) { tab = tabRequest; tabRequest = -1 } }
        MaterialTheme(colorScheme = darkColorScheme(primary = Violet, background = Bg, surface = Surface1, onSurface = TextMain, onBackground = TextMain)) {
            Box(Modifier.fillMaxSize().background(Bg)) {
                BackHandler(enabled = tab != 0) { tab = 0 }
                Column(Modifier.fillMaxSize().statusBarsPadding()) {
                    TopBar(onNotes = { tab = 4 })
                    Box(Modifier.weight(1f).hazeSource(hazeState)) {
                        androidx.compose.animation.Crossfade(targetState = tab, animationSpec = androidx.compose.animation.core.tween(180), label = "tab") { t ->
                            when (t) {
                                0 -> LibraryScreen(onSeeAll = { tab = 2 })
                                1 -> ToolsScreen()
                                2 -> FilesScreen()
                                3 -> SettingsScreen(onNotes = { tab = 4 })
                                5 -> ScanScreen()
                                else -> NotesScreen()
                            }
                        }
                    }
                }
                GlassDock(when (tab) { 0, 2 -> 0; 1 -> 1; 5 -> 2; else -> 3 }, { pos -> tab = when (pos) { 0 -> 0; 1 -> 1; 2 -> 5; else -> 3 } }, hazeState, true, Modifier.align(Alignment.BottomCenter))
            }
        }
    }

    @Composable
    private fun TopBar(onNotes: () -> Unit) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 22.dp, vertical = 14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(34.dp).clip(RoundedCornerShape(10.dp)).background(Surface2), contentAlignment = Alignment.Center) {
                Text("P", color = TextMain, fontWeight = FontWeight.ExtraBold, fontSize = 17.sp)
                Box(Modifier.align(Alignment.BottomEnd).padding(end = 7.dp, bottom = 7.dp).size(6.dp).clip(CircleShape).background(Violet))
            }
            Spacer(Modifier.width(10.dp))
            Text("pdf studio", color = TextMain, fontWeight = FontWeight.Bold, fontSize = 18.sp, modifier = Modifier.weight(1f))
            Text("Notes", color = Violet, fontWeight = FontWeight.Bold, fontSize = 14.sp,
                modifier = Modifier.clip(RoundedCornerShape(14.dp)).background(Surface2).clickable { onNotes() }.padding(horizontal = 14.dp, vertical = 8.dp))
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
    private fun NotesScreen() {
        val ctx = LocalContext.current
        var notes by remember { mutableStateOf(Notes.load(ctx)) }
        var open by remember { mutableStateOf<Long?>(null) }
        var dialog by remember { mutableStateOf<String?>(null) } // "new" or "rename"
        var field by remember { mutableStateOf("") }
        var confirmDelete by remember { mutableStateOf(false) }
        val fmt = remember { java.text.SimpleDateFormat("d MMM, h:mm a", java.util.Locale.getDefault()) }
        BackHandler(enabled = open != null) { open = null }
        // pick up notes added from the reader or a tool page while this screen is shown
        val owner = androidx.lifecycle.compose.LocalLifecycleOwner.current
        DisposableEffect(owner) {
            val obs = androidx.lifecycle.LifecycleEventObserver { _, e -> if (e == androidx.lifecycle.Lifecycle.Event.ON_RESUME) notes = Notes.load(ctx) }
            owner.lifecycle.addObserver(obs); onDispose { owner.lifecycle.removeObserver(obs) }
        }
        val cur = notes.firstOrNull { it.id == open }
        if (open != null && cur == null) open = null
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = dockSpace + 24.dp)) {
            if (cur == null) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.weight(1f)) { Title("Notes", if (notes.isEmpty()) "Select text and tap Add to note" else "${notes.size} notes") }
                        TextButton(onClick = { field = ""; dialog = "new" }, modifier = Modifier.padding(end = 14.dp)) { Text("+ New note", color = Violet, fontWeight = FontWeight.Bold) }
                    }
                }
                items(notes.size) { i ->
                    val n = notes[i]
                    Column(Modifier.padding(horizontal = 22.dp, vertical = 6.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1).clickable { open = n.id }.padding(16.dp)) {
                        Text(n.title, color = TextMain, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                        Text("${n.snippets.size} saved \u00b7 " + fmt.format(java.util.Date(n.updated)), color = Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                    }
                }
            } else {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(end = 10.dp)) {
                        TextButton(onClick = { open = null }) { Text("\u2039 Notes", color = Violet) }
                        Spacer(Modifier.weight(1f))
                        TextButton(onClick = { field = cur.title; dialog = "rename" }) { Text("Rename", color = Violet) }
                        TextButton(onClick = { confirmDelete = true }) { Text("Delete note", color = Muted) }
                    }
                    Title(cur.title, "${cur.snippets.size} saved")
                }
                items(cur.snippets.size) { i ->
                    val n = cur.snippets[i]
                    Column(Modifier.padding(horizontal = 22.dp, vertical = 6.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1).padding(16.dp)) {
                        Text(n.text, color = TextMain, fontSize = 15.sp)
                        Text(listOf(n.source, fmt.format(java.util.Date(n.date))).filter { it.isNotBlank() }.joinToString(" \u00b7 "), color = Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 8.dp))
                        Row(Modifier.padding(top = 8.dp)) {
                            TextButton(onClick = {
                                (ctx.getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager).setPrimaryClip(android.content.ClipData.newPlainText("note", n.text))
                                android.widget.Toast.makeText(ctx, "Copied", android.widget.Toast.LENGTH_SHORT).show()
                            }) { Text("Copy", color = Violet) }
                            TextButton(onClick = {
                                ctx.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, n.text), "Share"))
                            }) { Text("Share", color = Violet) }
                            if (Voice.isEnglish(n.text)) {
                                TextButton(onClick = { (ctx as? android.app.Activity)?.let { Voice.speak(it, n.text) } }) { Text("Read aloud", color = Violet) }
                            }
                            TextButton(onClick = { Notes.deleteSnippet(ctx, cur.id, n.id); notes = Notes.load(ctx) }) { Text("Delete", color = Muted) }
                        }
                    }
                }
            }
        }
        if (dialog != null) {
            AlertDialog(
                onDismissRequest = { dialog = null },
                title = { Text(if (dialog == "new") "New note" else "Rename note") },
                text = { OutlinedTextField(value = field, onValueChange = { field = it }, singleLine = true, placeholder = { Text("Name") }) },
                confirmButton = {
                    TextButton(onClick = {
                        if (dialog == "new") { open = Notes.create(ctx, field) } else cur?.let { Notes.rename(ctx, it.id, field) }
                        notes = Notes.load(ctx); dialog = null
                    }) { Text("Save", color = Violet) }
                },
                dismissButton = { TextButton(onClick = { dialog = null }) { Text("Cancel", color = Muted) } }
            )
        }
        if (confirmDelete && cur != null) {
            AlertDialog(
                onDismissRequest = { confirmDelete = false },
                title = { Text("Delete this note?") },
                text = { Text("It and its ${cur.snippets.size} saved snippets will be removed.") },
                confirmButton = { TextButton(onClick = { Notes.deleteNote(ctx, cur.id); notes = Notes.load(ctx); open = null; confirmDelete = false }) { Text("Delete", color = Violet) } },
                dismissButton = { TextButton(onClick = { confirmDelete = false }) { Text("Cancel", color = Muted) } }
            )
        }
    }

    @Composable
    private fun ScanScreen() {
        Column(Modifier.fillMaxSize()) {
            Title("Scan", "Turn paper into a PDF")
            Column(
                Modifier.padding(horizontal = 22.dp, vertical = 8.dp).fillMaxWidth().clip(RoundedCornerShape(26.dp))
                    .background(Brush.linearGradient(listOf(Color(0xFF3B2F8F), Color(0xFF8B3A7A)))).padding(24.dp)
            ) {
                Text("Scan to PDF", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                Text("Take photos with the camera or pick pictures from your gallery, tidy them up and save one PDF.", color = Color(0xFFE5DEFF), fontSize = 14.sp, modifier = Modifier.padding(top = 8.dp, bottom = 20.dp))
                Box(
                    Modifier.fillMaxWidth().height(54.dp).clip(RoundedCornerShape(27.dp)).background(Color.White).clickable { openScan() },
                    contentAlignment = Alignment.Center
                ) { Text("Start scanning", color = Color(0xFF1A1330), fontWeight = FontWeight.Bold, fontSize = 16.sp) }
            }
            Text("Camera: pick Take a photo on the next screen. Gallery: pick Choose files.", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 26.dp, vertical = 10.dp))
        }
    }

    @Composable
    private fun SettingsScreen(onNotes: () -> Unit) {
        val ctx = LocalContext.current
        var fps by remember { mutableIntStateOf(RefreshRate.desired(ctx)) }
        var licences by remember { mutableStateOf(false) }
        var labs by remember { mutableStateOf(Labs.enabled(ctx)) }
        var voiceOn by remember { mutableStateOf(Voice.installed(ctx)) }
        var barPos by remember { mutableStateOf(PdfReader.getAnnotationBarPosition(ctx)) }
        val version = remember { try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" } }
        LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(bottom = dockSpace + 24.dp)) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.weight(1f)) { Title("Settings", "PDF Studio") }
                    Icon(Icons.Filled.Settings, null, tint = Violet, modifier = Modifier.padding(end = 22.dp).size(30.dp))
                }
            }
            item {
                Row(Modifier.padding(horizontal = 22.dp, vertical = 6.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1).clickable { onNotes() }.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("Notes", color = TextMain, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                    Text("${Notes.load(ctx).size} notes", color = Muted, fontSize = 13.sp)
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
            item { SectionLabel("Read aloud voice") }
            item {
                Row(Modifier.padding(horizontal = 22.dp, vertical = 6.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Surface1).padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text("English voice", color = TextMain)
                        Text(if (voiceOn) "Downloaded (${Voice.installedMb(ctx)} MB)" else "Not downloaded", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                    }
                    if (voiceOn) TextButton(onClick = { Voice.delete(ctx); voiceOn = false }) { Text("Delete", color = Muted) }
                }
            }
            item { Text(if (voiceOn) "Read aloud uses this voice offline." else "The voice downloads once, the first time you tap Read aloud, and works offline after that.", color = Muted, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 22.dp, vertical = 8.dp)) }
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
            text = { Text("PDFium (Apache-2.0 / BSD), PDFium Android bindings (Apache-2.0), Apache PDFBox Android (Apache-2.0), Capacitor (MIT), AndroidX and Jetpack Compose (Apache-2.0), Kotlin (Apache-2.0), Bouncy Castle (MIT), Tesseract (Apache-2.0), Leptonica (BSD-2), libjpeg-turbo (BSD), libpng (libpng licence), Guava (Apache-2.0), Haze (Apache-2.0), Phosphor icons (MIT), sherpa-onnx (Apache-2.0), piper-phonemize and espeak-ng data (GPL-3.0), Piper voice joe (CC0).") },
            confirmButton = { TextButton({ licences = false }) { Text("Close", color = Violet) } }
        )
    }

    @Composable
    private fun SectionLabel(t: String) = Text(t, color = Muted, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(start = 22.dp, top = 22.dp, bottom = 8.dp))

    @Composable
    private fun SettingRow(t: String, onClick: () -> Unit) {
        Row(Modifier.fillMaxWidth().clickable { onClick() }.padding(16.dp)) { Text(t, color = TextMain) }
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
