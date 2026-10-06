import {StudioHeader} from '@/components/studio-header';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';


/** Shared studio navigation on informational pages. */
export function SiteHeader(){return <StudioHeader/>;}

/** Matching footer for static pages. */
export function SiteFooter(){
 return <footer className="site-footer">
  <span className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v5.svg" alt="" width="22" height="22" loading="lazy"/>PDF Studio</span>
  <div className="footer-links"><Link href="/tools">All tools</Link><Link href="/privacy">Privacy policy</Link><Link href="/check-it-yourself">Check it yourself</Link><Link href="/about">About</Link><Link href="/blog">Blog</Link><Link href="/contact">Contact</Link></div>
 </footer>;
}
