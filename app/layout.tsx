import {themeBootstrapScript} from '@/lib/theme-policy';
import type { Metadata } from "next";
import "./globals.css";
import "./studio-brand.css";
import "./studio-motion.css";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "PDF Studio", statusBarStyle: "default" },
  metadataBase: new URL("https://pdf-studio.in"),
  title: { default: "PDF Studio — Free PDF Tools Online", template: "%s | PDF Studio" },
  description: "Edit supported PDF text, merge, split, compress and sign PDFs for free. A private browser workspace without accounts, file uploads or added watermarks.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "PDF Studio", locale: "en_IN", url: "https://pdf-studio.in", title: "PDF Studio — Free PDF Tools Online", description: "Free PDF tools with on-device document processing.", images: [{ url: "/social/home.png", width:1200, height:630, alt: "PDF Studio — Free online PDF tools" }] },
  twitter: { card: "summary_large_image", title: "PDF Studio — Free PDF Tools Online", description: "Merge, split, compress and sign PDFs in your browser.", images: ["/social/home.png"] },
  icons: { apple: "/brand/apple-touch-v4.png", icon: "/brand/pdf-studio-favicon-v4.svg", shortcut: "/brand/pdf-studio-logo-v4.png" },
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

