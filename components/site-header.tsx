import {Heart} from 'lucide-react';
import {StudioHeader} from '@/components/studio-header';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {FooterActions} from '@/components/footer-actions';
import './site-footer.css';

export function SiteHeader(){return <StudioHeader/>;}
export function SiteFooter({tool='PDF Studio'}:{tool?:string}){
 return <footer className="site-footer pdf-site-footer"><div className="footer-inner">
  <div className="footer-intro"><Link href="/" className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v8-motion.svg" alt="" width="28" height="28" loading="lazy"/>PDF Studio</Link></div>
  <nav className="footer-columns" aria-label="Footer navigation">
   <div className="footer-group"><h2>Tools</h2><Link href="/tools">All tools</Link><Link href="/#shelf">My files</Link><Link href="/lab">Lab</Link></div>
   <div className="footer-group"><h2>Learn</h2><Link href="/guides">Guides</Link><Link href="/blog">Blog</Link><Link href="/check-it-yourself">Privacy check</Link></div>
   <div className="footer-group"><h2>Support</h2><Link href="/help">Help</Link><Link href="/faq">FAQ</Link><FooterActions tool={tool} compact action="report"/></div>
   <div className="footer-group"><h2>Company</h2><Link href="/about">About</Link><Link href="/contact">Contact</Link><a className="footer-donate" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer"><Heart size={17} aria-hidden="true"/>Donate</a></div>
  </nav>
  <div className="footer-bottom"><span>Files stay on your device</span><div className="footer-legal"><span>© 2026 PDF Studio</span><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><FooterActions tool={tool} compact action="preferences"/></div></div>
 </div></footer>;
}
