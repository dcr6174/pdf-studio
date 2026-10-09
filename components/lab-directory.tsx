'use client';
import {useState} from 'react';
import Link from '@/components/browser-link';
import {Timer,Calculator,Wallet,PenLine,NotebookPen,Palette,LayoutGrid,FlaskConical,BookOpen,Film,Type,Sparkles} from 'lucide-react';
import {utilityTools} from '@/lib/lab-utilities';
import {experiments} from '@/lib/lab-tools';

const featured=[...utilityTools,{slug:'daily-mood-canvas',title:'Daily Mood Canvas',description:'Turn a mood into an expressive canvas, with photo, scribble and export options.',kind:'Create'},{slug:'whiteboard',title:'Whiteboard',description:'A blank canvas for diagrams, doodles and ideas.',kind:'Create'},{slug:'text-to-handwriting',title:'Text to handwriting',description:'Turn your words into handwritten-style notes.',kind:'Create'},{slug:'poster-collage',title:'Poster collage',description:'Build a colourful poster from your PDF pages.',kind:'Create'}];
const playful=experiments.filter(t=>['flipbook','word-cloud','page-palette','pdf-to-gif'].includes(t.slug));
const icons:Record<string,typeof Timer>={pomodoro:Timer,calculator:Calculator,'finance-calculator':Wallet,whiteboard:Palette,'text-to-handwriting':PenLine,'practice-sheets':NotebookPen,'poster-collage':LayoutGrid,flipbook:BookOpen,'pdf-to-gif':Film,'word-cloud':Type,'page-palette':Palette};
const categories=['All','Fun & Play','Focus','Calculate','Create'];
export function LabDirectory(){
 const [filter,setFilter]=useState('All');
 return <>
  <div className="lab-filter" role="group" aria-label="Lab categories">{categories.map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div>
  {(filter==='All'||filter==='Fun & Play')&&<section className="lab-utility-group lab-group-play" id="fun-and-play" aria-labelledby="lab-play-heading">
   <div className="lab-play-heading"><span className="lab-play-label"><Sparkles size={16} aria-hidden="true"/>Fun & Play</span><h2 id="lab-play-heading">Make something unexpected.</h2><p>Turn your pages into a moving GIF, a little flipbook, a word picture or a colourful palette. Pick an experiment and make it yours.</p></div>
   <div className="creative-grid lab-directory-grid">{playful.map(t=>{const Icon=icons[t.slug]||FlaskConical;return <Link href={'/lab/'+t.slug} key={t.slug}><span className="creative-icon"><Icon size={30} aria-hidden="true"/></span><h3>{t.title}</h3><p>{t.description}</p><span>Try it →</span></Link>;})}</div>
  </section>}
  {['Focus','Calculate','Create'].filter(g=>filter==='All'||g===filter).map(g=><section className={'lab-utility-group lab-group-'+g.toLowerCase()} key={g}><h2>{g}</h2><div className="creative-grid lab-directory-grid">{featured.filter(t=>t.kind===g).map(t=>{const Icon=icons[t.slug]||FlaskConical;return <Link href={'/lab/'+t.slug} key={t.slug}><span className="creative-icon"><Icon size={30} aria-hidden="true"/></span><h3>{t.title}</h3><p>{t.description}</p><span>Open tool →</span></Link>;})}</div></section>)}
 </>;
}
