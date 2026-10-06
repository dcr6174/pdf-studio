import {StudioHeader} from '@/components/studio-header';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {FooterActions} from '@/components/footer-actions';
import './site-footer.css';

export function SiteHeader(){return <StudioHeader/>;}
export function SiteFooter({tool='PDF Studio'}:{tool?:string}){
 return <footer className="site-footer"><div className="footer-inner">
  <div className="footer-intro"><Link href="/" className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v5.svg" alt="" width="30" height="30" loading="lazy"/>PDF Studio</Link><p>A little simpler. A little more creative.<br/>PDF tools that work on your device.</p></div>
  <nav className="footer-columns" aria-label="Footer navigation">
   <div className="footer-group"><h2>Product</h2><Link href="/tools">All PDF tools</Link><Link href="/#shelf">My files</Link><Link href="/lab">Studio Lab</Link></div>
   <div className="footer-group"><h2>Resources</h2><Link href="/guides">Guides</Link><Link href="/blog">Blog</Link><Link href="/check-it-yourself">Check it yourself</Link></div>
   <div className="footer-group"><h2>Help &amp; privacy</h2><Link href="/privacy">Privacy policy</Link><FooterActions tool={tool}/></div>
   <div className="footer-group"><h2>About</h2><Link href="/about">About PDF Studio</Link><Link href="/contact">Contact us</Link><a className="footer-donate" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer">Donate <span aria-hidden="true">♡</span></a></div>
  </nav>
  <div className="footer-bottom"><span>Documents processed on your device</span><span>© 2026 PDF Studio</span></div>
 </div></footer>;
}
