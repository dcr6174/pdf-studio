package `in`.pdfstudio.app

import android.content.Context
import org.json.JSONArray

/** One web tool shown on the Tools tab. [needsFile] tools ask for a PDF first and hand it to the tool page. */
data class ToolDef(val slug: String, val title: String, val desc: String, val category: String, val needsFile: Boolean)

object ToolCatalog {
    val categories = listOf("Organise", "Edit", "Convert", "Secure", "Extract", "Create")

    /** Loaded from assets/tools.json, which only lists tools that passed the headless test. */
    fun load(c: Context): List<ToolDef> = try {
        val raw = c.assets.open("tools.json").bufferedReader().use { it.readText() }
        val a = JSONArray(raw)
        (0 until a.length()).map {
            val o = a.getJSONObject(it)
            ToolDef(o.getString("slug"), o.getString("title"), o.optString("desc", ""), o.getString("category"), o.optBoolean("needsFile", true))
        }
    } catch (e: Exception) { emptyList() }
}
