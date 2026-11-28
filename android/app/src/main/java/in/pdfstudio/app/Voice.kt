package `in`.pdfstudio.app

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Handler
import android.os.Looper
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import com.github.csukuangfj.piper.phonemize.piperPhonemizeInitialize
import com.github.csukuangfj.piper.phonemize.piperPhonemizeText
import com.k2fsa.sherpa.onnx.GeneratedAudio
import com.k2fsa.sherpa.onnx.GenerationConfig
import com.k2fsa.sherpa.onnx.OfflineTts
import com.k2fsa.sherpa.onnx.OfflineTtsConfig
import com.k2fsa.sherpa.onnx.OfflineTtsModelConfig
import com.k2fsa.sherpa.onnx.OfflineTtsVitsModelConfig
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.CancellationException
import java.util.concurrent.Executors

/**
 * Download-on-demand English read-aloud. sherpa-onnx (Apache-2.0) engine, Piper "joe" voice (CC0),
 * espeak-ng pronunciation data inside piper-phonemize (GPL-3.0, approved by the owner).
 * The voice (~65 MB) downloads only when the user taps Download; works offline after that.
 */
object Voice {
    private const val DIR = "voice"
    private const val MODEL = "en_US-joe-medium.onnx"
    private const val TOKENS = "tokens.txt"
    private const val MODEL_URL = "https://huggingface.co/csukuangfj/vits-piper-en_US-joe-medium/resolve/main/en_US-joe-medium.onnx"
    private const val TOKENS_URL = "https://huggingface.co/csukuangfj/vits-piper-en_US-joe-medium/resolve/main/tokens.txt"
    private const val MAX_CHARS = 4000

    private val io = Executors.newSingleThreadExecutor()
    private val ui = Handler(Looper.getMainLooper())

    private var tts: OfflineTts? = null
    private var phonemizeReady = false
    @Volatile private var track: AudioTrack? = null
    @Volatile private var playCancelled = false
    @Volatile private var dlCancelled = false
    @Volatile private var downloading = false

    // Dialogs and toasts must anchor to the activity the user is looking at. The reader is a
    // separate activity on top of ours; a captured host activity is paused, so its dialogs are
    // invisible (or throw, which the reader turns into a silent built-in-voice fallback).
    @Volatile private var current: Activity? = null
    private var tracking = false

    @Synchronized
    fun trackActivity(ctx: Context) {
        if (tracking) return
        tracking = true
        (ctx.applicationContext as? android.app.Application)?.registerActivityLifecycleCallbacks(object : android.app.Application.ActivityLifecycleCallbacks {
            override fun onActivityResumed(a: Activity) { current = a }
            override fun onActivityPaused(a: Activity) { if (current === a) current = null }
            override fun onActivityDestroyed(a: Activity) { if (current === a) current = null }
            override fun onActivityCreated(a: Activity, b: android.os.Bundle?) {}
            override fun onActivityStarted(a: Activity) {}
            override fun onActivityStopped(a: Activity) {}
            override fun onActivitySaveInstanceState(a: Activity, b: android.os.Bundle) {}
        })
    }

    private fun foreground(fallback: Activity): Activity = current ?: fallback

    private fun dir(ctx: Context) = File(ctx.filesDir, DIR)

    fun installed(ctx: Context): Boolean {
        val d = dir(ctx)
        return File(d, MODEL).length() > 50_000_000L && File(d, TOKENS).length() > 1_000L
    }

    fun installedMb(ctx: Context): Long = File(dir(ctx), MODEL).length() / 1_000_000L

    /** True when at least 85% of the letters are A-Z (English-only gate for Read aloud). */
    fun isEnglish(text: String): Boolean {
        var letters = 0
        var latin = 0
        for (c in text) if (c.isLetter()) { letters++; if (c in 'A'..'Z' || c in 'a'..'z') latin++ }
        return letters > 0 && latin * 100 >= letters * 85
    }

    fun delete(ctx: Context) {
        stop()
        try { tts?.free() } catch (_: Throwable) {}
        tts = null
        dir(ctx).deleteRecursively()
    }

    fun speak(activity: Activity, text0: String) {
        trackActivity(activity)
        if (Looper.myLooper() != Looper.getMainLooper()) {
            // Dialogs must be created on the UI thread; the reader may invoke us from any thread.
            ui.post { speak(activity, text0) }
            return
        }
        try {
            val text = text0.trim()
            if (text.isEmpty()) return
            if (!isEnglish(text)) {
                toast(activity, "Read aloud works on English text only")
                return
            }
            if (!installed(activity)) {
                askDownload(foreground(activity), text)
                return
            }
            io.execute { synthAndPlay(activity, text) }
        } catch (_: Throwable) {
            toast(activity, "Read aloud could not open. Try again.")
        }
    }

    fun stop() {
        playCancelled = true
        val t = track
        if (Looper.myLooper() == Looper.getMainLooper()) {
            t?.let { try { it.pause(); it.flush() } catch (_: Throwable) {} }
        } else {
            ui.post { t?.let { try { it.pause(); it.flush() } catch (_: Throwable) {} } }
        }
    }

    // ---- engine ----

    private fun ensureEngine(ctx: Context) {
        if (!phonemizeReady) {
            piperPhonemizeInitialize(ctx)
            phonemizeReady = true
        }
        if (tts == null) {
            val d = dir(ctx)
            val cfg = OfflineTtsConfig(
                model = OfflineTtsModelConfig(
                    vits = OfflineTtsVitsModelConfig(
                        model = File(d, MODEL).absolutePath,
                        tokens = File(d, TOKENS).absolutePath,
                    ),
                    numThreads = 2,
                    provider = "cpu",
                ),
            )
            tts = OfflineTts(null, cfg)
        }
    }

    private fun synthAndPlay(activity: Activity, text: String) {
        try {
            ensureEngine(activity)
            val t = tts ?: throw IllegalStateException("no engine")
            val say = if (text.length > MAX_CHARS) text.substring(0, MAX_CHARS) else text
            val lang = try { t.lang().ifEmpty { "en-us" } } catch (_: Throwable) { "en-us" }
            val res = piperPhonemizeText(say, lang) ?: throw IllegalStateException("phonemize failed")
            val phones: Array<IntArray> = try {
                Array(res.numSentences) { i -> res.getPhonemes(i) }
            } finally {
                res.close()
            }
            val cfg = GenerationConfig(sid = 0, speed = 1.0f)
            cfg.phonemeCodepoints = phones
            val audio = t.generateWithConfig("", cfg)
            play(audio)
        } catch (_: Throwable) {
            ui.post { toast(activity, "Read aloud failed on this phone") }
        }
    }

    private fun play(audio: GeneratedAudio) {
        stop()
        playCancelled = false
        val sr = audio.sampleRate
        val shorts = ShortArray(audio.samples.size) { i ->
            (audio.samples[i].coerceIn(-1f, 1f) * 32767f).toInt().toShort()
        }
        val min = AudioTrack.getMinBufferSize(sr, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_16BIT)
        val t = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(sr)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .build()
            )
            .setBufferSizeInBytes(maxOf(min, shorts.size * 2))
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()
        track = t
        try {
            t.play()
            var off = 0
            while (off < shorts.size && !playCancelled) {
                val w = t.write(shorts, off, minOf(8192, shorts.size - off))
                if (w <= 0) break
                off += w
            }
        } catch (_: Throwable) {
        } finally {
            try { t.stop(); t.release() } catch (_: Throwable) {}
            track = null
        }
    }

    // ---- download ----

    private fun askDownload(activity: Activity, text: String) {
        AlertDialog.Builder(activity)
            .setTitle("Download voice?")
            .setMessage("Read aloud needs the English voice, about 65 MB. It downloads once, works offline after that, and you can delete it in Settings. Use Wi-Fi if you can.")
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Download") { _, _ -> download(activity) { speak(activity, text) } }
            .show()
    }

    private fun download(activity: Activity, then: () -> Unit) {
        if (downloading) { toast(activity, "Voice download is already in progress"); return }
        downloading = true
        val status = TextView(activity)
        status.text = "Starting..."
        val bar = ProgressBar(activity, null, android.R.attr.progressBarStyleHorizontal)
        val pad = (20 * activity.resources.displayMetrics.density).toInt()
        val box = LinearLayout(activity)
        box.orientation = LinearLayout.VERTICAL
        box.setPadding(pad, pad / 2, pad, 0)
        box.addView(status)
        box.addView(bar, LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT))
        val dlg = AlertDialog.Builder(activity)
            .setTitle("Downloading voice")
            .setView(box)
            .setCancelable(false)
            .setNegativeButton("Cancel", null)
            .create()
        dlg.show()
        dlg.getButton(AlertDialog.BUTTON_NEGATIVE).setOnClickListener {
            dlCancelled = true
            dlg.dismiss()
        }
        dlCancelled = false
        io.execute {
            val d = dir(activity)
            try {
                d.mkdirs()
                val tk = File(d, "$TOKENS.part")
                val mf = File(d, "$MODEL.part")
                fetch(TOKENS_URL, tk, status, bar)
                fetch(MODEL_URL, mf, status, bar)
                if (dlCancelled) throw CancellationException()
                tk.renameTo(File(d, TOKENS))
                mf.renameTo(File(d, MODEL))
                ui.post {
                    downloading = false
                    dlg.dismiss()
                    if (installed(activity)) then() else toast(activity, "Download failed. Try again.")
                }
            } catch (_: CancellationException) {
                downloading = false
                File(d, "$TOKENS.part").delete(); File(d, "$MODEL.part").delete()
            } catch (_: Throwable) {
                downloading = false
                File(d, "$TOKENS.part").delete(); File(d, "$MODEL.part").delete()
                ui.post {
                    dlg.dismiss()
                    toast(activity, "Download failed. Check the connection and try again.")
                }
            }
        }
    }

    private fun fetch(url: String, out: File, status: TextView, bar: ProgressBar) {
        val conn = URL(url).openConnection() as HttpURLConnection
        conn.instanceFollowRedirects = true
        conn.connectTimeout = 15000
        conn.readTimeout = 30000
        try {
            conn.connect()
            val total = conn.contentLength.toLong()
            conn.inputStream.use { ins ->
                FileOutputStream(out).use { fos ->
                    val buf = ByteArray(64 * 1024)
                    var got = 0L
                    var lastUi = 0L
                    while (true) {
                        if (dlCancelled) throw CancellationException()
                        val n = ins.read(buf)
                        if (n < 0) break
                        fos.write(buf, 0, n)
                        got += n
                        if (got - lastUi > 512 * 1024) {
                            lastUi = got
                            val g = got; val tt = total
                            ui.post {
                            if (tt > 0) {
                                    bar.max = 1000
                                    bar.progress = ((g * 1000) / tt).toInt()
                                    status.text = "${g / 1_000_000} MB / ${tt / 1_000_000} MB"
                                } else {
                                    status.text = "${g / 1_000_000} MB"
                                }
                            }
                        }
                    }
                }
            }
        } finally {
            conn.disconnect()
        }
    }

    private fun toast(ctx: Context, msg: String) = Toast.makeText(ctx.applicationContext, msg, Toast.LENGTH_SHORT).show()
}
