package `in`.pdfstudio.app

import org.junit.Assert.assertEquals
import org.junit.Test

class RecentAccessTest {
    @Test fun okOpens() = assertEquals(RecentAction.OPEN, RecentAccess.decide(null))
    @Test fun lostGrantAsksRepick() = assertEquals(RecentAction.REPICK, RecentAccess.decide(SecurityException("x")))
    @Test fun missingFileReported() = assertEquals(RecentAction.MISSING, RecentAccess.decide(java.io.FileNotFoundException("x")))
    @Test fun unknownErrorStillTriesToOpen() = assertEquals(RecentAction.OPEN, RecentAccess.decide(IllegalStateException("x")))
}
