'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Search} from 'lucide-react';
import Link from '@/components/browser-link';
import {BuddyHero} from '@/components/buddy-hero';
import './home-motion-hero.css';

const scenes=[{word:'simpler.',task:'One happy document',tone:'violet'},{word:'smaller.',task:'Compress with care',tone:'coral'},{word:'organized.',task:'Bring your pages together',tone:'teal'},{word:'signed.',task:'Make it yours',tone:'blue'}];
export function HomeMotionHero({toolCount,onSearch,searchStatus,inlineSearch}:{toolCount:number;onSearch:()=>void;searchStatus:string;inlineSearch?:ReactNode}){
 const host=useRef<HTMLElement>(null);
 const [scene,setScene]=useState(0);
 useEffect(()=>{
  const node=host.current;if(!node)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,timer:ReturnType<typeof setInterval>|undefined;
  const sync=()=>{if(timer){clearInterval(timer);timer=undefined;}const run=visible&&!document.hidden&&!media.matches&&!matchMedia('(max-width:767px)').matches;node.dataset.motion=run?'running':'paused';if(run)timer=setInterval(()=>setScene(n=>(n+1)%scenes.length),3200);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.15});observer.observe(node);document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);sync();
  return()=>{if(timer)clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);};
 },[]);
 const current=scenes[scene];
 return <section ref={host} className="home-hero home-motion-hero" data-scene={scene} data-tone={current.tone} data-motion="paused">
  <div className="hero-copy motion-hero-copy"><p className="motion-kicker">A little less work. A little more possibility.</p><div className="mobile-home-heading" aria-hidden="true"><p className="mobile-home-title">Free PDF tools:<br/>edit, merge, compress, sign</p><p className="mobile-home-subtitle">Make your PDFs simpler.</p></div><div className="motion-headline-group"><span aria-hidden="true" className="motion-static-title">Make your PDFs</span><div className="motion-changing-group"><span aria-hidden="true" className="motion-word-slot"><span className="motion-word-sizer">organized.</span><span key={current.word} className="motion-word" style={{color:'var(--hero-accent)'}}>{current.word}</span></span><div className="motion-hero-art"><div className="motion-orbit" aria-hidden="true"><i className="motion-spark spark-one"/><i className="motion-spark spark-two"/><i className="motion-dot dot-one"/><i className="motion-dot dot-two"/></div><div className="motion-buddy"><BuddyHero/></div><svg className="motion-document" viewBox="0 0 250 155" role="img" aria-label={current.task}><g className="motion-stack-back"><rect x="71" y="21" width="108" height="124" rx="12"/></g><g className="motion-stack-mid"><rect x="61" y="15" width="108" height="124" rx="12"/></g><g className="motion-paper"><rect x="51" y="9" width="108" height="124" rx="12"/><path className="motion-paper-line" d="M69 35h56M69 48h70M69 61h62M69 74h45"/><path className="motion-signature" d="M69 106q10-28 17-23t-4 26q17-28 19-13t14-1q7-14 10-2t15-6"/><path className="motion-check" d="m118 107 8 8 17-21"/></g></svg><p className="motion-task" aria-hidden="true">{current.task}</p></div></div></div><p className="home-benefit-statement">{toolCount} free PDF tools. No sign-up. No watermarks.<br/>Your files stay on your device. <Link href="/check-it-yourself">Check it yourself</Link></p>{inlineSearch&&<div className="mobile-home-inline-search">{inlineSearch}</div>}<button type="button" className="search hero-search tool-search-trigger" aria-haspopup="dialog" onClick={onSearch}><Search size={22} aria-hidden="true"/><span>Find a PDF tool — try “reduce size”</span></button><p id="search-status" className="search-status" role="status">{searchStatus}</p></div>

 </section>;
}

