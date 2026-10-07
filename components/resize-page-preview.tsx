'use client';
import type {ReactNode} from 'react';
import type {Options} from '@/lib/pdf-client';
import {resizeSheet,resizePlacement} from '@/lib/page-layout';

export function ResizePagePreview({options,width,height,pageNumber,pageCount,children}:{options:Options;width:number;height:number;pageNumber:number;pageCount:number;children:ReactNode}){
 let sheet:[number,number]=[width,height],selected=true,error='';
 const range=options.resizeRange?.trim();
 if(range){try{selected=false;for(const token of range.split(',')){const match=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(token);if(!match)throw new Error('Enter pages such as 1, 3-5.');const start=Number(match[1]),end=Number(match[2]??match[1]);if(start<1||end<start||end>pageCount)throw new Error('Choose pages within this document.');if(pageNumber>=start&&pageNumber<=end)selected=true;}}catch(e){error=(e as Error).message;selected=false;}}
 try{if(selected)sheet=resizeSheet(options);}catch(e){error=(e as Error).message;selected=false;sheet=[width,height];}
 const p=selected?resizePlacement(width,height,sheet,options.resizeMode==='fill'):{x:0,y:0,width,height};
 return <figure className="resize-main-page"><figcaption>Page {pageNumber} of {pageCount} · {selected?`${options.resizeSize==='letter'?'Letter':options.resizeSize==='custom'?'Custom':'A4'} · ${options.resizeMode==='fill'?'Fill':'Fit'}`:'Original size'}</figcaption>{error&&<p role="status" className="muted">{error}</p>}<div className="resize-main-sheet" aria-label={`Page ${pageNumber} layout preview`} style={{aspectRatio:`${sheet[0]}/${sheet[1]}`,maxWidth:`min(100%, calc((100dvh - 230px) * ${sheet[0]/sheet[1]}))`}}><div className="resize-main-content" style={{left:`${p.x/sheet[0]*100}%`,top:`${(sheet[1]-p.y-p.height)/sheet[1]*100}%`,width:`${p.width/sheet[0]*100}%`,height:`${p.height/sheet[1]*100}%`}}>{children}</div></div></figure>;
}
