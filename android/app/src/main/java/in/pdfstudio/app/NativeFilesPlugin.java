package in.pdfstudio.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "NativeFiles")
public class NativeFilesPlugin extends Plugin {
    static String pendingName = null;
    static String pendingPath = null;
    static String pendingDest = null;

    // Shared intake for Open with / share, the native reader's Edit / Tools
    // (dest "tools") and the web-reader fallback (dest "reader").
    void intakeUri(Uri uri, String name, String dest) {
        try {
            ContentResolver cr = getContext().getContentResolver();
            if (name == null) {
                name = "document.pdf";
                android.database.Cursor c = cr.query(uri, null, null, null, null);
                if (c != null) {
                    int i = c.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                    if (i >= 0 && c.moveToFirst()) name = c.getString(i);
                    c.close();
                }
            }
            File tmp = File.createTempFile("open-", ".bin", getContext().getCacheDir());
            try (InputStream in = cr.openInputStream(uri); OutputStream out = new FileOutputStream(tmp)) {
                byte[] buf = new byte[65536];
                int n; long total = 0;
                while ((n = in.read(buf)) > 0) { out.write(buf, 0, n); total += n; if (total > 200L*1024*1024) throw new IllegalStateException("too large"); }
            }
            pendingName = name; pendingPath = tmp.getAbsolutePath();
            pendingDest = dest == null ? "reader" : dest;
            JSObject ev = new JSObject();
            ev.put("name", pendingName);
            ev.put("dest", pendingDest);
            notifyListeners("openFile", ev);
        } catch (Exception ignored) {}
    }

    void intake(Intent intent) {
        if (intent == null) return;
        Uri uri = null;
        String action = intent.getAction();
        if (Intent.ACTION_VIEW.equals(action)) {
            uri = intent.getData();
        } else if (Intent.ACTION_SEND.equals(action)) {
            uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        }
        if (uri != null) intakeUri(uri, null, "reader");
    }

    @PluginMethod
    public void getPendingOpen(PluginCall call) {
        JSObject r = new JSObject();
        if (pendingPath == null) { r.put("hasFile", false); call.resolve(r); return; }
        try {
            File f = new File(pendingPath);
            byte[] bytes = new byte[(int) f.length()];
            try (FileInputStream in = new FileInputStream(f)) { int off=0,n; while(off<bytes.length && (n=in.read(bytes,off,bytes.length-off))>0) off+=n; }
            r.put("hasFile", true);
            r.put("name", pendingName);
            r.put("data", Base64.encodeToString(bytes, Base64.DEFAULT));
            r.put("dest", pendingDest == null ? "reader" : pendingDest);
            f.delete();
            pendingName = null; pendingPath = null; pendingDest = null;
            call.resolve(r);
        } catch (Exception e) {
            call.reject("read failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void setRefreshRate(PluginCall call) {
        Integer fps = call.getInt("fps");
        if (fps == null || (fps != 60 && fps != 90 && fps != 120)) { call.reject("fps must be 60, 90 or 120"); return; }
        RefreshRate.setDesired(getContext(), fps);
        if (getActivity() != null) RefreshRate.apply(getActivity());
        call.resolve();
    }

    @PluginMethod
    public void getRefreshRate(PluginCall call) {
        JSObject r = new JSObject();
        r.put("fps", RefreshRate.desired(getContext()));
        call.resolve(r);
    }

    @PluginMethod
    public void saveToDownloads(PluginCall call) {
        String name = call.getString("name");
        String data = call.getString("data");
        if (name == null || data == null) { call.reject("name and data required"); return; }
        try {
            byte[] bytes = Base64.decode(data, Base64.DEFAULT);
            ContentResolver cr = getContext().getContentResolver();
            if (Build.VERSION.SDK_INT >= 29) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.Downloads.DISPLAY_NAME, name);
                v.put(MediaStore.Downloads.IS_PENDING, 1);
                Uri uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                if (uri == null) throw new IllegalStateException("insert failed");
                try (OutputStream out = cr.openOutputStream(uri)) { out.write(bytes); }
                v.clear();
                v.put(MediaStore.Downloads.IS_PENDING, 0);
                cr.update(uri, v, null, null);
            } else {
                File dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                File f = new File(dir, name);
                try (FileOutputStream out = new FileOutputStream(f)) { out.write(bytes); }
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("save failed: " + e.getMessage());
        }
    }
}
