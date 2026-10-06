import {StudioHeader} from '@/components/studio-header';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import type {ReactNode} from 'react';
import './site-footer.css';

export function SiteHeader(){return <StudioHeader/>;}

export function SiteFooter({workspaceActions}:{workspaceActions?:ReactNode}){
 return <footer className="site-footer">
  <span className="footer-brand"><Image unoptimized src="/brand/pdf-studio-logo-v5.svg" alt="" width="22" height="22" loading="lazy"/>PDF Studio</span>
  <nav className="footer-links" aria-label="Footer navigation"><Link href="/tools">All tools</Link><Link href="/privacy">Privacy policy</Link><Link href="/check-it-yourself">Check it yourself</Link><Link href="/about">About</Link><Link href="/blog">Blog</Link><Link href="/contact">Contact</Link><a className="footer-donate" href="https://buymeacoffee.com/dcr6174" target="_blank" rel="noopener noreferrer">Donate <span aria-hidden="true">♡</span></a></nav>
  {workspaceActions&&<div className="footer-workspace-actions">{workspaceActions}</div>}
 </footer>;
}
