'use client';
import {useEffect,useRef,useState,type RefObject} from 'react';
import type {TextObject} from '@/lib/text-worker-protocol';
import {editingFonts} from '@/lib/editing-font-catalog';
import type {EditingFont} from '@/lib/text-fonts';

type Props={objects:TextObject[];scanBounds?:{left:number;top:number;width:number;height:number};pageWidth:number;value:string;fontSize:number;color:string;lineHeight:number;spacing:number;paragraph:boolean;direction:'auto'|'ltr'|'rtl';inputRef:RefObject<HTMLTextAreaElement|null>;onChange:(value:string,caret:number)=>void;onDone:()=>void;onCancel:()=>void;onSettings:()=>void;background:string;fontChoice:string;uploadedFont?:EditingFont;fit:boolean};
export function InlinePDFText({objects,scanBounds,pageWidth,value,fontSize,color,lineHeight,spacing,paragraph,direction,inputRef,onChange,onDone,onCancel,onSettings,background,fontChoice,uploadedFont,fit}:Props){
 const frame=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[previewFont,setPreviewFont]=useState(''),[textScale,setTextScale]=useState(1);
 const left=scanBounds?.left??Math.min(...objects.map(o=>o.left)),top=scanBounds?.top??Math.min(...objects.map(o=>o.top));
 const width=scanBounds?.width??Math.max(...objects.map(o=>o.left+o.width))-left,height=scanBounds?.height??Math.max(...objects.map(o=>o.top+o.height))-top;
 const multiline=paragraph||/[\r\n]/.test(value);
 const font=objects[0]?.font??'';
 const family=/courier|mono/i.test(font)?'monospace':/times|serif/i.test(font)?'serif':'Arial, sans-serif';
 const displayedFamily=previewFont===fontChoice?`"PDFInline-${fontChoice}", ${family}`:family;
 useEffect(()=>{let valid=true;void document.fonts.ready.then(()=>{if(!valid)return;const context=document.createElement('canvas').getContext('2d');if(!context)return;context.font=`${fontSize}px ${displayedFamily}`;const measured=context.measureText(value).width+Math.max(0,value.length-1)*spacing;setTextScale(fit&&!multiline&&measured>0?Math.min(1,width*pageWidth/measured):1);});return()=>{valid=false;};},[value,fontSize,displayedFamily,spacing,fit,multiline,width,pageWidth]);
 useEffect(()=>{const page=frame.current?.parentElement;if(!page)return;const update=()=>setScale(page.getBoundingClientRect().width/pageWidth);update();const observer=new ResizeObserver(update);observer.observe(page);return()=>observer.disconnect();},[pageWidth]);
 useEffect(()=>{inputRef.current?.focus({preventScroll:true});frame.current?.scrollIntoView({block:'nearest',inline:'nearest'});},[inputRef]);
 useEffect(()=>{const preset=editingFonts.find(f=>f[0]===fontChoice);if(!preset&&!uploadedFont)return;let valid=true;const face=new FontFace('PDFInline-'+fontChoice,uploadedFont?uploadedFont.bytes.slice().buffer as ArrayBuffer:`url("${preset![2]}")`);void face.load().then(loaded=>{if(valid){document.fonts.add(loaded);setPreviewFont(fontChoice);}}).catch(()=>{});return()=>{valid=false;document.fonts.delete(face);};},[fontChoice,uploadedFont]);
 return <div ref={frame} className="nt-inline-frame" style={{left:`${left*100}%`,top:`${top*100}%`,width:`${width*100}%`,height:multiline&&!paragraph?`max(${height*100}%, ${fontSize*scale*lineHeight*Math.max(2,value.split('\n').length)}px)`:`${height*100}%`,background}}>
  <textarea ref={inputRef} aria-label="Edit text on PDF" aria-describedby="nt-inline-help" className="nt-inline-input" dir={direction} rows={multiline?Math.max(2,value.split('\n').length):1} wrap={multiline?'soft':'off'} value={value} spellCheck style={{color,fontSize:`${fontSize*scale*textScale}px`,fontFamily:displayedFamily,fontWeight:/bold/i.test(font)?700:400,fontStyle:/italic|oblique/i.test(font)?'italic':'normal',lineHeight:multiline?lineHeight:1.15,letterSpacing:`${spacing*scale}px`,background}} onChange={e=>onChange(e.target.value,e.target.selectionStart)} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onCancel();}else if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();onDone();}}}/>
  <div className={`nt-inline-toolbar ${top>.1?'nt-inline-toolbar-above':''}`} style={left>.6?{left:'auto',right:0}:undefined} role="group" aria-label="On-page text actions"><button type="button" onClick={onDone}>Done</button><button type="button" onClick={onCancel}>Cancel</button><button type="button" onClick={onSettings}>Style</button></div>
  <span id="nt-inline-help" className="nt-visually-hidden">Type directly on the PDF. Enter starts a new line. Ctrl or Command plus Enter saves. Escape cancels.</span>
 </div>;
}
