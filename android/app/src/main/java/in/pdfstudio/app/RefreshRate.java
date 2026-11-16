package in.pdfstudio.app;

import android.app.Activity;
import android.content.Context;
import android.view.Display;
import android.view.WindowManager;

// Picks the display mode closest to the chosen cap: 60 (battery), 90 (default
// balanced), 120 (smooth max). Phones without the cap get the highest mode at
// or below it, else the slowest available.
public class RefreshRate {
    static final String PREFS = "pdfstudio_settings";
    static final String KEY = "refresh_fps";

    static int desired(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getInt(KEY, 0);
    }

    static void setDesired(Context c, int fps) {
        c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putInt(KEY, fps).apply();
    }

    static void apply(Activity a) {
        int want = desired(a);
        if (want <= 0) return; // 0 = follow the system, never force a mode
        Display d = android.os.Build.VERSION.SDK_INT >= 30 ? a.getDisplay() : a.getWindowManager().getDefaultDisplay();
        if (d == null) return;
        Display.Mode[] modes = d.getSupportedModes();
        Display.Mode best = null;
        for (Display.Mode m : modes) {
            float r = m.getRefreshRate();
            if (r <= want + 0.5f && (best == null || r > best.getRefreshRate())) best = m;
        }
        if (best == null) {
            for (Display.Mode m : modes) {
                if (best == null || m.getRefreshRate() < best.getRefreshRate()) best = m;
            }
        }
        if (best != null) {
            WindowManager.LayoutParams lp = a.getWindow().getAttributes();
            lp.preferredDisplayModeId = best.getModeId();
            a.getWindow().setAttributes(lp);
        }
    }
}
