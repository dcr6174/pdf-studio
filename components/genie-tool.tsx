import Link from '@/components/browser-link';
import {BookOpen,Camera,Sparkles} from 'lucide-react';

const icons={ 'photo-strip':Camera, flashcards:BookOpen, 'decision-wheel':Sparkles };

/** Native disclosure: tap, Enter or Space releases a tool without a timed navigation. */
export function GenieTool({slug,title,description,index}:{slug:string;title:string;description:string;index:number}){
 const Icon=icons[slug as keyof typeof icons]??Sparkles;
 return <details className={`lab-genie lab-genie-${index}`}>
  <summary>
   <span className="lab-lamp-stage" aria-hidden="true">
    <span className="lab-smoke"><i/><i/><i/></span>
    <svg className="lab-lamp" viewBox="0 0 280 180" fill="none">
     <ellipse cx="145" cy="164" rx="85" ry="8" fill="currentColor" opacity=".12"/>
     <path d="M205 89c58-41 66 14 31 30-10 5-22 3-31-1" stroke="currentColor" strokeWidth="12"/>
     <path d="M89 103C56 107 43 86 16 84c24 23 40 51 79 51" fill="currentColor"/>
     <path d="M89 102c4-27 116-27 122 0 9 43-36 54-62 54-36 0-73-18-60-54Z" fill="currentColor"/>
     <path d="M101 93q48-27 95 0" stroke="currentColor" strokeWidth="9" strokeLinecap="round"/>
     <path d="M139 78q10-24 20 0M126 151h47l11 10h-68Z" fill="currentColor"/>
     <path d="M107 111q42 21 86 0" stroke="white" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round"/>
     <path d="m146 115 5 8 9 2-7 6 1 10-8-5-8 5 1-10-7-6 9-2Z" fill="white" fillOpacity=".85"/>
    </svg>
    <span className="lab-lamp-icon"><Icon size={22}/></span><span className="lab-lamp-spark">✦</span>
   </span>
   <span className="lab-wish-number">WISH 0{index+1}</span>
   <span className="lab-wish-title">{title}</span>
   <span className="lab-lamp-tap"><span className="lab-release-label">Tap to release</span><span className="lab-close-label">Close wish</span><Sparkles size={16} aria-hidden="true"/></span>
  </summary>
  <div className="lab-wish-reveal"><p>{description}</p><Link className="lab-wish-open" href={'/lab/'+slug}>Open {title}<span aria-hidden="true">↗</span></Link></div>
 </details>;
}
