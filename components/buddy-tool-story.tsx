'use client';
import {useEffect,useId,useState} from 'react';
import {BuddyHero} from '@/components/buddy-hero';
type Props={title:string;steps:string[];check:string;readOnly?:boolean};
export function BuddyToolStory({title,steps,check,readOnly=false}:Props){
 const [scene,setScene]=useState(0),[playing,setPlaying]=useState(false),[reduced,setReduced]=useState(true);
 const id=useId();
 const scenes=[
  {name:'The problem',text:`“Let’s make this document easier.” Here’s where ${title} comes in.`},
  {name:'Start here',text:steps[0]??'Open the tool and choose your document.'},
  {name:'Make your move',text:steps[1]??'Choose the options for your task.'},
  {name:'The result',text:readOnly?check:(steps[steps.length-1]??check)}
 ];
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPlaying(false);};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!playing||reduced)return;const timer=window.setTimeout(()=>{if(scene===3)setPlaying(false);else setScene(n=>n+1);},6000);return()=>window.clearTimeout(timer);},[scene,playing,reduced]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);},[]);
 return <section className="buddy-story" aria-labelledby={id} data-scene={scene} data-playing={playing&&!reduced}>
  <div className="buddy-story-heading"><div><span className="blog-eyebrow">A little story with Buddy</span><h2 id={id}>See the task in four moments</h2></div><button type="button" className="blog-quiet-button" onClick={()=>{if(reduced){setScene(0);return;}if(scene===3)setScene(0);setPlaying(p=>!p);}}>{reduced?'Back to start':playing?'Pause story':scene===3?'Replay story':'Play story'}</button></div>
  <div className="buddy-story-stage">
   <div className="buddy-story-character"><BuddyHero/></div>
   <div className="buddy-story-speech"><span className="blog-eyebrow">0{scene+1} / 04 · {scenes[scene].name}</span><p key={scene} className="buddy-story-caption">{scenes[scene].text}</p></div>
   <div className="buddy-story-pages" aria-hidden="true"><span className="story-paper">PDF<span/><span/><span/></span><span className="story-paper story-paper-back">PDF<span/><span/></span><span className="story-success">✓</span></div>
  </div>
  <div className="buddy-story-controls" aria-label="Story scenes">{scenes.map((s,i)=><button key={s.name} type="button" aria-pressed={scene===i} onClick={()=>{setPlaying(false);setScene(i);}}><span>0{i+1}</span>{s.name}</button>)}</div>
  <p className="story-note">Illustrated walkthrough · use the tool button above to work on your PDF.</p>
 </section>;
}
