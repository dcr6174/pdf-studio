'use client';
import {useMemo,useRef,useState,type PointerEvent,type KeyboardEvent} from 'react';
import {PACKING_LEVEL_COUNT,packingComplete,packingLevel,rotatePacking,validPackingMove,type PackingPlacement,type PackingTile,type Point} from '@/lib/spatial-puzzles';
import type {ArcadeEffect} from '@/lib/arcade-audio';
type Props={active:boolean;seed?:number;onScore:(n:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
const colors=['#fac58c','#9dddd1','#ebb4ce','#b8c6f7','#b6e59f'] as const;
const area=360,edge=20,size=64;
type Dragging={id:string;x:number;y:number};
export function ShapePackingStudio({active,seed=0,onScore,onFinish,onSound}:Props){
 const [stage,setStage]=useState(0);
 const level=useMemo(()=>packingLevel(stage),[stage]);
 const [placed,setPlaced]=useState<PackingPlacement[]>([]);
 const [history,setHistory]=useState<PackingPlacement[][]>([]);
 const [turns,setTurns]=useState<Record<string,number>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [dragging,setDragging]=useState<Dragging|null>(null);
 const [hover,setHover]=useState<Point|null>(null);
 const [notice,setNotice]=useState('Fill the 5 × 5 tray. Drag a piece from below, or tap a piece and then tap the board.');
 const [attempts,setAttempts]=useState(0),[totalScore,setTotalScore]=useState(0),[cleared,setCleared]=useState(false);
 const boardRef=useRef<SVGSVGElement|null>(null),pointerId=useRef<number|null>(null);
 const orders=useMemo(()=>level.pieces.map((p,i)=>level.pieces[(i*2+(stage+seed)%5)%5]),[level,stage,seed]);
 // Multiplication by 2 modulo 5 makes all five piece identities appear exactly once.
 const piece=(id:string|null):PackingTile|undefined=>level.pieces.find(p=>p.id===id);
 const rotation=(id:string)=>(turns[id]??(id.charCodeAt(0)+stage+seed)%4);
 const origin=(cx:number,cy:number):Point|null=>{
  const rect=boardRef.current?.getBoundingClientRect();
  if(!rect)return null;
  const x=(cx-rect.left)*area/rect.width,y=(cy-rect.top)*area/rect.height;
  return{x:Math.floor((x-edge)/size),y:Math.floor((y-edge)/size)};
 };
 const apply=(id:string,x:number,y:number)=>{
  if(!active||cleared)return;
  const candidate={id,x,y,turns:rotation(id)};
  if(!validPackingMove(level,placed,candidate)){
   setNotice('That piece collides with a neighbour or extends beyond the tray. Rotate it or try another gap.');
   onSound('miss');return;
  }
  const next=[...placed.filter(p=>p.id!==id),candidate];
  setHistory(h=>[...h,placed.map(p=>({...p}))]);
  setPlaced(next);setAttempts(n=>n+1);setSelected(null);setHover(null);onSound('tap');
  if(packingComplete(level,next)){
   setCleared(true);
   const points=Math.max(60,250-Math.max(0,attempts-5)*8);
   const tally=totalScore+points;setTotalScore(tally);onScore(tally);
   onSound('goal');setNotice('Perfect fit! All 25 squares packed with no overlap. Level cleared.');
   if(stage===PACKING_LEVEL_COUNT-1)onFinish(true,'All four pentomino boards packed. Total score '+tally+'.');
  }else setNotice('Nice fit! '+next.length+' / 5 shapes placed. Keep filling the board.');
 };
 const rotate=()=>{
  if(!selected||!active||cleared)return;
  const next=(rotation(selected)+1)%4;
  const current=placed.find(p=>p.id===selected);
  if(current&&!validPackingMove(level,placed,{...current,turns:next})){
   setNotice('Pick up that placed piece before rotating; there is no room here.');onSound('miss');return;
  }
  setTurns(t=>({...t,[selected]:next}));
  if(current){setHistory(h=>[...h,placed.map(p=>({...p}))]);setPlaced(p=>p.map(v=>v.id===selected?{...v,turns:next}:v));}
  onSound('tap');
 };
 const trayPointerDown=(e:PointerEvent<HTMLButtonElement>,id:string)=>{
  if(!active||cleared)return;
  pointerId.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);
  setSelected(id);setDragging({id,x:e.clientX,y:e.clientY});setHover(null);
 };
 const trayPointerMove=(e:PointerEvent<HTMLButtonElement>)=>{
  if(pointerId.current===e.pointerId)setDragging(d=>d?{...d,x:e.clientX,y:e.clientY}:null);
 };
 const trayPointerUp=(e:PointerEvent<HTMLButtonElement>,id:string)=>{
  if(pointerId.current!==e.pointerId)return;
  pointerId.current=null;setDragging(null);
  const pos=origin(e.clientX,e.clientY);
  if(pos&&pos.x>=0&&pos.y>=0&&pos.x<5&&pos.y<5)apply(id,pos.x,pos.y);
 };
 const placeBoard=(e:PointerEvent<SVGSVGElement>)=>{
  if(!active||cleared||!selected)return;
  const pos=origin(e.clientX,e.clientY);
  if(pos)apply(selected,pos.x,pos.y);
 };
 const nextLevel=()=>{
  if(!cleared||stage===PACKING_LEVEL_COUNT-1)return;
  setStage(v=>v+1);setPlaced([]);setHistory([]);setTurns({});setSelected(null);
  setCleared(false);setAttempts(0);setNotice('A new five-shape packing challenge. You can rotate every piece.');
 };
 const undo=()=>{
  if(!active||!history.length||cleared)return;
  setPlaced(history.at(-1)!.map(p=>({...p})));setHistory(h=>h.slice(0,-1));onSound('tap');
  setNotice('Previous placement restored.');setHover(null);
 };
 const picked=piece(selected),ghostCells=picked?rotatePacking(picked.cells,rotation(picked.id)):[];
 const ghostValid=selected&&hover?validPackingMove(level,placed,{id:selected,x:hover.x,y:hover.y,turns:rotation(selected)}):false;
 return <div className="spatial-game packing-game">
  <div className="spatial-scoreline"><span>BOARD <b>{stage+1}/{PACKING_LEVEL_COUNT}</b></span><span>FILLED <b>{placed.length*5}/25</b></span><span>PLACEMENTS <b>{attempts}</b></span></div>
  <div className="spatial-intro"><b>{cleared?'PERFECT FIT!':level.name}</b><span>Fit five different shapes into the square. Every cell counts. No overlaps or invisible matches.</span></div>
  <svg ref={boardRef} className="packing-board" viewBox="0 0 360 360" role="group" aria-label={'Five by five packing board, '+placed.length+' of five pieces placed'} onPointerMove={e=>{
   if(!selected||dragging)return;
   const p=origin(e.clientX,e.clientY);setHover(p);
  }} onPointerUp={placeBoard} onPointerLeave={()=>setHover(null)}>
   <defs><linearGradient id="packing-board-wood"><stop offset="0" stopColor="#ac8871"/><stop offset="1" stopColor="#835d59"/></linearGradient></defs>
   <rect width="360" height="360" rx="19" fill="url(#packing-board-wood)"/>
   <rect x="14" y="14" width="332" height="332" rx="7" fill="#192e3b" stroke="#e3cda6" strokeWidth="3"/>
   {Array.from({length:25},(_,i)=><rect key={i} x={edge+i%5*size+2} y={edge+Math.floor(i/5)*size+2} width={size-4} height={size-4} rx="6" fill={(Math.floor(i/5)+i%5)%2?'#284654':'#294c56'} stroke="#ffffff19"/>)}
   {placed.map((placement)=>{
    const tile=piece(placement.id)!,idx=level.pieces.findIndex(p=>p.id===tile.id),cells=rotatePacking(tile.cells,placement.turns);
    return <g key={tile.id} role="button" tabIndex={0} aria-label={'Pick up placed '+tile.id+' shape'} onClick={()=>{if(!active||cleared)return;setPlaced(v=>v.filter(p=>p.id!==tile.id));setHistory(h=>[...h,placed]);setTurns(t=>({...t,[tile.id]:placement.turns}));setSelected(tile.id);setNotice('Picked up shape '+tile.id+'. Move or rotate and drop it again.');}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(active&&!cleared){setPlaced(v=>v.filter(p=>p.id!==tile.id));setHistory(h=>[...h,placed]);setSelected(tile.id);}}}}>
     {cells.map((p,i)=><rect key={i} x={edge+(placement.x+p.x)*size+2} y={edge+(placement.y+p.y)*size+2} width={size-4} height={size-4} rx="7" fill={colors[idx%5]} stroke="#fff3db" strokeWidth="2"/>)}
     <text x={edge+(placement.x+cells[0].x+.5)*size} y={edge+(placement.y+cells[0].y+.62)*size} fontSize="17" fontWeight="850" textAnchor="middle" fill="#1c3d48">{tile.id}</text>
    </g>;
   })}
   {selected&&hover&&ghostCells.map((p,i)=><rect key={'ghost'+i} x={edge+(hover.x+p.x)*size+2} y={edge+(hover.y+p.y)*size+2} width={size-4} height={size-4} rx="7" fill={ghostValid?'#a9ead0':'#f1a4a4'} opacity=".53" stroke={ghostValid?'#f8ffe8':'#ffdedb'} strokeWidth="2" pointerEvents="none"/>)}
   {!selected&&<g opacity=".6"><text x="180" y="352" textAnchor="middle" fontSize="9" fill="#e5ecdc">SELECT A SHAPE BELOW</text></g>}
  </svg>
  <div className="spatial-progress" role="status">{notice}</div>
  <div className="packing-tray" aria-label="Packing pieces">
   {orders.map((tile,i)=>{
    const chosen=selected===tile.id,locked=placed.some(p=>p.id===tile.id),shape=rotatePacking(tile.cells,rotation(tile.id));
    return <button key={tile.id} className={'packing-piece'+(chosen?' is-selected':'')} disabled={!active||cleared||locked} aria-pressed={chosen} aria-label={'Shape '+tile.id+(locked?', already placed':'')+'. Select or drag to board.'}
      onClick={()=>{if(!locked){setSelected(tile.id);setNotice('Shape '+tile.id+' selected. Tap a board square or drag it into the tray. Rotate before dropping.');}}}
      onPointerDown={e=>trayPointerDown(e,tile.id)} onPointerMove={trayPointerMove} onPointerUp={e=>trayPointerUp(e,tile.id)} onPointerCancel={()=>{pointerId.current=null;setDragging(null);}}>
     <svg viewBox="0 0 102 103" aria-hidden="true">{shape.map((p,j)=><rect key={j} x={10+p.x*18} y={10+p.y*18} width="17" height="17" rx="3" fill={colors[level.pieces.indexOf(tile)%5]} stroke="#fff7e0" strokeWidth="1"/>)}</svg>
     <strong>{tile.id}</strong>
    </button>;
   })}
  </div>
  <div className="spatial-actions">
   {cleared&&stage<PACKING_LEVEL_COUNT-1?<button className="spatial-primary" disabled={!active} onClick={nextLevel}>Next packing board →</button>:<>
   <button disabled={!active||!selected||cleared} onClick={rotate}>↻ Rotate selected (R)</button>
   <button disabled={!active||!history.length||cleared} onClick={undo}>↶ Undo</button>
   <button disabled={!active||cleared} onClick={()=>{setPlaced([]);setHistory([]);setSelected(null);setNotice('Board cleared. Try a different arrangement.');}}>Restart board</button>
   </>}
  </div>
  {dragging&&<div className="packing-drag-ghost" style={{left:dragging.x+15,top:dragging.y-44}} aria-hidden="true">{dragging.id}</div>}
  <p className="spatial-help">Directly drag a shape into the wooden grid, or select it and tap a destination. Rotate to fit. Tap a placed shape to pick it up. Four complete authored pentomino boards, with no hidden timers.</p>
 </div>;
}
