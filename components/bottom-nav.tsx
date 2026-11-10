'use client';
import Link from '@/components/browser-link';
import {Home,LayoutGrid,Search,FolderOpen} from 'lucide-react';
import './bottom-nav.css';

/** Mobile bottom navigation. Desktop keeps the sidebar; this renders below the md breakpoint only. */
export function BottomNav({onHome,onSearch,searchHref}:{onHome?:()=>void;onSearch?:()=>void;searchHref?:string}){
 return <nav className="bottom-nav" aria-label="Primary">
  <Link href="/" onClick={e=>{if(onHome){e.preventDefault();onHome();}}}><Home size={22} aria-hidden="true"/><span>Home</span></Link>
  <Link href="/tools"><LayoutGrid size={22} aria-hidden="true"/><span>All tools</span></Link>
  {searchHref?<Link href={searchHref}><Search size={22} aria-hidden="true"/><span>Search</span></Link>:<button type="button" onClick={onSearch}><Search size={22} aria-hidden="true"/><span>Search</span></button>}
  <Link href="/#shelf"><FolderOpen size={22} aria-hidden="true"/><span>My files</span></Link>
 </nav>;
}
