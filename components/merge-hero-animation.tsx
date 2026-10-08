'use client';
import {useEffect,useState,type CSSProperties} from 'react';
import {ArticleBuddy} from '@/components/buddy-tool-story';
const pages=['A1','A2','A3','B1','B2'];
/** Editorial illustration only; merging keeps each source document together. */
export function MergeHeroAnimation(){
 const [paused,setPaused]=useState(false);
 useEffect(()=>{const update=()=>setPaused(document.hidden);update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 return <figure className="merge-operation-hero" data-paused={paused} aria-label="Buddy combines PDF A and PDF B into one PDF in the order A1, A2, A3, B1, B2">
  <div className="merge-operation-buddy" aria-hidden="true"><ArticleBuddy pose={1}/></div>
  <svg viewBox="0 0 640 360" role="img" aria-labelledby="merge-hero-title merge-hero-description"><title id="merge-hero-title">Two PDFs become one</title><desc id="merge-hero-description">PDF A has three pages. PDF B has two. All A pages come first, followed by all B pages.</desc>
   <text className="merge-hero-label" x="134" y="40" textAnchor="middle">PDF A · 3 pages</text><text className="merge-hero-label" x="506" y="40" textAnchor="middle">PDF B · 2 pages</text>
   <path className="merge-hero-path" d="M148 176 Q148 210 244 218 M492 176 Q492 210 396 218" fill="none" strokeDasharray="5 7"/>
   <rect className="merge-hero-output" x="25" y="225" width="590" height="113" rx="18"/>
   {pages.map((label,i)=>{const a=i<3,slot=a?i:i-3;return <g key={label} className={'merge-hero-page '+(a?'merge-page-a':'merge-page-b')} style={{'--source-x':(a?82:454)+slot*13+'px','--source-y':70+slot*12+'px','--output-x':40+i*116+'px','--output-y':'238px','--page-delay':i*.22+'s'} as CSSProperties}><path d="M10 0H65L88 23V80Q88 90 78 90H10Q0 90 0 80V10Q0 0 10 0Z"/><path className="merge-page-fold" d="M65 0V17Q65 23 71 23H88"/><text x="44" y="49" textAnchor="middle">{label}</text><path className="merge-page-lines" d="M20 63H68M20 72H58"/></g>;})}
   <text className="merge-hero-label" x="320" y="354" textAnchor="middle">One PDF · A1 → A2 → A3 → B1 → B2</text>
  </svg>
  <figcaption>Two documents. One ordered PDF.</figcaption>
 </figure>;
}
