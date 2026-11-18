# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# ---- v0.4.9 keep rules ----
-keep class in.pdfstudio.reader.** { *; }
-keep class in.pdfstudio.app.** { *; }
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * { @com.getcapacitor.PluginMethod public *; @android.webkit.JavascriptInterface public *; }
-keep class org.apache.cordova.** { *; }
-keep class com.tom_roush.pdfbox.** { *; }
-keep class com.tom_roush.fontbox.** { *; }
-keep class org.bouncycastle.jce.provider.** { *; }
-keep class org.bouncycastle.jcajce.provider.** { *; }
-keep class org.bouncycastle.asn1.** { *; }
-keep class com.googlecode.tesseract.** { *; }
-keep class com.googlecode.leptonica.** { *; }
-keep class io.legere.pdfiumandroid.** { *; }
-keep class com.shockwave.pdfium.** { *; }
-keepclasseswithmembernames class * { native <methods>; }
-dontwarn org.bouncycastle.**
-dontwarn javax.xml.stream.**
-dontwarn com.gemalto.jp2.**
-dontwarn org.apache.**
-dontwarn org.slf4j.**

-keep class com.k2fsa.sherpa.onnx.** { *; }
-keep class com.github.csukuangfj.piper.** { *; }
-dontwarn com.k2fsa.sherpa.onnx.**
-dontwarn com.github.csukuangfj.piper.**
