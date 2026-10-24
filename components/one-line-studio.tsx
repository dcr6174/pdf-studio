'use client';
import {useMemo,useRef,useState,type PointerEvent,type KeyboardEvent} from 'react';
import {TRAIL_LEVELS,isLegalTrailStep,trailComplete,trailKey,trailLevel} from '@/lib/line-trail';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;seed?:number;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
export function OneLineStudio({active,seed=0,onScore,onFinish,onSound}:Props){
 const [stage,setStage]=useState(0),[chain,setChain]=useState<number[]>([0]),[points,setPoints]=useState(0),[solved,setSolved]=useState(false),[notice,setNotice]=useState('Follow each line once, without lifting if possible. Tap dots or slide along the path.');
 const board=useMemo(()=>trailLevel(stage,seed),[stage,seed]);
 const dragging=useRef(false);
 const used=new Set(chain.slice(1).map((to,i)=>trailKey(chain[i],to)));
 const moveTo=(id:number)=>{
  if(!active||solved)return;
  const from=chain.at(-1)??board.start;
  if(!isLegalTrailStep(board.edges,used,from,id)){
   if(id!==from){setNotice('No unused line connects these two dots. Try another neighbour.');onSound('miss');}
   return;
  }
  const next=[...chain,id];setChain(next);
  const visited=new Set(next.slice(1).map((to,i)=>trailKey(next[i],to)));
  onSound('tap');
  if(trailComplete(board.edges,visited)){
   setSolved(true);const gain=Math.max(65,175-(next.length-board.edges.length-1)*8),total=points+gain;
   setPoints(total);onScore(total);onSound('goal');setNotice('Every line has been drawn exactly once. Graph complete!');
   if(stage===TRAIL_LEVELS-1)onFinish(true,'All five one-line drawing puzzles solved. Total '+total+' points.');
  }else setNotice(visited.size+' / '+board.edges.length+' lines traced. Keep following the untouched paths.');
 };
 const findDot=(e:PointerEvent<SVGSVGElement>)=>{
  const box=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-box.left)*480/box.width,y=(e.clientY-box.top)*340/box.height;
  const hit=board.points.findIndex(p=>Math.hypot(x-p.x,y-p.y)<28);
  return hit;
 };
 const pointerDown=(e:PointerEvent<SVGSVGElement>)=>{
  if(!active||solved)return;
  const id=findDot(e);
  if(id===chain.at(-1)){
   dragging.current=true;e.currentTarget.setPointerCapture(e.pointerId);
  }else if(id>=0)moveTo(id);
 };
 const pointerMove=(e:PointerEvent<SVGSVGElement>)=>{
  if(!dragging.current||!active||solved)return;
  const id=findDot(e);if(id>=0&&id!==chain.at(-1))moveTo(id);
 };
 const keyDot=(e:KeyboardEvent<SVGGElement>,id:number)=>{
  if((e.key==='Enter'||e.key===' ')&&active){e.preventDefault();e.stopPropagation();moveTo(id);}
 };
 const nextStage=()=>{if(!solved||stage===TRAIL_LEVELS-1)return;setStage(v=>v+1);setChain([0]);setSolved(false);setNotice('A new connected graph. Follow all its lines once.');};
 const undo=()=>{if(!active||solved||chain.length<=1)return;setChain(v=>v.slice(0,-1));setNotice('One edge undone. Choose another route.');};
 return <div className="fresh-casual spatial-game one-line-game">
  <div className="spatial-scoreline"><span>GRAPH <b>{stage+1} / {TRAIL_LEVELS}</b></span><span>LINES <b>{used.size} / {board.edges.length}</b></span><span>START <b>A</b></span></div>
  <div className="spatial-intro"><b>{solved?'ONE CONTINUOUS STROKE!':'Draw it in one stroke'}</b><span>Start at A, trace each line exactly once. Only legal neighbouring dots can be joined.</span></div>
  <svg className="one-line-board" viewBox="0 0 480 340" role="group" aria-label={'Graph '+(stage+1)+' with '+board.edges.length+' traceable segments. '+used.size+' already traced.'} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}}>
   <rect width="480" height="340" rx="21" fill="#1f2f50"/>
   {Array.from({length:6},(_,i)=><circle key={i} cx="240" cy="170" r={i*35+15} stroke="#c0d8e311" strokeWidth="2" fill="none"/>)}
   {board.edges.map(([a,b],i)=><line key={i} x1={board.points[a].x} y1={board.points[a].y} x2={board.points[b].x} y2={board.points[b].y} stroke={used.has(trailKey(a,b))?'#a7efd0':'#9eabd1'} strokeWidth={used.has(trailKey(a,b))?11:7} strokeLinecap="round" opacity={used.has(trailKey(a,b))?'1':'.8'}/>)}
   {chain.length>1&&<polyline points={chain.map(n=>board.points[n].x+','+board.points[n].y).join(' ')} fill="none" stroke="#e6fcb2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"/>}
   {board.points.map((p,i)=>{
    const selected=chain.at(-1)===i,reachable=!solved&&isLegalTrailStep(board.edges,used,chain.at(-1)??0,i);
    return <g key={i} role="button" tabIndex={active?0:-1} aria-label={'Dot '+String.fromCharCode(65+i)+(selected?', current':reachable?', reachable':'')} onClick={()=>moveTo(i)} onKeyDown={e=>keyDot(e,i)} style={{cursor:active?'pointer':'default'}}>
     {selected&&<circle cx={p.x} cy={p.y} r="29" fill="none" stroke="#ffe4a7" strokeWidth="5" strokeDasharray="7 4"/>}
     <circle cx={p.x} cy={p.y} r="22" fill={selected?'#ffdfa6':reachable?'#bcecd1':'#b2bdde'} stroke="#f9f7ed" strokeWidth="3"/>
     <text x={p.x} y={p.y+6} textAnchor="middle" fontSize="17" fontWeight="900" fill="#213148">{String.fromCharCode(65+i)}</text>
    </g>;
   })}
  </svg>
  <p className="spatial-progress" role="status">{notice}</p>
  <div className="spatial-actions">{solved&&stage<TRAIL_LEVELS-1?<button className="spatial-primary" disabled={!active} onClick={nextStage}>Next graph →</button>:<>
   <button disabled={!active||solved||chain.length<=1} onClick={undo}>↶ Undo last line</button>
   <button disabled={!active||solved} onClick={()=>{setChain([0]);setNotice('All lines reset. Start at dot A.');}}>Restart graph</button>
   </>}</div>
  <p className="spatial-help">Touch: hold the current dot and drag to an adjacent dot. Tapping dots individually also works. Keyboard: focus dots and press Enter. You cannot score by retracing a line.</p>
 </div>;
}
