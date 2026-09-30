import type { Metadata } from "next";
import "./globals.css";
import "./studio-brand.css";

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "PDF Studio", statusBarStyle: "default" },
  metadataBase: new URL("https://pdf-studio.in"),
  title: { default: "PDF Studio — Free PDF Tools Online", template: "%s | PDF Studio" },
  description: "Merge, split, compress, organize and sign PDFs for free. Process documents in your browser without accounts, file uploads or watermarks.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "PDF Studio", locale: "en_IN", url: "https://pdf-studio.in", title: "PDF Studio — Free PDF Tools Online", description: "Free PDF tools with on-device document processing.", images: [{ url: "/brand/pdf-studio-mark.png", alt: "PDF Studio logo" }] },
  twitter: { card: "summary", title: "PDF Studio — Free PDF Tools Online", description: "Merge, split, compress and sign PDFs in your browser.", images: ["/brand/pdf-studio-mark.png"] },
  icons: { apple: "/brand/pdf-studio-mark.png", icon: "/brand/pdf-studio-mark.png", shortcut: "/brand/pdf-studio-mark.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:"PDF Studio",url:"https://pdf-studio.in/",description:"Free PDF tools with on-device document processing",inLanguage:"en"})}}/>{children}</body>
    </html>
  );
}
