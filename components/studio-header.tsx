'use client';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {ToolsMenu} from '@/components/tools-menu';
import {InstallApp} from '@/components/install-app';
import {SupportLink} from '@/components/support-link';
import {ThemeToggle} from '@/components/theme-toggle';
import {CreativeMenu} from '@/components/creative-menu';
import './studio-header.css';
export function StudioHeader({onNavigate,disabled=false,shelf=false,owner=false}:{onNavigate?:(id:string)=>void;disabled?:boolean;shelf?:boolean;owner?:boolean}){
 return <header className="studio-header studio-shared"><Link className="studio-wordmark" aria-label="PDF Studio home" href="/" onClick={e=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('home');}}><Image unoptimized className="wordmark-lockup lockup-light" src="/brand/pdf-studio-lockup-v5.svg" alt="PDF Studio" width="160" height="40"/><Image unoptimized className="wordmark-lockup lockup-dark" src="/brand/pdf-studio-lockup-v5-dark.svg" alt="" aria-hidden="true" width="160" height="40"/></Link><nav aria-label="Main navigation"><ToolsMenu onSelect={onNavigate} disabled={disabled}/><Link href="/#shelf" aria-current={shelf?'page':undefined} onClick={e=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('shelf');}}>My files</Link><Link href="/guides">Guides</Link>{owner&&<Link href="/analytics">Owner</Link>}<CreativeMenu disabled={disabled}/></nav><div className="header-end"><SupportLink/><InstallApp/><ThemeToggle/></div></header>;
}
