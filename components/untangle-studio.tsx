'use client';
import {useMemo,useRef,useState,type PointerEvent,type KeyboardEvent} from 'react';
import {crossingCount,generateUntangle,type Point} from '@/lib/spatial-puzzles';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;seed?:number;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
const color=['#ffd48c','#a4e1d7','#f1afbd','#b5b9f4','#c2ebac','#ffddac','#a3d5f9','#e9c2e9','#91c7aa','#f9c8a7'];
export function UntangleStudio({active,seed=0,onScore,onFinish,onSound}:Props){
 const [level,setLevel]=useState(0);
 const problem=useMemo(()=>generateUntangle(level,seed),[level,seed]);
 const [nodes,setNodes]=useState<Point[]>(()=>generateUntangle(0,seed).points);
 const [moves,setMoves]=useState(0),[earned,setEarned]=useState(0),[solved,setSolved]=useState(false),[hint,setHint]=useState<number|null>(null);
 const drag=useRef<number|null>(null);
 const crossings=crossingCount(nodes,problem.edges);
 const finishMove=(next:Point[])=>{
  if(!active||solved)return;
  setNodes(next);setMoves(v=>v+1);
  if(crossingCount(next,problem.edges)===0){
   const points=Math.max(40,Math.round(240/(1+moves*.055))),total=earned+points;
   setEarned(total);setSolved(true);onScore(total);onSound('goal');
   if(level===4)onFinish(true,'All five spatial tangles solved. You earned '+total+' points!');
  }else onSound('tap');
 };
 const put=(e:PointerEvent<SVGSVGElement>,id:number)=>{
  const bounds=e.currentTarget.getBoundingClientRect();
  const x=Math.max(28,Math.min(472,(e.clientX-bounds.left)*500/bounds.width));
  const y=Math.max(28,Math.min(343,(e.clientY-bounds.top)*370/bounds.height));
  const next=nodes.map((n,i)=>i===id?{x,y}:n);
  setNodes(next);return next;
 };
 const handleDown=(e:PointerEvent<SVGGElement>,id:number)=>{
  if(!active||solved)return;
  drag.current=id;
  (e.currentTarget.ownerSVGElement??e.currentTarget).setPointerCapture(e.pointerId);
  setHint(null);
 };
 const handleMove=(e:PointerEvent<SVGSVGElement>)=>{
  if(drag.current===null||!active||solved)return;
  put(e,drag.current);
 };
 const handleUp=(e:PointerEvent<SVGSVGElement>)=>{
  const id=drag.current;drag.current=null;
  if(id===null||!active||solved)return;
  const next=put(e,id);finishMove(next);
 };
 const keyMove=(e:KeyboardEvent<SVGGElement>,id:number)=>{
  if(!active||solved)return;
  const change:Record<string,[number,number]>={ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]};
  const direction=change[e.key];if(!direction)return;
  e.preventDefault();e.stopPropagation();
  const next=nodes.map((p,i)=>i===id?{x:Math.max(28,Math.min(472,p.x+direction[0])),y:Math.max(28,Math.min(343,p.y+direction[1]))}:p);
  finishMove(next);
 };
 const showHint=()=>{
  const involved=new Array(nodes.length).fill(0);
  for(let i=0;i<problem.edges.length;i++)for(let j=i+1;j<problem.edges.length;j++){
   const [a,b]=problem.edges[i],[c,d]=problem.edges[j];
   if(a===c||a===d||b===c||b===d)continue;
   const intersect=crossingCount(nodes,[problem.edges[i],problem.edges[j]]);
   if(intersect){for(const id of [a,b,c,d])involved[id]++;}
  }
  const worst=involved.indexOf(Math.max(...involved));setHint(worst);onSound('tap');
 };
 const advance=()=>{
  const next=level+1;if(next>4)return;
  setLevel(next);setNodes(generateUntangle(next,seed).points);setMoves(0);setSolved(false);setHint(null);
 };
 return <div className="spatial-game untangle-game">
  <div className="spatial-scoreline"><span>THREAD <b>{level+1} / 5</b></span><span>CROSSINGS <b className={crossings===0?'spatial-good':''}>{crossings}</b></span><span>MOVES <b>{moves}</b></span></div>
  <div className="spatial-intro"><b>{solved?'ALL LINES CLEAR!':'Drag the knots. Free the threads.'}</b><span>{solved?'Every thread is uncrossed.': 'Move the glowing knots until no lines cross. Shared endpoints are allowed.'}</span></div>
  <svg className="untangle-board" viewBox="0 0 500 370" role="group" aria-label={'Untangle level '+(level+1)+'. '+crossings+' line crossings. Drag the nodes to separate all thread crossings.'} onPointerMove={handleMove} onPointerUp={handleUp} onPointerCancel={()=>{drag.current=null;}}>
  <defs><radialGradient id="untangle-bg"><stop offset="0" stopColor="#2e5060"/><stop offset="1" stopColor="#162a41"/></radialGradient></defs>
  <rect width="500" height="370" rx="22" fill="url(#untangle-bg)"/>
  {Array.from({length:11},(_,i)=><path key={i} d={'M0 '+(26+i*32)+'H500'} stroke="#bde4e310" strokeWidth="1"/>)}
  {problem.edges.map(([a,b],i)=><line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={solved?'#9bf0c2':'#f4c2c0'} opacity={solved?'.92':'.75'} strokeWidth={solved?8:6} strokeLinecap="round"/>)}
  {nodes.map((node,i)=><g key={i} role="button" tabIndex={active&&!solved?0:-1} aria-label={'Move knot '+(i+1)+'. Use arrow keys or drag.'} onPointerDown={e=>handleDown(e,i)} onKeyDown={e=>keyMove(e,i)} style={{cursor:active&&!solved?'grab':'default',touchAction:'none'}}>
   {hint===i&&<circle cx={node.x} cy={node.y} r="31" fill="none" stroke="#ffe4a4" strokeWidth="5" strokeDasharray="8 5"/>}
   <circle cx={node.x} cy={node.y} r="23" fill={color[i%color.length]} stroke="#f8fbec" strokeWidth="3"/>
   <circle cx={node.x-6} cy={node.y-8} r="7" fill="#ffffff88"/>
   <text x={node.x} y={node.y+6} textAnchor="middle" fill="#193548" fontWeight="850" fontSize="17">{i+1}</text>
  </g>)}
  </svg>
  <div className="spatial-progress" role="status">{solved?'0 intersections — solved!':crossings+' intersections remaining'}</div>
  <div className="spatial-actions">{solved&&level<4?<button className="spatial-primary" disabled={!active} onClick={advance}>Next tangle →</button>:<><button disabled={!active||solved} onClick={showHint}>💡 Highlight a tangled knot</button><button disabled={!active||solved} onClick={()=>{setNodes(generateUntangle(level,seed).points);setMoves(0);setHint(null);}}>Restart puzzle</button></>}</div>
  <p className="spatial-help">Touch: drag a knot. Keyboard: focus a numbered knot and use arrow keys. The puzzle is solvable without any hidden tricks. Scoring happens only when all crossings are gone.</p>
 </div>;
}
