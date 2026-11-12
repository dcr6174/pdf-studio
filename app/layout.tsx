import {ButtonFeedback} from '@/components/button-feedback';
import {SiteBottomNav} from '@/components/site-bottom-nav';
import {HandoffInjector} from '@/components/handoff-injector';
import {CONTACT_EMAIL} from '@/lib/contact';
import {themeBootstrapScript} from '@/lib/theme-policy';
import {startupGuardScript} from '@/lib/startup-guard';
import {StartupReady} from '@/components/startup-ready';
import {ServiceWorkerRegister} from '@/components/sw-register';
import {AppOpenBridge} from '@/components/app-open-bridge';
import {SiteAd} from '@/components/site-ad';
import {ResponsiveViewport} from '@/components/responsive-viewport';
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./studio-brand.css";
import "./studio-refresh.css";
import "./studio-buddy.css";
import "./audit-workspace.css";
import "./working-screen.css";
import "./audit-list-one.css";
import "./revamp.css";
import "./responsive-layout.css";
import "./premium-interactions.css";
import "./device-layout.css";
import "./studio-tokens.css";
import "./content-pages.css";
import "./tools-directory.css";
import "./future.css";
import "./material-buttons.css";
import "./file-buttons.css";

export const viewport: Viewport = {width:"device-width",initialScale:1,viewportFit:"cover",interactiveWidget:"resizes-content"};

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "PDF Studio", statusBarStyle: "default" },
  metadataBase: new URL("https://pdf-studio.in"),
  title: { default: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Sign-up", template: "%s | PDF Studio" },
  description: "100+ free PDF tools: edit text, merge, compress, sign and scan. No watermark, no sign-up. Designed to process files on your device.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "PDF Studio", locale: "en_IN", url: "https://pdf-studio.in", title: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Sign-up", description: "Edit, merge, compress, sign and scan PDFs free. No watermark, no sign-up.", images: [{ url: "/social/home.png", width:1200, height:630, alt: "PDF Studio — Free online PDF tools" }] },
  twitter: { card: "summary_large_image", title: "PDF Studio: Free PDF Editor & Tools, No Watermark, No Sign-up", description: "Edit, merge, compress, sign and scan PDFs free. No watermark, no sign-up.", images: ["/social/home.png"] },
  icons: { apple: "/brand/apple-touch-v9.png", icon: [{ url: "/brand/pdf-studio-favicon-v9.svg", type: "image/svg+xml" }, { url: "/brand/favicon-v10.ico", sizes: "48x48" }], shortcut: "/brand/app-192-v9.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><meta name="pdf-studio-release" content="audit-revamp-20261007"/><script dangerouslySetInnerHTML={{__html:themeBootstrapScript}}/><script dangerouslySetInnerHTML={{__html:startupGuardScript}}/><link rel="preload" href="/fonts/Outfit-Bold-subset.woff" as="font" type="font/woff" crossOrigin="anonymous"/></head>
      <body className="antialiased"><noscript><p style={{margin:0,padding:"12px 16px",background:"#17142E",color:"#fff",font:"15px/1.5 system-ui,sans-serif"}}>PDF Studio needs JavaScript to open and edit files. Please turn it on for this site.</p></noscript><StartupReady/><ServiceWorkerRegister/><AppOpenBridge/><ButtonFeedback/><ResponsiveViewport/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://pdf-studio.in/#website",name:"PDF Studio",url:"https://pdf-studio.in/",description:"Free PDF tools with on-device document processing",inLanguage:"en",publisher:{"@id":"https://pdf-studio.in/#organization"}},{"@type":"Organization","@id":"https://pdf-studio.in/#organization",name:"PDF Studio",url:"https://pdf-studio.in/",logo:"https://pdf-studio.in/brand/pdf-studio-logo-v7.svg",email:CONTACT_EMAIL,contactPoint:{"@type":"ContactPoint",contactType:"customer support",email:CONTACT_EMAIL}}]})}}/>{children}<HandoffInjector/><SiteBottomNav/><SiteAd/></body>
    </html>
  );
}

