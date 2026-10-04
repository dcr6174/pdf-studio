'use client';
import {useState} from 'react';

/** One digit that rolls up into place when it changes (the old digit slides out, the new one slides in). */
function Digit({digit}:{digit:string}){
 const [frame,setFrame]=useState({current:digit,old:digit});
 if(frame.current!==digit)setFrame({current:digit,old:frame.current});
 const old=frame.old;
 return <span className="reel" aria-hidden="true">
  {old!==digit&&<span key={'o'+old+digit} className="roll-out">{old}</span>}
  <span key={digit} className={old!==digit?'roll-in':undefined}>{digit}</span>
 </span>;
}

/**
 * Time text with rolling digits, like an odometer. Only the digits that change move,
 * once a minute. Screen readers get the plain time from the label; the reels are decoration.
 * If the shape of the text changes (9:59 to 10:00) it simply redraws without rolling.
 */
export function RollingTime({text,label}:{text:string;label?:string}){
 const shape=text.replace(/\d/g,'#');
 return <span className="rolling-time" role="img" aria-label={label??text} key={shape}>
  {[...text].map((ch,i)=>/\d/.test(ch)?<Digit key={i} digit={ch}/>:<span key={i} className="reel-sep" aria-hidden="true">{ch===' '?'\u00a0':ch}</span>)}
 </span>;
}
