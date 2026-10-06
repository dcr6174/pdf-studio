'use client';
import {useEffect,useRef,useState} from 'react';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {ToolsMenu} from '@/components/tools-menu';
import {InstallApp} from '@/components/install-app';
import {ThemeToggle} from '@/components/theme-toggle';
import {CreativeMenu} from '@/components/creative-menu';
import './studio-header.css';
import {ToolsDrawer} from '@/components/tools-drawer';
export function StudioHeader({onNavigate,disabled=false,shelf=false,owner=false}:{onNavigate?:(id:string)=>void;disabled?:boolean;shelf?:boolean;owner?:boolean}){
 const brand=useRef<HTMLElement>(null),[pinned,setPinned]=useState(false);
 useEffect(()=>{const node=brand.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setPinned(entry.boundingClientRect.top<0&&entry.intersectionRatio<1),{threshold:[0,1]});observer.observe(node);return()=>observer.disconnect();},[]);
 const home=(e:React.MouseEvent<HTMLAnchorElement>)=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('home');};
 const wordmark=<><Image unoptimized className="wordmark-lockup lockup-light" src="/brand/pdf-studio-lockup-v5.svg" alt="PDF Studio" width="160" height="40"/><Image unoptimized className="wordmark-lockup lockup-dark" src="/brand/pdf-studio-lockup-v5-dark.svg" alt="" aria-hidden="true" width="160" height="40"/></>;
 return <header ref={brand} className="studio-header studio-shared"><div className={`studio-brand-row ${pinned?'brand-row-pinned':''}`}><div className="studio-wordmark"><ToolsDrawer onSelect={onNavigate} disabled={disabled}/><Link aria-label="PDF Studio home" href="/" onClick={home}>{wordmark}</Link></div><div className="header-end"><InstallApp/><ThemeToggle/></div></div><nav id="studio-main-navigation" aria-label="Main navigation"><ToolsMenu onSelect={onNavigate} disabled={disabled}/><Link href="/#shelf" aria-current={shelf?'page':undefined} onClick={e=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('shelf');}}>My files</Link><Link href="/guides">Guides</Link>{owner&&<Link href="/analytics">Owner</Link>}<CreativeMenu disabled={disabled}/></nav></header>;
}
