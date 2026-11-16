package `in`.pdfstudio.app

import android.content.Context
import `in`.pdfstudio.reader.PdfReader

/** Experimental tools switch. Off by default. Stored in the reader's own prefs through its Labs API. */
object Labs {
    @JvmStatic
    fun enabled(c: Context): Boolean = PdfReader.getLabsEnabled(c)

    fun set(c: Context, on: Boolean) { PdfReader.setLabsEnabled(c, on) }
}
