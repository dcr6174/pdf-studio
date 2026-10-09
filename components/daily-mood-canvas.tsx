'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {ArrowLeft,CalendarDays,Brush,Eraser,Sparkles,Trash2,Undo2} from 'lucide-react';
import {Slider} from '@/components/ui/slider';
import {renderMoodCanvas} from './mood-canvas-engine';
import type {Mark,Point} from './mood-canvas-engine';
import './daily-mood-canvas.css';

const inks=[{color:'#6246ea',name:'Electric violet'},{color:'#f15c42',name:'Tangerine'},{color:'#ee3982',name:'Hot pink'},{color:'#087f73',name:'Deep teal'},{color:'#2476df',name:'Bright blue'},{color:'#25252b',name:'Graphite'}];
const moods=[['🔥','Fired up'],['💡','An idea'],['⏳','Taking my time'],['🧘','Finding calm'],['🚀','Making progress']];
const prompts=['Draw your energy level as a shape.','Write your number one goal in giant letters.','Give your busiest thought a tiny, ridiculous hat.','Draw a path from where you are to where you want to be.','Turn today’s mood into a little weather forecast.','Write three words you want to carry into today.','Draw something imperfect and let it stay that way.','Make a constellation out of your small wins.','Draw what five minutes of calm looks like.','Write a kind note to your future self.'];

export function DailyMoodCanvas(){
  const canvas=useRef<HTMLCanvasElement>(null),surface=useRef<HTMLDivElement>(null);
  const marks=useRef<Mark[]>([]),active=useRef<Extract<Mark,{kind:'brush'|'eraser'}>|null>(null);
  const pointer=useRef<number|null>(null),frame=useRef<number|null>(null);
  const [tool,setTool]=useState<'brush'|'eraser'|'stamp'>('brush'),[color,setColor]=useState(inks[0].color),[size,setSize]=useState(6);
  const [emoji,setEmoji]=useState('🔥'),[count,setCount]=useState(0),[prompt,setPrompt]=useState(''),[day,setDay]=useState('Today');
  const [cursor,setCursor]=useState<Point|null>(null),[notice,setNotice]=useState(''),[cleared,setCleared]=useState(false);
  const backup=useRef<Mark[]|null>(null);
  const draw=useCallback(()=>{
    if(!canvas.current||!surface.current)return;
    const box=surface.current.getBoundingClientRect();
    renderMoodCanvas(canvas.current,marks.current,box.width,box.height,Math.min(window.devicePixelRatio||1,2));
  },[]);
  const queueDraw=()=>{if(frame.current===null)frame.current=requestAnimationFrame(()=>{frame.current=null;draw();});};
  useEffect(()=>{
    setDay(new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(new Date()));
    const observer=new ResizeObserver(draw);if(surface.current)observer.observe(surface.current);draw();
    return()=>{observer.disconnect();if(frame.current!==null)cancelAnimationFrame(frame.current);};
  },[draw]);
  useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(marks.current.length){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[]);
  function point(e:{clientX:number;clientY:number}):Point{const b=surface.current!.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y:Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))};}
  function start(e:ReactPointerEvent<HTMLCanvasElement>){
    if(pointer.current!==null||(e.pointerType==='mouse'&&e.button!==0))return;
    e.preventDefault();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);backup.current=null;setCleared(false);
    if(tool==='stamp'){marks.current.push({kind:'stamp',emoji,point:point(e)});setNotice(`${emoji} stamped`);}
    else{const mark={kind:tool,color,size:tool==='eraser'?size*5:size,points:[point(e)]};marks.current.push(mark);active.current=mark;}
    setCount(marks.current.length);queueDraw();
  }
  function move(e:ReactPointerEvent<HTMLCanvasElement>){
    const b=surface.current!.getBoundingClientRect();if(e.pointerType!=='touch')setCursor({x:e.clientX-b.left,y:e.clientY-b.top});
    if(pointer.current!==e.pointerId||!active.current)return;
    const events=e.nativeEvent.getCoalescedEvents?.()??[];
    for(const event of events.length?events:[e.nativeEvent])active.current.points.push(point(event));queueDraw();
  }
  function end(e:ReactPointerEvent<HTMLCanvasElement>){if(pointer.current!==e.pointerId)return;active.current=null;pointer.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);queueDraw();}
  function undo(){if(pointer.current!==null)return;if(backup.current){marks.current=backup.current;backup.current=null;setCleared(false);}else marks.current.pop();setCount(marks.current.length);setNotice('Last action undone');draw();}
  function clear(){if(pointer.current!==null||!marks.current.length)return;backup.current=marks.current;marks.current=[];setCount(0);setCleared(true);setNotice('Canvas cleared. Undo brings it back.');draw();}
  function dailyChallenge(){const now=new Date(),key=now.getFullYear()*372+now.getMonth()*31+now.getDate();setPrompt('Today’s challenge: '+prompts[key%prompts.length]);}
  function spark(){setPrompt(previous=>{const choices=prompts.filter(p=>p!==previous);return choices[Math.floor(Math.random()*choices.length)];});}
  return <main className="mood-lab">
    <div className="mood-surface" ref={surface}>
      <canvas ref={canvas} className="mood-canvas" aria-label="Daily drawing canvas. Use a mouse, touch or stylus to draw; select a mood then tap to stamp." onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onPointerLeave={()=>setCursor(null)}/>
      {count===0&&!cleared&&<div className="mood-invitation"><span>YOUR DAILY SCRATCHPAD</span><h1>A little space<br/>to make a <em>start.</em></h1><p>A thought, a doodle, a messy first line.<br/>It all belongs here.</p><span className="mood-invitation-hint">Pick a color. Make your first mark.</span></div>}
      {cursor&&<div aria-hidden="true" className={'mood-cursor '+(tool==='stamp'?'is-stamp':'')} style={{left:cursor.x,top:cursor.y,width:tool==='stamp'?48:tool==='eraser'?size*5:size+10,height:tool==='stamp'?48:tool==='eraser'?size*5:size+10,borderColor:tool==='eraser'?'#595963':color}}>{tool==='stamp'?emoji:null}</div>}
    </div>
    <header className="mood-header"><div className="mood-brand"><a href="/lab" aria-label="Back to Studio Lab"><ArrowLeft size={18}/></a><div><span>PDF STUDIO <b> / LAB</b></span><strong>Daily mood canvas</strong></div></div><div className="mood-header-right"><span className="mood-date">{day}</span><button className="mood-spark mood-challenge" onClick={dailyChallenge} aria-label="Today’s drawing challenge"><CalendarDays size={17}/><span>Daily challenge</span></button><button className="mood-spark" onClick={spark}><Sparkles size={17}/> Spark</button></div></header>
    {prompt&&<div className="mood-prompt" role="status"><Sparkles size={18}/><p>{prompt}</p><button aria-label="Dismiss prompt" onClick={()=>setPrompt('')}>×</button></div>}
    <aside className="mood-tray" aria-label="Daily mood anchors"><span>SET THE MOOD</span><div>{moods.map(([stamp,label])=><button key={stamp} aria-label={`Stamp ${label}`} title={label} aria-pressed={tool==='stamp'&&emoji===stamp} onClick={()=>{setTool('stamp');setEmoji(stamp);setNotice(`${label}: tap the canvas to stamp`);}}>{stamp}</button>)}</div><small>{tool==='stamp'?'Tap anywhere to stamp':'A tiny anchor for today'}</small></aside>
    <div className="mood-bottom"><div className="mood-toolbar" role="group" aria-label="Drawing tools"><div className="mood-tool-switch"><button aria-label="Brush" aria-pressed={tool==='brush'} onClick={()=>setTool('brush')}><Brush size={20}/><span>Brush</span></button><button aria-label="Eraser" aria-pressed={tool==='eraser'} onClick={()=>setTool('eraser')}><Eraser size={20}/><span>Eraser</span></button></div><div className="mood-inks" role="group" aria-label="Ink colors">{inks.map(ink=><button key={ink.color} aria-label={ink.name} aria-pressed={color===ink.color} style={{background:ink.color}} onClick={()=>{setColor(ink.color);setTool('brush');}}/>)}</div><div className="mood-size"><span id="mood-size-label">Size</span><Slider aria-labelledby="mood-size-label" min={2} max={18} step={1} value={[size]} onValueChange={v=>setSize(v[0])}/></div><div className="mood-actions"><button aria-label={cleared?'Undo clear':'Undo last mark'} title="Undo" disabled={!count&&!cleared} onClick={undo}><Undo2 size={19}/></button><button aria-label="Clear canvas" title="Clear canvas" disabled={!count} onClick={clear}><Trash2 size={19}/></button></div></div><p className="mood-footnote">No rules. No perfect lines. Just you. <span>Session only · leaving closes your canvas</span></p></div>
    <span className="mood-sr" role="status" aria-live="polite">{notice}</span>
  </main>;
}
