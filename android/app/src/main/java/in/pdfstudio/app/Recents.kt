package `in`.pdfstudio.app

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

data class Recent(val uri: String, val name: String, val size: Long, val time: Long)

/** Files opened in the app, newest first. Stored as JSON in app-private preferences; the PDFs themselves are never copied. */
object RecentStore {
    private const val PREFS = "pdfstudio_recents"
    private const val KEY = "items"
    private const val MAX = 200

    fun load(c: Context): List<Recent> {
        val raw = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, null) ?: return emptyList()
        return try {
            val a = JSONArray(raw)
            (0 until a.length()).map {
                val o = a.getJSONObject(it)
                Recent(o.getString("uri"), o.optString("name", "document.pdf"), o.optLong("size", -1), o.optLong("time", 0))
            }
        } catch (e: Exception) { emptyList() }
    }

    private fun save(c: Context, items: List<Recent>) {
        val a = JSONArray()
        items.take(MAX).forEach {
            a.put(JSONObject().put("uri", it.uri).put("name", it.name).put("size", it.size).put("time", it.time))
        }
        c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, a.toString()).apply()
    }

    fun add(c: Context, r: Recent): List<Recent> {
        val next = listOf(r) + load(c).filter { it.uri != r.uri }
        save(c, next)
        return next.take(MAX)
    }

    fun remove(c: Context, uri: String): List<Recent> {
        val next = load(c).filter { it.uri != uri }
        save(c, next)
        return next
    }

    fun clear(c: Context): List<Recent> { save(c, emptyList()); return emptyList() }
}
