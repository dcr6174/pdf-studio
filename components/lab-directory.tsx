'use client';
import {useState} from 'react';
import Link from '@/components/browser-link';
import {Timer,Calculator,Wallet,PenLine,NotebookPen,Palette,LayoutGrid,FlaskConical,BookOpen,Film,Type,Sparkles,Camera,Grid3X3,Image as ImageIcon,Paintbrush,Layers} from 'lucide-react';
import {printableTools} from '@/lib/lab-printables';
import {funTools} from '@/lib/fun-lab';
import {utilityTools} from '@/lib/lab-utilities';
import {experiments} from '@/lib/lab-tools';

const featured=[...utilityTools,...printableTools.map(t=>({...t,kind:'Create'})),{slug:'daily-mood-canvas',title:'Daily Mood Canvas',description:'Turn a mood into an expressive canvas, with photo, scribble and export options.',kind:'Create'},{slug:'whiteboard',title:'Whiteboard',description:'A blank canvas for diagrams, doodles and ideas.',kind:'Create'},{slug:'text-to-handwriting',title:'Text to handwriting',description:'Turn your words into handwritten-style notes.',kind:'Create'},{slug:'poster-collage',title:'Poster collage',description:'Build a colourful poster from your PDF pages.',kind:'Create'}];
const playful=funTools;
const more=experiments.filter(t=>['flipbook','pdf-to-gif'].includes(t.slug));
const icons:Record<string,typeof Timer>={'photo-strip':Camera,flashcards:BookOpen,'decision-wheel':Sparkles,pomodoro:Timer,calculator:Calculator,'finance-calculator':Wallet,whiteboard:Palette,'text-to-handwriting':PenLine,'practice-sheets':NotebookPen,'poster-collage':LayoutGrid,flipbook:BookOpen,'pdf-to-gif':Film,'word-cloud':Type,'page-palette':Palette,'mini-zine-maker':BookOpen,'photo-booth-strips':Camera,'custom-bingo':Grid3X3,'giant-poster':ImageIcon,'photo-coloring-page':Paintbrush,'printable-flashcards':Layers};
const categories=['All','Fun & Play','Focus','Calculate','Create'];
export function LabDirectory(){
 const [filter,setFilter]=useState('All');
 return <>
  <div className="lab-filter" role="group" aria-label="Lab categories">{categories.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div>
  {(filter==='All'||filter==='Fun & Play')&&<section className="lab-utility-group lab-group-play" id="fun-and-play" aria-labelledby="lab-play-heading">
   <div className="lab-play-heading"><span className="lab-play-label"><Sparkles size={16} aria-hidden="true"/>Fun & Play</span><h2 id="lab-play-heading">Make something unexpected.</h2><p>Make a quick photo strip, practise your own flashcards, or let the wheel choose your next adventure.</p></div>
   <div className="creative-grid lab-directory-grid">{playful.map(t=>{const Icon=icons[t.slug]||FlaskConical;return <Link href={'/lab/'+t.slug} key={t.slug}><span className="creative-icon"><Icon size={30} aria-hidden="true"/></span><h3>{t.title}</h3><p>{t.description}</p><span>Try it →</span></Link>;})}</div>
  </section>}
  {['Focus','Calculate','Create'].filter(g=>filter==='All'||g===filter).map(g=><section className={'lab-utility-group lab-group-'+g.toLowerCase()} key={g}><h2>{g}</h2><div className="creative-grid lab-directory-grid">{featured.filter(t=>t.kind===g).map(t=>{const Icon=icons[t.slug]||FlaskConical;return <Link href={'/lab/'+t.slug} key={t.slug}><span className="creative-icon"><Icon size={30} aria-hidden="true"/></span><h3>{t.title}</h3><p>{t.description}</p><span>Open tool →</span></Link>;})}</div></section>)}
 {(filter==='All'||filter==='Fun & Play')&&<details className="lab-utility-group"><summary>More experiments</summary><div className="creative-grid lab-directory-grid">{more.map(t=><Link href={'/lab/'+t.slug} key={t.slug}><h3>{t.title}</h3><p>{t.description}</p><span>Open experiment →</span></Link>)}</div></details>}
 </>;
}
