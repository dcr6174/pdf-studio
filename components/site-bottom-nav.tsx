'use client';
import {useEffect,useState} from 'react';
import {BottomNav} from '@/components/bottom-nav';

/** Mobile bottom navigation for every page that is not the Studio workspace (which mounts its own with in-page actions). */
export function SiteBottomNav(){
 const [show,setShow]=useState(false);
 useEffect(()=>{const t=setTimeout(()=>setShow(!document.querySelector('.bottom-nav')),0);return()=>clearTimeout(t);},[]);
 return show?<BottomNav searchHref="/tools#search"/>:null;
}
