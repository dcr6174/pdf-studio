'use client';
import {useEffect,useState} from 'react';
import Link from '@/components/browser-link';
import Image from '@/components/browser-image';
import {ToolsMenu} from '@/components/tools-menu';
import {AccentPicker} from '@/components/accent-picker';
import {ThemeToggle} from '@/components/theme-toggle';
import {CreativeMenu} from '@/components/creative-menu';
import './studio-header.css';
import {ToolsDrawer,type NavigationHistory} from '@/components/tools-drawer';
export function StudioHeader({onNavigate,disabled=false,shelf=false,owner=false,history}:{onNavigate?:(id:string)=>void;disabled?:boolean;shelf?:boolean;owner?:boolean;history?:NavigationHistory}){
 const [authenticatedOwner,setAuthenticatedOwner]=useState(owner);
 useEffect(()=>{const controller=new AbortController();fetch('/api/analytics/access',{credentials:'same-origin',cache:'no-store',signal:controller.signal}).then(r=>r.ok?r.json():{owner:false}).then(data=>setAuthenticatedOwner(typeof data==='object'&&data!==null&&'owner' in data&&data.owner===true)).catch(()=>{});return()=>controller.abort();},[]);
 const home=(e:React.MouseEvent<HTMLAnchorElement>)=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('home');};
 const wordmark=<><Image unoptimized className="wordmark-lockup lockup-light" src="/brand/pdf-studio-lockup-light-v7.svg" alt="PDF Studio" width="160" height="40"/><Image unoptimized className="wordmark-lockup lockup-dark" src="/brand/pdf-studio-lockup-v7.svg" alt="" aria-hidden="true" width="160" height="40"/></>;
 return <header className="studio-header studio-shared"><div className="studio-brand-row"><div className="studio-wordmark"><ToolsDrawer onSelect={onNavigate} disabled={disabled} {...history}/><Link aria-label="PDF Studio home" href="/" onClick={home}>{wordmark}</Link></div><div className="header-end">{authenticatedOwner&&<Link className="owner-header-link" href="/analytics">Owner</Link>}<AccentPicker/><ThemeToggle/></div></div><nav id="studio-main-navigation" aria-label="Main navigation"><ToolsMenu onSelect={onNavigate} disabled={disabled}/><Link href="/#shelf" aria-current={shelf?'page':undefined} onClick={e=>{if(!onNavigate||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();onNavigate('shelf');}}>My files</Link><CreativeMenu disabled={disabled}/></nav></header>;
}
