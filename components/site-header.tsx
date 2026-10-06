import {StudioHeader} from '@/components/studio-header';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {FooterActions} from '@/components/footer-actions';
import './site-footer.css';

export function SiteHeader(){return <StudioHeader/>;}
export function SiteFooter({tool='PDF Studio'}:{tool?:string}){
 return <footer className="site-footer pdf-site-footer"><div className="footer-inner">
  <div className="footer-intro"><Link href="/" className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v5.svg" alt="" width="28" height="28" loading="lazy"/>PDF Studio</Link><a className="footer-donate" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer">Donate <span aria-hidden="true">♡</span></a></div>
  <nav className="footer-columns" aria-label="Footer navigation">
   <div className="footer-group"><h2>Tools</h2><Link href="/tools">All tools</Link><Link href="/#shelf">My files</Link><Link href="/lab">Lab</Link></div>
   <div className="footer-group"><h2>Learn</h2><Link href="/guides">Guides</Link><Link href="/blog">Blog</Link><Link href="/check-it-yourself">Privacy check</Link></div>
   <div className="footer-group"><h2>Help</h2><Link href="/privacy">Privacy</Link><FooterActions tool={tool} compact/></div>
   <div className="footer-group"><h2>Company</h2><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
  </nav>
  <div className="footer-bottom"><span>Files stay on your device</span><span>© 2026 PDF Studio</span></div>
 </div></footer>;
}
