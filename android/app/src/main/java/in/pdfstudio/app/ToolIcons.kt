package `in`.pdfstudio.app

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

/** One icon per tool slug. Unknown slugs fall back to a category icon so no card is ever blank. */
object ToolIcons {
    private val bySlug: Map<String, ImageVector> by lazy {
        mapOf(
            "add-blank-pages" to Icons.Outlined.NoteAdd, "add-border-to-pdf" to Icons.Outlined.BorderOuter,
            "add-margins-to-pdf" to Icons.Outlined.CropFree, "add-page-numbers" to Icons.Outlined.Tag,
            "add-text-and-images" to Icons.Outlined.TextFields, "add-watermark" to Icons.Outlined.WaterDrop,
            "alternate-and-mix" to Icons.Outlined.Shuffle, "bates-numbering" to Icons.Outlined.FormatListNumbered,
            "compare-pdfs" to Icons.Outlined.Compare, "compress-pdf" to Icons.Outlined.Compress,
            "crop-margins" to Icons.Outlined.Crop, "crop-pdf-to-content" to Icons.Outlined.CropFree,
            "duplicate-pages" to Icons.Outlined.ContentCopy, "edit-metadata" to Icons.Outlined.EditNote,
            "extract-emails-phones" to Icons.Outlined.AlternateEmail, "extract-odd-even-pages" to Icons.Outlined.FilterList,
            "extract-text" to Icons.Outlined.TextSnippet, "file-fingerprint" to Icons.Outlined.Fingerprint,
            "find-possible-blank-pages" to Icons.Outlined.FindInPage, "flatten-pdf" to Icons.Outlined.Layers,
            "grayscale-pdf" to Icons.Outlined.FilterBAndW, "headers-and-footers" to Icons.Outlined.ViewHeadline,
            "invert-colours" to Icons.Outlined.InvertColors, "merge-pdf" to Icons.Outlined.MergeType,
            "mirror-pages" to Icons.Outlined.Flip, "pages-per-sheet" to Icons.Outlined.GridView,
            "pdf-booklet" to Icons.Outlined.MenuBook, "pdf-document-info" to Icons.Outlined.Info,
            "pdf-fold-lab" to Icons.Outlined.UnfoldMore, "pdf-page-sizes" to Icons.Outlined.Straighten,
            "pdf-text-by-page" to Icons.Outlined.Notes, "pdf-to-csv" to Icons.Outlined.TableChart,
            "pdf-to-epub" to Icons.Outlined.AutoStories, "pdf-to-html" to Icons.Outlined.Code,
            "pdf-to-jpg" to Icons.Outlined.Image, "pdf-to-json" to Icons.Outlined.DataObject,
            "pdf-to-markdown" to Icons.Outlined.Article, "pdf-to-png" to Icons.Outlined.Image,
            "pdf-to-powerpoint" to Icons.Outlined.Slideshow, "pdf-to-spreadsheet" to Icons.Outlined.TableView,
            "pdf-to-webp" to Icons.Outlined.Image, "pdf-to-word" to Icons.Outlined.Description,
            "pdf-word-counter" to Icons.Outlined.Calculate, "privacy-scanner" to Icons.Outlined.PrivacyTip,
            "remove-bookmarks" to Icons.Outlined.BookmarkRemove, "remove-embedded-files" to Icons.Outlined.AttachFile,
            "remove-pdf-annotations" to Icons.Outlined.SpeakerNotesOff, "remove-pdf-links" to Icons.Outlined.LinkOff,
            "remove-pdf-metadata" to Icons.Outlined.DeleteSweep, "resave-pdf" to Icons.Outlined.Save,
            "resize-pages" to Icons.Outlined.AspectRatio, "reverse-pages" to Icons.Outlined.SwapVert,
            "rotate-pdf" to Icons.Outlined.RotateRight, "set-pdf-open-view" to Icons.Outlined.Visibility,
            "sign-pdf" to Icons.Outlined.Draw, "split-every-page" to Icons.Outlined.CallSplit,
            "split-pdf" to Icons.Outlined.ContentCut, "split-pdf-in-half" to Icons.Outlined.VerticalSplit,
            "stamp-pdf" to Icons.Outlined.Verified, "unlock-pdf" to Icons.Outlined.LockOpen,
        )
    }

    fun forTool(slug: String, category: String): ImageVector = bySlug[slug] ?: when (category) {
        "Organise" -> Icons.Outlined.ViewAgenda
        "Edit" -> Icons.Outlined.Edit
        "Convert" -> Icons.Outlined.SwapHoriz
        "Secure" -> Icons.Outlined.Lock
        "Extract" -> Icons.Outlined.TextSnippet
        else -> Icons.Outlined.Description
    }
}
