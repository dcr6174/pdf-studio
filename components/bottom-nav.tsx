'use client';
import {useEffect,useState} from 'react';
import Link from '@/components/browser-link';
import {Home,LayoutGrid,Search,Clock3} from 'lucide-react';
import {getRecent} from '@/lib/recent-tools';
import './bottom-nav.css';

/** Mobile bottom navigation. Desktop keeps the sidebar; this renders below the md breakpoint only. */
export function BottomNav({onHome,onSearch}:{onHome?:()=>void;onSearch?:()=>void}){
 const [recent,setRecent]=useState(0);
 useEffect(()=>{let alive=true;queueMicrotask(()=>{if(alive)setRecent(getRecent().length);});return()=>{alive=false;};},[]);
 return <nav className="bottom-nav" aria-label="Primary">
  <Link href="/" onClick={e=>{if(onHome){e.preventDefault();onHome();}}}><Home size={22} aria-hidden="true"/><span>Home</span></Link>
  <Link href="/tools"><LayoutGrid size={22} aria-hidden="true"/><span>All tools</span></Link>
  <button type="button" onClick={onSearch}><Search size={22} aria-hidden="true"/><span>Search</span></button>
  <Link href="/tools?recent"><span className="bn-clock"><Clock3 size={22} aria-hidden="true"/>{recent>0&&<i aria-hidden="true">{recent}</i>}</span><span>Recent</span></Link>
 </nav>;
}
