'use client';
import {useEffect,useRef,useState,type PointerEvent} from 'react';
import Image from '@/components/browser-image';
import {render} from '@/lib/pdf-client';
import type {WorkflowStepSettings} from '@/lib/workflow-recipes';
import './pdf-crop-editor.css';
type Edges={cropTop:string;cropRight:string;cropBottom:string;cropLeft:string};
export type WorkflowCropControl={settings:WorkflowStepSettings;onChange:(edges:Edges)=>void};
const sides=['Top','Right','Bottom','Left'] as const;
export function PdfCropEditor({bytes,width,height,rotation=0,settings,onChange}:{bytes:Uint8Array;width:number;height:number;rotation?:number;settings:WorkflowStepSettings;onChange:(edges:Edges)=>void}){
 const [image,setImage]=useState<{bytes:Uint8Array;src:string}>(),[error,setError]=useState(''),[draft,setDraft]=useState<number[]|null>(null);
 const drag=useRef<{pointer:number;x:number;y:number;edges:number[];handle:string;box:DOMRect}|null>(null);
 const raw=sides.map(s=>Math.max(0,Number(settings[('crop'+s) as keyof WorkflowStepSettings]??settings.margin??0)));
 const turns=((rotation%360+360)%360)/90,order=sides.map((_,i)=>(i+4-turns)%4),edges=draft??order.map(i=>raw[i]),w=turns%2?height:width,h=turns%2?width:height;
 useEffect(()=>{const controller=new AbortController();void render(bytes,0,1.25,undefined,0,controller.signal).then(canvas=>{try{if(!controller.signal.aborted)setImage({bytes,src:canvas.toDataURL('image/png')});}finally{canvas.width=0;canvas.height=0;}}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return()=>controller.abort();},[bytes]);
 function commit(next:number[]){const result={} as Edges;order.forEach((rawIndex,i)=>{result[('crop'+sides[rawIndex]) as keyof Edges]=String(Math.round(Math.min(500,next[i])));});onChange(result);}
 function start(e:PointerEvent<HTMLElement>,handle:string){if(e.button!==0)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);const box=e.currentTarget.closest('.pdf-crop-surface')!.getBoundingClientRect();drag.current={pointer:e.pointerId,x:e.clientX,y:e.clientY,edges:[...edges],handle,box};setDraft([...edges]);}
 function move(e:PointerEvent<HTMLElement>){const d=drag.current;if(!d||d.pointer!==e.pointerId)return;const dx=(e.clientX-d.x)/d.box.width*w,dy=(e.clientY-d.y)/d.box.height*h,next=[...d.edges],clamp=(n:number,max:number)=>Math.max(0,Math.min(500,max,n));
 if(d.handle==='move'){const x=Math.max(-next[3],next[1]-500,Math.min(next[1],500-next[3],dx)),y=Math.max(-next[0],next[2]-500,Math.min(next[2],500-next[0],dy));next[3]+=x;next[1]-=x;next[0]+=y;next[2]-=y;}
 else {if(d.handle.includes('n'))next[0]=clamp(next[0]+dy,h-next[2]-1);if(d.handle.includes('e'))next[1]=clamp(next[1]-dx,w-next[3]-1);if(d.handle.includes('s'))next[2]=clamp(next[2]-dy,h-next[0]-1);if(d.handle.includes('w'))next[3]=clamp(next[3]+dx,w-next[1]-1);}
 setDraft(next);}
 function finish(e:PointerEvent<HTMLElement>){if(drag.current?.pointer!==e.pointerId)return;if(draft)commit(draft);drag.current=null;setDraft(null);}
 return <div className="pdf-crop-editor"><p>Drag the corners to crop. Drag inside to move.</p><div className="pdf-crop-surface" style={{aspectRatio:w/h}}>{image?.bytes===bytes?<Image unoptimized width={width} height={height} src={image.src} alt="PDF page for cropping" draggable={false}/>:<span role="status">{error||'Loading page…'}</span>}<div className="pdf-crop-selection" style={{top:edges[0]/h*100+'%',right:edges[1]/w*100+'%',bottom:edges[2]/h*100+'%',left:edges[3]/w*100+'%'}} onPointerDown={e=>start(e,'move')} onPointerMove={move} onPointerUp={finish} onPointerCancel={()=>{drag.current=null;setDraft(null);}}>{(['nw','ne','sw','se'] as const).map(handle=><button type="button" key={handle} className={'pdf-crop-handle '+handle} aria-label={'Resize crop '+({nw:'top left',ne:'top right',sw:'bottom left',se:'bottom right'}[handle])} onPointerDown={e=>{e.stopPropagation();start(e,handle);}} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const next=[...edges],i=e.key==='ArrowUp'||e.key==='ArrowDown'?(handle.includes('n')?0:2):(handle.includes('w')?3:1),delta=(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1)*(i===1||i===2?-1:1);next[i]=Math.max(0,Math.min(500,(i%2?w:h)-next[(i+2)%4]-1,next[i]+delta*(e.shiftKey?10:1)));commit(next);}}/> )}</div></div><small>Applies these edge amounts to all pages. Cropped content stays in the PDF.</small></div>;
}
