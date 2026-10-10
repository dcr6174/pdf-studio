'use client';
import {useRef,useState} from 'react';
import type {ReactNode} from 'react';
import {ArrowLeft,ChevronLeft,ChevronRight,Download,FileText,Hand,Highlighter,Lock,PenLine,Redo2,Trash2,Undo2,Upload,ZoomIn} from 'lucide-react';
import './sketch-pdf-workspace.css';

type Props={
 mainTool:boolean;file?:File;count:number;page:number;busy:boolean;drawing:boolean;ready:boolean;error:string;status:string;cancellable:boolean;
 pen:'pen'|'highlight'|'navigate';ink:string;thickness:number;canUndo:boolean;canRedo:boolean;hasStrokes:boolean;forms:boolean;flatten:boolean;
 upload:(files:FileList|null)=>void;cancel:()=>void;setPen:(pen:Props['pen'])=>void;setInk:(color:string)=>void;setThickness:(width:number)=>void;
 undo:(redo?:boolean)=>void;clear:()=>void;setFlatten:(value:boolean)=>void;setPage:(page:number)=>void;save:(pdf:boolean)=>void;
 resultVisible:boolean;resultScreen:ReactNode;children:ReactNode;
};
const colors=[['#6541e8','Violet'],['#222b3c','Black'],['#e64444','Red'],['#16836d','Green'],['#2874d0','Blue'],['#f2b624','Yellow']];
export function SketchPDFWorkspace(p:Props){
 const input=useRef<HTMLInputElement>(null),viewport=useRef<HTMLDivElement>(null);
 const [dragging,setDragging]=useState(false),[zoom,setZoom]=useState(1);
 const locked=p.busy||p.drawing;
 function open(files:FileList|null){setDragging(false);p.upload(files);}
 function changePage(next:number){p.setPage(next);viewport.current?.scrollTo({top:0,left:0});}
 const exportButtons=<><button className="sketch-save" disabled={locked||!p.ready} onClick={()=>p.save(true)}><Download size={18}/>Create sketched PDF</button><button className="sketch-save-image" aria-label="Save page as PNG" disabled={locked||!p.ready} onClick={()=>p.save(false)}><span className="sketch-png-long">Save page as PNG</span><span className="sketch-png-short" aria-hidden="true">Page PNG</span></button></>;
 return <main className={'sketch-workspace '+(p.file?'has-document':'is-empty')}>
   <div data-export-workspace tabIndex={-1} hidden={p.resultVisible}>
     <input ref={input} className="sketch-hidden-input" type="file" accept=".pdf,application/pdf" aria-label="Open PDF for sketching" disabled={locked} onChange={e=>{open(e.target.files);e.target.value='';}}/>
     <header className="sketch-heading"><div><a href={p.mainTool?'/':'/lab'} className="sketch-back"><ArrowLeft size={15}/>{p.mainTool?'PDF tools':'Studio Lab'}</a><h1>Sketch over a PDF</h1>{!p.file&&<p>Draw, highlight and make your point—right on the page.</p>}</div>{p.file&&<span className="sketch-local"><Lock size={14}/>On your device</span>}</header>
     {p.error&&<div className="sketch-error" role="alert">{p.error}</div>}
     {(p.busy||p.status&&p.status!=='PDF ready.'&&p.status!=='Download ready.')&&<div className="sketch-status" role="status"><span>{p.status}</span>{p.busy&&p.cancellable&&<button onClick={p.cancel}>Cancel</button>}</div>}
     {!p.file?<section className={'sketch-upload-card '+(dragging?'is-dragging':'')} aria-label="Upload a PDF" onDragEnter={e=>{e.preventDefault();setDragging(true);}} onDragOver={e=>e.preventDefault()} onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setDragging(false);}} onDrop={e=>{e.preventDefault();open(e.dataTransfer.files);}}>
       <div className="sketch-upload-symbol"><FileText size={32}/></div><h2>{dragging?'Drop your PDF to open it':'Your PDF is the canvas.'}</h2><p>Drop a file here to start drawing.</p><button className="sketch-save sketch-select-file" disabled={locked} onClick={()=>input.current?.click()}><Upload size={18}/>{p.busy?'Opening PDF…':'Choose PDF'}</button><span className="sketch-file-limit">One PDF · up to 50 MB · 100 pages</span><div className="sketch-upload-privacy"><Lock size={14}/><span>Processed on this device. Your PDF is not uploaded.</span></div>
     </section>:<>
       <div className="sketch-file-bar"><FileText size={20}/><div className="sketch-file-info"><strong title={p.file.name}>{p.file.name}</strong><span>{p.count} {p.count===1?'page':'pages'} · {p.file.size<1000000?Math.max(1,Math.round(p.file.size/1000))+' KB':(p.file.size/1000000).toFixed(2)+' MB'}</span></div><button disabled={locked} onClick={()=>input.current?.click()}>Replace PDF</button></div>
       <section className="sketch-editor" aria-label="PDF drawing workspace">
         <fieldset className="sketch-tool-row" disabled={locked} aria-label="Drawing tools">
           <div className="sketch-modes" role="group" aria-label="Drawing mode">{([['pen','Pen',PenLine],['highlight','Highlight',Highlighter],['navigate','Scroll',Hand]] as const).map(([value,label,Icon])=><button key={value} aria-pressed={p.pen===value} onClick={()=>p.setPen(value)}><Icon size={18}/>{label}</button>)}</div>
           <div className="sketch-ink-group" role="group" aria-label="Ink colors">{colors.map(([color,name])=><button key={color} className="sketch-swatch" title={name} aria-label={name+' ink'} aria-pressed={p.ink===color} style={{background:color}} onClick={()=>p.setInk(color)}/>)}<label className="sketch-custom-color" title="Custom ink color"><span className="sketch-sr">Custom ink color</span><input type="color" aria-label="Custom ink color" value={p.ink} onChange={e=>p.setInk(e.target.value)}/></label></div>
           <label className="sketch-width">Width<select aria-label="Stroke width" value={p.thickness} onChange={e=>p.setThickness(Number(e.target.value))}>{[2,4,8,12].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
           <div className="sketch-history" role="group" aria-label="Edit current page"><button title="Undo (Ctrl/Cmd+Z)" aria-label="Undo" disabled={!p.canUndo} onClick={()=>p.undo()}><Undo2 size={18}/></button><button title="Redo (Ctrl/Cmd+Shift+Z)" aria-label="Redo" disabled={!p.canRedo} onClick={()=>p.undo(true)}><Redo2 size={18}/></button><button className="sketch-clear" title="Clear drawings on this page" disabled={!p.hasStrokes} onClick={p.clear}><Trash2 size={17}/><span>Clear page</span></button></div>
         </fieldset>
         <div className="sketch-reader-bar"><div className="sketch-page-controls"><button aria-label="Previous page" disabled={locked||p.page===0} onClick={()=>changePage(p.page-1)}><ChevronLeft size={18}/></button><label>Page<select aria-label="Current page" value={p.page} disabled={locked} onChange={e=>changePage(Number(e.target.value))}>{Array.from({length:p.count},(_,i)=><option key={i} value={i}>{i+1}</option>)}</select><span>of {p.count}</span></label><button aria-label="Next page" disabled={locked||p.page===p.count-1} onClick={()=>changePage(p.page+1)}><ChevronRight size={18}/></button></div><span className="sketch-mode-hint">{p.pen==='navigate'?'Scroll to move through the page':p.pen==='highlight'?'Drag to highlight':'Draw with a mouse, finger or pen'}</span><label className="sketch-zoom"><ZoomIn size={16}/><span className="sketch-sr">Page zoom</span><select aria-label="Page zoom" value={zoom} disabled={p.drawing} onChange={e=>setZoom(Number(e.target.value))}><option value={1}>Fit width</option><option value={1.25}>125%</option><option value={1.5}>150%</option><option value={2}>200%</option></select></label></div>
         <div className={'sketch-page-viewport '+(p.pen==='navigate'?'is-scroll':'is-draw')} ref={viewport}><div className="sketch-document-sheet" style={{width:`${zoom*100}%`,maxWidth:760*zoom}}>{p.children}</div></div>
       </section>
       {p.forms&&<label className="sketch-form-option"><input type="checkbox" checked={p.flatten} disabled={locked} onChange={e=>p.setFlatten(e.target.checked)}/>Make fillable fields read-only for PDF export<span>Prevents fields from covering your drawings.</span></label>}
       <details className="sketch-help"><summary>Drawing help &amp; export details</summary><p>Choose Scroll to move through a page without drawing. On a focused canvas, arrow keys draw from the centre; hold Shift for longer lines. Ctrl/Cmd+Z undoes and Ctrl/Cmd+Shift+Z redoes.</p><p>PDF exports preserve original page content. Drawings are annotations, not secure redaction. Editing invalidates digital signatures. Download before leaving; this workspace is not automatically saved.</p></details>
       <footer className="sketch-action-bar"><div><strong>Keep your original. Save your sketches.</strong><span>PDF includes every page · PNG saves the current page</span></div><div className="sketch-export-actions">{exportButtons}</div></footer>
     </>}
   </div>
   {p.resultScreen}
 </main>;
}

