package `in`.pdfstudio.app

/** What to do when a recent file is tapped. A failed probe never deletes the recent. */
enum class RecentAction { OPEN, REPICK, MISSING }

object RecentAccess {
    /** @param error null when the probe opened fine, else the exception thrown by it. */
    fun decide(error: Throwable?): RecentAction = when (error) {
        null -> RecentAction.OPEN
        is SecurityException -> RecentAction.REPICK          // grant lost: ask the user to pick it again
        is java.io.FileNotFoundException -> RecentAction.MISSING
        else -> RecentAction.OPEN                            // unknown provider hiccup: let the reader try
    }
}
