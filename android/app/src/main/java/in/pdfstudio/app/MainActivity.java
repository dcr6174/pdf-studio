package in.pdfstudio.app;

import android.content.Intent;
import android.view.ActionMode;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import com.getcapacitor.BridgeWebViewClient;
import android.webkit.ConsoleMessage;
import java.util.ArrayList;
import com.getcapacitor.PluginHandle;
import in.pdfstudio.reader.PdfReader;

public class MainActivity extends BridgeActivity {
    private ActivityResultLauncher<Intent> readerLauncher;
    private ActivityResultLauncher<String[]> pickLauncher;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeFilesPlugin.class);
        super.onCreate(savedInstanceState);
        NoteHook.INSTANCE.install(this);
        PdfReader.setReadAloudHandler(text -> { Voice.INSTANCE.speak(this, text); return true; });
        PdfReader.setReadAloudFilter(text -> Voice.INSTANCE.isEnglish(text));
        RefreshRate.apply(this);
        boolean night = (getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK) == android.content.res.Configuration.UI_MODE_NIGHT_YES;
        int bg = night ? 0xFF0A0B10 : 0xFFF8F8FC;
        getWindow().getDecorView().setBackgroundColor(bg);
        if (getBridge() != null && getBridge().getWebView() != null) getBridge().getWebView().setBackgroundColor(bg);
        // Edge-to-edge (targetSdk 35+) draws the WebView under the status/navigation bars, so the site header
        // sat under the status bar. Pad the content view by the system-bar insets (app only; site CSS untouched).
        final android.view.View content = findViewById(android.R.id.content);
        androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
            androidx.core.graphics.Insets bars = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.systemBars() | androidx.core.view.WindowInsetsCompat.Type.displayCutout());
            androidx.core.graphics.Insets ime = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.ime());
            v.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
            return androidx.core.view.WindowInsetsCompat.CONSUMED;
        });

        readerLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            Intent data = result.getData();
            if (data != null && PdfReader.isEditToolsResult(data)) {
                // v0.3.4: the reader's web-editor handoff is switched off (user: tools must stay in the
                // reader). Reopen the same document in the reader instead of leaving to the site.
                Uri uri = data.getData();
                String name = data.getStringExtra(PdfReader.EXTRA_DISPLAY_NAME);
                if (uri != null) openReader(uri, name);
            } else if (data != null && "open_document".equals(data.getAction())) {
                pickLauncher.launch(new String[]{"application/pdf"});
            }
            // action "closed" and RESULT_CANCELED: leave the web screen as-is.
        });
        pickLauncher = registerForActivityResult(new ActivityResultContracts.OpenDocument(), uri -> {
            if (uri != null) openReader(uri, null);
        });

        intake(getIntent());
        installLoadDiagnostics();
    }

    // Text selection: Android's own floating toolbar (Copy, Select all, Share) plus Read aloud with the
    // download-on-demand English voice (Voice.kt), and Add to note. Read aloud is English-only: the item is
    // removed when the selection is not mostly A-Z letters, and Voice checks again on tap.
    @Override
    public void onActionModeStarted(ActionMode mode) {
        super.onActionModeStarted(mode);
        try {
            if (mode == null || mode.getMenu() == null) return;
            Menu menu = mode.getMenu();
            MenuItem read = menu.add(Menu.NONE, 0x7a01, 50, "Read aloud");
            read.setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);
            read.setOnMenuItemClickListener(item -> { readSelection(mode); return true; });
            MenuItem note = menu.add(Menu.NONE, 0x7a03, 49, "Add to note");
            note.setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);
            note.setOnMenuItemClickListener(item -> { noteSelection(mode); return true; });
            MenuItem stop = menu.add(Menu.NONE, 0x7a02, 51, "Stop reading");
            stop.setShowAsAction(MenuItem.SHOW_AS_ACTION_NEVER);
            stop.setOnMenuItemClickListener(item -> { Voice.INSTANCE.stop(); mode.finish(); return true; });
            WebView wv0 = getBridge() == null ? null : getBridge().getWebView();
            if (wv0 != null) {
                wv0.evaluateJavascript("(function(){return window.getSelection().toString();})()", raw -> {
                    if (!Voice.INSTANCE.isEnglish(jsText(raw))) {
                        try { menu.removeItem(0x7a01); } catch (Throwable ignored) { }
                    }
                });
            }
        } catch (Throwable ignored) { }
    }

    private static String jsText(String raw) {
        String text = raw == null ? "" : raw;
        if (text.length() >= 2 && text.startsWith("\"")) {
            try { text = new org.json.JSONArray("[" + text + "]").getString(0); } catch (Throwable e) { text = ""; }
        }
        return text;
    }

    private void noteSelection(ActionMode mode) {
        WebView wv = getBridge() == null ? null : getBridge().getWebView();
        if (wv == null) return;
        String title = wv.getTitle() == null ? "" : wv.getTitle().replace(" | PDF Studio", "").replace(" - PDF Studio", "").trim();
        wv.evaluateJavascript("(function(){return window.getSelection().toString();})()", raw -> {
            String text = raw == null ? "" : raw;
            if (text.length() >= 2 && text.startsWith("\"")) {
                try { text = new org.json.JSONArray("[" + text + "]").getString(0); } catch (Throwable e) { text = ""; }
            }
            mode.finish();
            if (text.trim().isEmpty()) return;
            NoteHook.INSTANCE.add(this, text, title);
        });
    }

    private void readSelection(ActionMode mode) {
        WebView wv = getBridge() == null ? null : getBridge().getWebView();
        if (wv == null) return;
        wv.evaluateJavascript("(function(){return window.getSelection().toString();})()", raw -> {
            final String say = jsText(raw).trim();
            mode.finish();
            if (say.isEmpty()) return;
            Voice.INSTANCE.speak(this, say);
        });
    }

    @Override
    public void onDestroy() {
        Voice.INSTANCE.stop();
        super.onDestroy();
    }

    // Shows the real WebView error (code, text, URL) instead of a blank error page, with Retry.
    private void installLoadDiagnostics() {
        if (getBridge() == null || getBridge().getWebView() == null) return;
        installConsoleCapture();
        getBridge().getWebView().setWebViewClient(new BridgeWebViewClient(getBridge()) {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (pendingRoute != null && url != null && (url.equals("https://pdf-studio.in/") || url.equals("https://pdf-studio.in"))) {
                    String r = pendingRoute;
                    pendingRoute = null;
                    view.loadUrl("https://pdf-studio.in" + r);
                    return;
                }
                checkSiteErrorScreen(view);
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) showLoadError(view, request.getUrl().toString(), error.getErrorCode() + " " + error.getDescription());
            }
            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse r) {
                super.onReceivedHttpError(view, request, r);
                if (request.isForMainFrame() && r.getStatusCode() >= 400) showLoadError(view, request.getUrl().toString(), "HTTP " + r.getStatusCode());
            }
        });
    }

    private final ArrayList<String> consoleErrors = new ArrayList<>();

    private void installConsoleCapture() {
        getBridge().getWebView().setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                if (m.messageLevel() == ConsoleMessage.MessageLevel.ERROR && consoleErrors.size() < 6) {
                    String t = m.message();
                    consoleErrors.add((t.length() > 300 ? t.substring(0, 300) : t) + " @" + m.sourceId() + ":" + m.lineNumber());
                }
                return super.onConsoleMessage(m);
            }
        });
    }

    private void checkSiteErrorScreen(WebView view) {
        view.postDelayed(() -> view.evaluateJavascript("!!document.getElementById('__next_error__')", v -> {
            if ("true".equals(v)) showLoadError(view, String.valueOf(view.getUrl()), "site error screen. JS errors: " + consoleErrors);
        }), 3500);
    }

    private void showLoadError(WebView view, String url, String detail) {
        String esc = (url + " - " + detail).replace("&", "&amp;").replace("<", "&lt;");
        String html = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head>"
            + "<body style='margin:0;padding:28px;background:#0a0a0a;color:#fff;font:16px system-ui'>"
            + "<h2>PDF Studio could not load</h2><p style='opacity:.8'>Check your connection, then retry.</p>"
            + "<p style='font:12px monospace;opacity:.7;word-break:break-all'>" + esc + "</p>"
            + "<button style='min-height:48px;padding:0 24px;border:0;border-radius:10px;font:600 16px system-ui' "
            + "onclick=\"location.href='https://pdf-studio.in'\">Retry</button></body></html>";
        view.loadDataWithBaseURL("https://pdf-studio.in/", html, "text/html", "utf-8", null);
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        intake(intent);
    }

    // Open with / share of a PDF lands in the native reader (Android 8+);
    // older devices and any reader failure fall back to the web intake.
    private String pendingRoute = null;

    private void intake(Intent intent) {
        // The glass bar stays visible over the Scan page (extra "bar" = position of the highlighted item).
        DockOverlay.update(this, intent != null && intent.hasExtra("bar") ? intent.getIntExtra("bar", -1) : -1);
        if (intent != null && "in.pdfstudio.app.OPEN_WEB".equals(intent.getAction())) {
            // From the native home: a tool tap (PDF + dest "tool:<slug>") or a plain site route.
            Uri data = intent.getData();
            String dest = intent.getStringExtra("dest");
            String route = intent.getStringExtra("route");
            if (data != null) {
                sendToWeb(data, intent.getStringExtra("name"), dest == null ? "reader" : dest);
            } else if (route != null && route.matches("/[a-z0-9/-]{1,80}")) {
                WebView wv = getBridge() == null ? null : getBridge().getWebView();
                // Open the action page directly (no home page first). pendingRoute stays as a fallback in case
                // the bridge's own start-up load of the home page lands after this one.
                pendingRoute = route;
                if (wv != null) wv.loadUrl("https://pdf-studio.in" + route);
            }
            return;
        }
        Uri uri = pdfUri(intent);
        if (uri != null) openReader(uri, null);
    }

    private void openReader(Uri uri, String name) {
        if (name == null) name = displayName(uri);
        if (PdfReader.isSupported()) {
            try {
                Intent ri = PdfReader.createIntent(this, uri, name);
                if (RefreshRate.desired(this) > 0) ri.putExtra("refresh_fps", RefreshRate.desired(this));
                ri.putExtra("dark_theme", (getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK) == android.content.res.Configuration.UI_MODE_NIGHT_YES);
                ri.putExtra("labs_enabled", Labs.enabled(this));
                readerLauncher.launch(ri);
                return;
            } catch (Exception ignored) {}
        }
        sendToWeb(uri, name, "reader");
    }

    private void sendToWeb(Uri uri, String name, String dest) {
        if (getBridge() == null) return;
        PluginHandle h = getBridge().getPlugin("NativeFiles");
        if (h != null) ((NativeFilesPlugin) h.getInstance()).intakeUri(uri, name, dest);
    }

    private static Uri pdfUri(Intent intent) {
        if (intent == null) return null;
        if (Intent.ACTION_VIEW.equals(intent.getAction())) return intent.getData();
        if (Intent.ACTION_SEND.equals(intent.getAction())) return intent.getParcelableExtra(Intent.EXTRA_STREAM);
        return null;
    }

    private String displayName(Uri uri) {
        String name = "document.pdf";
        try {
            Cursor c = getContentResolver().query(uri, null, null, null, null);
            if (c != null) {
                int i = c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (i >= 0 && c.moveToFirst()) name = c.getString(i);
                c.close();
            }
        } catch (Exception ignored) {}
        return name;
    }
}
