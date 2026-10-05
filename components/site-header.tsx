import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {ThemeToggle} from '@/components/theme-toggle';

/** Slim header for static pages (privacy, about) so they match the studio header. */
export function SiteHeader(){
 return <header className="site-header">
  <Link className="studio-wordmark" aria-label="PDF Studio home" href="/"><Image unoptimized className="wordmark-lockup lockup-light" src="/brand/pdf-studio-lockup-v5.svg" alt="PDF Studio" width="160" height="40"/><Image unoptimized className="wordmark-lockup lockup-dark" src="/brand/pdf-studio-lockup-v5-dark.svg" alt="" aria-hidden="true" width="160" height="40"/></Link>
  <nav aria-label="Main navigation"><Link href="/tools">All tools</Link><Link href="/#shelf">My files</Link><Link href="/guides">Guides</Link></nav>
  <div className="header-end"><ThemeToggle/></div>
 </header>;
}

/** Matching footer for static pages. */
export function SiteFooter(){
 return <footer className="site-footer">
  <span className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v5.svg" alt="" width="22" height="22" loading="lazy"/>PDF Studio</span>
  <div className="footer-links"><Link href="/tools">All tools</Link><Link href="/privacy">Privacy policy</Link><Link href="/check-it-yourself">Check it yourself</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
 </footer>;
}
