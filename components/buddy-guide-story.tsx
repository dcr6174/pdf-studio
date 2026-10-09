'use client';
import {useEffect,useId,useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCircle2,FileText,Play,Pause,RotateCcw,SlidersHorizontal,Upload} from 'lucide-react';
import {ArticleBuddy} from '@/components/buddy-tool-story';

type Props={toolId?:string;steps:string[];check:string;toolName:string};
const titles:Record<string,string[]>={
 merge:['Choose your PDFs','Arrange the files','Merge the pages','Check the order'],
 rotate:['Open your PDF','Choose the pages','Turn the pages','Check orientation'],
 'cut-collect':['Open your sources','Select a region','Collect and arrange','Check the references'],
 'fold-lab':['Open your pages','Choose your layout','Build the print PDF','Check the sheets'],
 'attachment-map':['Main and support','Link a section','Build your pack','Test the index'],
 'sketch-pdf':['Open your canvas','Choose your ink','Draw on the page','Inspect your sketch'],
 reader:['Open your PDF','Choose your view','Read and navigate','Check what you found'],
};
export function BuddyGuideStory({toolId='',steps,check,toolName}:Props){
 const [scene,setScene]=useState(0),[playing,setPlaying]=useState(false),[reduced,setReduced]=useState(true);
 const id=useId();
 const names=titles[toolId]??['Get your document','Choose your approach','Follow through','Check the result'];
 const captions=[steps[0]??'Open the tool and choose your document.',steps[1]??'Follow the options described in this guide.',steps.slice(2).join(' ')||check,check];
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPlaying(false)};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{if(!playing||reduced)return;const timer=window.setTimeout(()=>{if(scene===3)setPlaying(false);else setScene(n=>n+1)},7000);return()=>clearTimeout(timer)},[scene,playing,reduced]);
 useEffect(()=>{const pause=()=>{if(document.hidden)setPlaying(false)};document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause)},[]);
 const select=(n:number)=>{setScene(n);setPlaying(false)};
 const Icon=[Upload,SlidersHorizontal,FileText,CheckCircle2][scene];
 return <section className="buddy-guide-story" aria-labelledby={id} data-playing={playing&&!reduced}>
  <div className="buddy-guide-heading"><div><span className="guide-byline">A little story with Buddy</span><h2 id={id}>{toolName}, in four moments</h2></div><button type="button" onClick={()=>{if(scene===3)setScene(0);setPlaying(p=>!p)}} disabled={reduced} aria-label={playing?'Pause Buddy story':'Play Buddy story'}>{playing?<Pause size={18}/>:<Play size={18}/>}<span>{playing?'Pause':'Play'}</span></button></div>
  <div className="buddy-guide-scenes" role="group" aria-label="Choose a story moment">{names.map((name,i)=><button key={i} type="button" aria-pressed={scene===i} onClick={()=>select(i)} aria-controls={id+'-panel'}><span>{i+1}</span>{name}</button>)}</div>
  <div className="buddy-guide-panel" id={id+'-panel'}>
   <div className="buddy-guide-picture" aria-hidden="true"><ArticleBuddy pose={scene}/><div className="buddy-guide-paper"><Icon size={34}/><span>{scene===3?'Check':scene===2?'Action':scene===1?'Options':'Source'}</span><i/><i/></div>{scene===3&&<CheckCircle2 className="buddy-guide-success" size={30}/>}</div>
   <div className="buddy-guide-caption"><span className="guide-byline">Moment {scene+1} of 4</span><h3>{names[scene]}</h3><p>{captions[scene]}</p></div>
  </div>
  <div className="buddy-guide-bottom"><button type="button" onClick={()=>select(scene-1)} disabled={scene===0}><ArrowLeft size={18}/>Previous</button><button type="button" onClick={()=>{setScene(0);setPlaying(!reduced)}} aria-label="Replay Buddy story"><RotateCcw size={18}/>Replay</button><button type="button" onClick={()=>select(scene+1)} disabled={scene===3}>Next<ArrowRight size={18}/></button></div>
  <p className="buddy-guide-note">An illustrated walkthrough, not a processing test.{reduced?' Reduced motion is on; choose each moment manually.':' Read at your own pace, or play the story.'}</p>
 </section>;
}
