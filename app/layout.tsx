import {themeBootstrapScript} from '@/lib/theme-policy';
import type { Metadata } from "next";
import "./globals.css";
import "./studio-brand.css";
import "./studio-motion.css";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "PDF Studio", statusBarStyle: "default" },
  metadataBase: new URL("https://pdf-studio.in"),
  title: { default: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Upload", template: "%s | PDF Studio" },
  description: "Free PDF editor and tools: edit text, merge, compress, sign and scan. No watermark, no upload, no sign-up. Files stay on your device.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "PDF Studio", locale: "en_IN", url: "https://pdf-studio.in", title: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Upload", description: "Edit, merge, compress, sign and scan PDFs free. No watermark, no upload, no sign-up.", images: [{ url: "/social/home.png", width:1200, height:630, alt: "PDF Studio — Free online PDF tools" }] },
  twitter: { card: "summary_large_image", title: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Upload", description: "Edit, merge, compress, sign and scan PDFs free. No watermark, no upload.", images: ["/social/home.png"] },
  icons: { apple: "/brand/apple-touch-v5.png", icon: [{ url: "/brand/pdf-studio-favicon-v5.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }], shortcut: "/brand/pdf-studio-logo-v5.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:themeBootstrapScript}}/></head>
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"PDF Studio",url:"https://pdf-studio.in/",description:"Free PDF tools with on-device document processing",inLanguage:"en"})}}/>{children}</body>
    </html>
  );
}

