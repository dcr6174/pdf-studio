'use client';
import {useRef,useState,type PointerEvent} from 'react';
import {sketchStroke,type SketchPoint} from '../lib/sketch-box';
export type SketchStroke={x:number;y:number;w:number;h:number;image:string};
export function DirectPdfSketch({onStroke,onError}:{onStroke:(stroke:SketchStroke)=>void;onError:(message:string)=>void}){
 const points=useRef<SketchPoint[]>([]),pointer=useRef<number|null>(null);
 const [preview,setPreview]=useState<SketchPoint[]>([]);
 const point=(e:PointerEvent<SVGSVGElement>)=>{const r=e.currentTarget.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
 const reset=()=>{pointer.current=null;points.current=[];setPreview([]);};
 const finish=(e:PointerEvent<SVGSVGElement>)=>{
  if(pointer.current!==e.pointerId)return;e.stopPropagation();
  const samples=[...points.current,point(e)],r=e.currentTarget.getBoundingClientRect();
  try{const stroke=sketchStroke(samples,r.width,r.height);if(stroke)onStroke(stroke);}
  catch(error){onError(error instanceof Error?error.message:'Could not save this stroke. Try again.');}finally{reset();}
 };
 return <svg className="direct-pdf-sketch" role="img" aria-label="Sketch directly on the PDF. Choose Select and move to finish." viewBox="0 0 100 100" preserveAspectRatio="none"
  onPointerDown={e=>{e.stopPropagation();if(pointer.current!==null||e.button!==0)return;e.preventDefault();pointer.current=e.pointerId;points.current=[point(e)];setPreview([...points.current]);e.currentTarget.setPointerCapture(e.pointerId);}}
  onPointerMove={e=>{if(pointer.current!==e.pointerId)return;e.stopPropagation();if(points.current.length<8192)points.current.push(point(e));setPreview([...points.current]);}}
  onPointerUp={finish} onPointerCancel={e=>{if(pointer.current===e.pointerId)reset();}} onLostPointerCapture={e=>{if(pointer.current===e.pointerId)reset();}}>
  {preview.length>0&&<polyline points={preview.map(p=>p.x*100+','+p.y*100).join(' ')} fill="none" stroke="#1a293b" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>}
 </svg>;
}
