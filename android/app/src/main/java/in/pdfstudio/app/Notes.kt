package `in`.pdfstudio.app

import android.content.Context
import android.speech.tts.TextToSpeech
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.Locale

data class Snippet(val id: Long, val text: String, val source: String, val date: Long)
data class Notebook(val id: Long, val title: String, val updated: Long, val snippets: List<Snippet>)

/** Local, offline notes: a few named notes, each holding saved snippets. One small JSON file in private storage. */
object Notes {
    private const val MAX_SNIPPETS = 500
    private fun file(ctx: Context) = File(ctx.filesDir, "notes.json")

    @Synchronized
    fun load(ctx: Context): List<Notebook> = try {
        val a = JSONArray(file(ctx).takeIf { it.exists() }?.readText() ?: "[]")
        if (a.length() > 0 && a.getJSONObject(0).has("text")) {
            // older flat list: keep everything inside one note
            val sn = (0 until a.length()).map { val o = a.getJSONObject(it); Snippet(o.getLong("id"), o.getString("text"), o.optString("source"), o.getLong("date")) }
            listOf(Notebook(1, "Saved snippets", sn.firstOrNull()?.date ?: 0L, sn)).also { save(ctx, it) }
        } else (0 until a.length()).map { i ->
            val o = a.getJSONObject(i)
            val sa = o.getJSONArray("snippets")
            Notebook(o.getLong("id"), o.getString("title"), o.getLong("updated"), (0 until sa.length()).map { k ->
                val x = sa.getJSONObject(k); Snippet(x.getLong("id"), x.getString("text"), x.optString("source"), x.getLong("date"))
            })
        }
    } catch (_: Throwable) { emptyList() }

    @Synchronized
    fun create(ctx: Context, title: String): Long {
        val id = System.currentTimeMillis()
        save(ctx, listOf(Notebook(id, title.trim().ifEmpty { "Note" }, id, emptyList())) + load(ctx))
        return id
    }

    @Synchronized
    fun addSnippet(ctx: Context, noteId: Long, text: String, source: String) {
        val clean = text.trim()
        if (clean.isEmpty()) return
        val now = System.currentTimeMillis()
        save(ctx, load(ctx).map { if (it.id == noteId) it.copy(updated = now, snippets = (listOf(Snippet(now, clean, source, now)) + it.snippets).take(MAX_SNIPPETS)) else it }
            .sortedByDescending { it.updated })
    }

    @Synchronized
    fun rename(ctx: Context, id: Long, title: String) = save(ctx, load(ctx).map { if (it.id == id) it.copy(title = title.trim().ifEmpty { it.title }) else it })

    @Synchronized
    fun deleteNote(ctx: Context, id: Long) = save(ctx, load(ctx).filter { it.id != id })

    @Synchronized
    fun deleteSnippet(ctx: Context, noteId: Long, snippetId: Long) =
        save(ctx, load(ctx).map { if (it.id == noteId) it.copy(snippets = it.snippets.filter { s -> s.id != snippetId }) else it })

    private fun save(ctx: Context, list: List<Notebook>) {
        val a = JSONArray()
        list.forEach { n ->
            val sa = JSONArray()
            n.snippets.forEach { sa.put(JSONObject().put("id", it.id).put("text", it.text).put("source", it.source).put("date", it.date)) }
            a.put(JSONObject().put("id", n.id).put("title", n.title).put("updated", n.updated).put("snippets", sa))
        }
        file(ctx).writeText(a.toString())
    }
}

/** Read aloud with the phone's own TextToSpeech (offline). */
object Speaker {
    private var tts: TextToSpeech? = null
    private var ready = false
    fun speak(ctx: Context, text: String, onFail: () -> Unit = {}) {
        val go = {
            tts?.stop()
            var n = 0
            var i = 0
            while (i < text.length) {
                tts?.speak(text.substring(i, minOf(text.length, i + 3500)), if (n == 0) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD, null, "n$n")
                i += 3500; n++
            }
        }
        if (ready) { go(); return }
        tts = TextToSpeech(ctx.applicationContext) { st ->
            if (st == TextToSpeech.SUCCESS) { ready = true; tts?.setLanguage(Locale.getDefault()); go() } else onFail()
        }
    }
    fun stop() { tts?.stop() }
}

/** Opens the "Add to note" sheet. Holds no Activity (starts a transparent one from the application context). */
object NoteHook {
    fun add(ctx: Context, text: String, source: String) {
        ctx.applicationContext.startActivity(
            android.content.Intent(ctx.applicationContext, AddNoteActivity::class.java)
                .addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK or android.content.Intent.FLAG_ACTIVITY_MULTIPLE_TASK or android.content.Intent.FLAG_ACTIVITY_NO_ANIMATION)
                .putExtra("text", text).putExtra("source", source)
        )
    }

    fun install(ctx: Context) {
        val app = ctx.applicationContext
        `in`.pdfstudio.reader.PdfReader.setSelectionNoteListener { text, file, page ->
            add(app, text, if (file.isBlank()) "PDF page $page" else "$file, page $page")
        }
    }
}
