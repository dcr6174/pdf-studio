import type { Metadata } from "next";
import "./globals.css";
import "./studio-brand.css";

export const metadata: Metadata = {
  title: "PDF Studio — Free, open-source PDF studio",
  description: "Merge, organize, sign, redact and convert PDFs on your device. Free open-source tools, without watermarks.",
  icons: {
    icon: "/brand/pdf-studio-mark.png",
    shortcut: "/brand/pdf-studio-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
