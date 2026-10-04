'use client';
import {useEffect,useState} from 'react';
import {useNow} from '@/components/use-now';
import {RollingTime} from '@/components/rolling-clock';
import {GREETING_TAIL,dailyLine,formatClock,greetingFor} from '@/lib/time-of-day';
import type {Recoverable} from '@/lib/resume';

/**
 * A quiet welcome around Buddy: a greeting, the time and date (updated each minute, no ticking seconds)
 * and, only when a saved document can really be recovered, a way back into it.
 * Nothing here moves or changes while someone is reading.
 */
export function Welcome({draft,onResume,onDelete,busy}:{draft:Recoverable|null;onResume:()=>void;onDelete:()=>void;busy:boolean}){
 if(!draft)return null;
 return <div className="welcome" data-ready="true">

  {draft&&<div className="welcome-resume" role="group" aria-label="Continue your saved document">
   <p><b>Ready to continue?</b> <span>{draft.names.length===1?draft.names[0]:`${draft.names.length} files`} · {draft.pages} {draft.pages===1?'page':'pages'}</span></p>
   <div className="welcome-resume-actions"><button type="button" className="primary" disabled={busy} onClick={onResume}>Resume your document</button><button type="button" className="link-button" onClick={onDelete}>Delete saved draft</button></div>
  </div>}
 </div>;
}

/** One encouraging line for the day. Chosen once per visit from the local date, so it never changes while someone reads. */
export function DailyLine(){
 const [line,setLine]=useState('');
 useEffect(()=>{queueMicrotask(()=>setLine(dailyLine(new Date())));},[]);
 return <p className="daily-line" data-ready={line?'true':'false'}>{line&&`“${line}”`}</p>;
}

/** Quiet local clock, shown at the bottom of the homepage. */
export function LocalClock(){
 const now=useNow();
 const clock=now?formatClock(now):null;
 const iso=now?`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`:undefined;
 return <p className="welcome-meta" data-ready={clock?'true':'false'}>{clock&&<span className="clock-chip"><span className="clock-dot" aria-hidden="true"/><time dateTime={iso}><RollingTime text={clock.time}/></time><span className="clock-sep" aria-hidden="true">·</span><span className="clock-date">{clock.date}</span></span>}</p>;
}

/** Greeting stays beside the clock at the bottom of the homepage. */
export function Greeting(){
 const now=useNow();
 return <p className="welcome-greeting">{now&&<>{greetingFor(now)} <span>{GREETING_TAIL}</span></>}</p>;
}
