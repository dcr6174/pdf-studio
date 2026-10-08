'use client';
import {useEffect,useState,type RefObject} from 'react';
import './mobile-tool-headers.css';
export function useMobileToolHeader(host:RefObject<HTMLElement|null>){
 const [mobile,setMobile]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(max-width:767px)');const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!mobile||!host.current)return;const node=host.current,header=node.closest('.studio-shell')?.querySelector<HTMLElement>('.studio-header');if(!header)return;const update=()=>node.style.setProperty('--mobile-tool-header-height',header.getBoundingClientRect().height+'px');update();const observer=new ResizeObserver(update);observer.observe(header);return()=>{observer.disconnect();node.style.removeProperty('--mobile-tool-header-height');};},[mobile,host]);
 return mobile;
}
