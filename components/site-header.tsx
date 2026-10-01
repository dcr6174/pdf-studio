import Link from 'next/link';
import {ThemeToggle} from '@/components/theme-toggle';

/** Slim header for static pages (privacy, about) so they match the studio header. */
export function SiteHeader(){
 return <header className="site-header">
  <Link className="studio-wordmark" href="/"><img className="wordmark-logo" src="/brand/pdf-studio-logo-v4.svg" alt="" width="44" height="44"/><span>PDF <b>Studio</b></span></Link>
  <nav aria-label="Main navigation"><Link href="/">All tools</Link><Link href="/#shelf">My files</Link></nav>
  <div className="header-end"><ThemeToggle/></div>
 </header>;
}

/** Matching footer for static pages. */
export function SiteFooter(){
 return <footer className="site-footer">
  <span className="footer-brand"><img src="/brand/pdf-studio-logo-v4.png" alt="" width="22" height="22"/>PDF Studio</span>
  <div className="footer-links"><Link href="/">All tools</Link><Link href="/privacy">Privacy policy</Link><Link href="/about">About</Link></div>
 </footer>;
}
