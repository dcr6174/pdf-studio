'use client';
import {useRef,useState,type PointerEvent} from 'react';
import {shapeFromDrag,type ShapePoint,type DrawShape} from '../lib/shape-geometry';
export function DirectPdfShape({kind,onShape,color,thickness,filled=false,opacity=.25}:{filled?:boolean;opacity?:number;color:string;thickness:number;kind:DrawShape;onShape:(shape:NonNullable<ReturnType<typeof shapeFromDrag>>)=>void}){
 const origin=useRef<ShapePoint|null>(null),pointer=useRef<number|null>(null);
 const [preview,setPreview]=useState<{start:ShapePoint;end:ShapePoint}|null>(null);
 const point=(e:PointerEvent<SVGSVGElement>)=>{const r=e.currentTarget.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
 const reset=()=>{origin.current=null;pointer.current=null;setPreview(null);};
 const box=preview?shapeFromDrag(kind,preview.start,preview.end):null;
 return <svg className="direct-pdf-sketch" role="img" aria-label={`Draw ${kind}: press at the starting point and drag to the endpoint.`} viewBox="0 0 100 100" preserveAspectRatio="none"
 onPointerDown={e=>{e.stopPropagation();if(pointer.current!==null||e.button!==0)return;e.preventDefault();pointer.current=e.pointerId;origin.current=point(e);setPreview({start:origin.current,end:origin.current});e.currentTarget.setPointerCapture(e.pointerId);}}
 onPointerMove={e=>{if(pointer.current===e.pointerId&&origin.current){e.stopPropagation();setPreview({start:origin.current,end:point(e)});}}}
 onPointerUp={e=>{if(pointer.current!==e.pointerId||!origin.current)return;e.stopPropagation();const result=shapeFromDrag(kind,origin.current,point(e));reset();if(result)onShape(result);}}
 onPointerCancel={e=>{if(pointer.current===e.pointerId)reset();}} onLostPointerCapture={e=>{if(pointer.current===e.pointerId)reset();}}>
 {preview&&(['line','arrow'].includes(kind)?<line x1={preview.start.x*100} y1={preview.start.y*100} x2={preview.end.x*100} y2={preview.end.y*100} stroke={color} strokeWidth={thickness} vectorEffect="non-scaling-stroke"/>:box&&kind==='rectangle'?<rect x={box.x*100} y={box.y*100} width={box.w*100} height={box.h*100} fill={filled?color:'none'} fillOpacity={filled?opacity:1} stroke={filled?'none':color} strokeWidth={thickness} vectorEffect="non-scaling-stroke"/>:box?<ellipse cx={(box.x+box.w/2)*100} cy={(box.y+box.h/2)*100} rx={box.w*50} ry={box.h*50} fill={filled?color:'none'} fillOpacity={filled?opacity:1} stroke={filled?'none':color} strokeWidth={thickness} vectorEffect="non-scaling-stroke"/>:null)}
 </svg>;
}
