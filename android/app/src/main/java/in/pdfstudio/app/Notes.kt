package `in`.pdfstudio.app

import android.content.Context
import android.speech.tts.TextToSpeech
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.Locale

data class Note(val id: Long, val text: String, val source: String, val date: Long)

/** Local, offline notes: one small JSON file in the app's private storage. No account, nothing leaves the phone. */
object Notes {
    private const val MAX = 500
    private fun file(ctx: Context) = File(ctx.filesDir, "notes.json")

    @Synchronized
    fun load(ctx: Context): List<Note> = try {
        val a = JSONArray(file(ctx).takeIf { it.exists() }?.readText() ?: "[]")
        (0 until a.length()).map { val o = a.getJSONObject(it); Note(o.getLong("id"), o.getString("text"), o.optString("source"), o.getLong("date")) }
    } catch (_: Throwable) { emptyList() }

    @Synchronized
    fun add(ctx: Context, text: String, source: String) {
        val clean = text.trim()
        if (clean.isEmpty()) return
        val list = (listOf(Note(System.currentTimeMillis(), clean, source, System.currentTimeMillis())) + load(ctx)).take(MAX)
        save(ctx, list)
    }

    @Synchronized
    fun delete(ctx: Context, id: Long) = save(ctx, load(ctx).filter { it.id != id })

    private fun save(ctx: Context, list: List<Note>) {
        val a = JSONArray()
        list.forEach { a.put(JSONObject().put("id", it.id).put("text", it.text).put("source", it.source).put("date", it.date)) }
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

/** Hooks the reader's "Add to note" into the Notes store. Holds only the application context (no Activity leak). */
object NoteHook {
    fun install(ctx: Context) {
        val app = ctx.applicationContext
        in.pdfstudio.reader.PdfReader.setSelectionNoteListener { text, file, page ->
            Notes.add(app, text, if (file.isBlank()) "PDF page $page" else "$file, page $page")
            android.widget.Toast.makeText(app, "Saved to Notes", android.widget.Toast.LENGTH_SHORT).show()
        }
    }
}
