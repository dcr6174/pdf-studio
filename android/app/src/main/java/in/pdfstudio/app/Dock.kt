package `in`.pdfstudio.app

import android.app.Activity
import android.content.Intent
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.HazeStyle
import dev.chrisbanes.haze.HazeTint
import dev.chrisbanes.haze.hazeEffect

@Composable
fun GlassDock(selected: Int, onSelect: (Int) -> Unit, hazeState: HazeState?, navPad: Boolean, modifier: Modifier) {
        val shape = RoundedCornerShape(34.dp)
        BoxWithConstraints((if (navPad) modifier.fillMaxWidth().navigationBarsPadding() else modifier.fillMaxWidth()).padding(horizontal = 18.dp, vertical = 12.dp)) {
            val itemW = maxWidth / 4
            val pillX by animateDpAsState(
                targetValue = itemW * selected,
                animationSpec = spring(dampingRatio = 0.7f, stiffness = 350f), label = "pill"
            )
            Box(
                Modifier.fillMaxWidth().height(68.dp).shadow(18.dp, shape, ambientColor = Color(0x66000000), spotColor = Color(0x66000000))
                    .clip(shape)
                    .then(if (hazeState != null) Modifier.hazeEffect(state = hazeState, style = HazeStyle(backgroundColor = Color(0xFF0E0F16), tints = listOf(HazeTint(Color(0x990E0F16))), blurRadius = 28.dp, noiseFactor = 0.04f)) else Modifier.background(Color(0xE60E0F16)))
                    .background(Brush.verticalGradient(listOf(Color(0x22FFFFFF), Color(0x08FFFFFF))))
                    .border(1.dp, Brush.verticalGradient(listOf(Color(0x44FFFFFF), Color(0x14FFFFFF))), shape)
            ) {
                Box(
                    Modifier.offset(x = pillX).width(itemW).fillMaxHeight().padding(5.dp)
                        .clip(RoundedCornerShape(28.dp)).background(Brush.linearGradient(listOf(Color(0x558B7CFF), Color(0x33F472B6))))
                        .border(1.dp, Color(0x338B7CFF), RoundedCornerShape(28.dp))
                )
                Row(Modifier.fillMaxSize()) {
                    DockItem("Library", Ph.FilesBold, Ph.FilesFill, selected == 0, Modifier.weight(1f)) { onSelect(0) }
                    DockItem("Tools", Ph.ToolsBold, Ph.ToolsFill, selected == 1, Modifier.weight(1f)) { onSelect(1) }
                    DockItem("Scan", Ph.ScanBold, Ph.ScanFill, selected == 2, Modifier.weight(1f)) { onSelect(2) }
                    DockItem("Settings", Ph.SettingsBold, Ph.SettingsFill, selected == 3, Modifier.weight(1f)) { onSelect(3) }
                }
            }
        }
    }

@Composable
private fun DockItem(label: String, off: ImageVector, on: ImageVector, selected: Boolean, modifier: Modifier, click: () -> Unit) {
        val src = remember { MutableInteractionSource() }
        val pressed by src.collectIsPressedAsState()
        val scale by animateFloatAsState(if (pressed) 0.92f else 1f, spring(dampingRatio = 0.6f, stiffness = 500f), label = "press")
        val lift by animateDpAsState(if (selected) (-2).dp else 0.dp, spring(dampingRatio = 0.6f, stiffness = 400f), label = "lift")
        val tilt by animateFloatAsState(if (selected) -6f else 0f, spring(dampingRatio = 0.5f, stiffness = 300f), label = "tilt")
        Column(
            modifier.fillMaxHeight().graphicsLayer { scaleX = scale; scaleY = scale }
                .clickable(interactionSource = src, indication = null) { click() },
            horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center
        ) {
            val iconMod = Modifier.size(28.dp).offset(y = lift).graphicsLayer { rotationZ = tilt }
            if (selected) {
                Icon(on, label, tint = Color.White, modifier = iconMod
                    .graphicsLayer { compositingStrategy = androidx.compose.ui.graphics.CompositingStrategy.Offscreen }
                    .drawWithContent {
                        drawContent()
                        drawRect(Brush.linearGradient(listOf(Color(0xFF8B7CFF), Color(0xFFF472B6))), blendMode = BlendMode.SrcIn)
                    })
            } else {
                Icon(off, label, tint = Color(0xFFA3A8BD), modifier = iconMod)
            }
            Text(label, color = if (selected) Color(0xFFB9AEFF) else Color(0xFFA3A8BD), fontSize = 11.sp, fontWeight = FontWeight.Bold, maxLines = 1, modifier = Modifier.padding(top = 3.dp))
        }
    }

/** The same glass bar drawn over the web screen (Scan), so the bar never disappears. */
object DockOverlay {
    private const val TAG = "dock_overlay"
    private const val HEIGHT_DP = 92

    @JvmStatic
    fun update(act: Activity, selected: Int) {
        val root = act.findViewById<ViewGroup>(android.R.id.content) ?: return
        val old = root.findViewWithTag<android.view.View>(TAG)
        val wv = (act as? com.getcapacitor.BridgeActivity)?.bridge?.webView
        val px = (HEIGHT_DP * act.resources.displayMetrics.density).toInt()
        if (selected < 0) {
            if (old != null) root.removeView(old)
            (wv?.layoutParams as? ViewGroup.MarginLayoutParams)?.let { it.bottomMargin = 0; wv.layoutParams = it }
            return
        }
        if (old != null) root.removeView(old)
        val cv = ComposeView(act)
        cv.tag = TAG
        cv.setContent {
            GlassDock(selected, { pos ->
                val tab = when (pos) { 0 -> 0; 1 -> 1; 2 -> 5; else -> 3 }
                if (pos != 2) {
                    act.startActivity(Intent(act, HomeActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT).putExtra("tab", tab))
                    @Suppress("DEPRECATION") act.overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
                }
            }, null, false, Modifier)
        }
        root.addView(cv, FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, android.view.Gravity.BOTTOM))
        (wv?.layoutParams as? ViewGroup.MarginLayoutParams)?.let { it.bottomMargin = px; wv.layoutParams = it }
    }
}
