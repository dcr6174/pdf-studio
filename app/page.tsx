'use client';
import { useEffect, useRef, useState } from 'react';
import { FileText, Search, Upload, ShieldCheck, Download, Plus, Merge, Scissors, Grid2X2, Minimize2, RotateCw, Copy, ArrowDownUp, Crop, PenLine, Droplets, Hash, Layers, Image as ImageIcon, Code2, BookOpen, Presentation, ScanLine, Volume2, LockKeyhole, UnlockKeyhole, Moon, Sun, X, Check, GripVertical, Trash2, ChevronLeft, ChevronRight, FolderOpen, HardDrive, GitBranch, Loader2, Undo2, MousePointer2, Highlighter, Type, Square, StopCircle, Redo2, Save, ZoomIn, ZoomOut, Eye, Circle, Link2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster, toast } from 'sonner';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tools, groups, accepted, isMulti } from '@/lib/tools';
import { loadFile, render, renderer, fields, processPDF, type Loaded, type PageItem, type Mark, type Options, type Output } from '@/lib/pdf-engine';
import { shelf, type ShelfFile } from '@/lib/shelf';
import { useActivityTracking, trackActivity } from '@/lib/activity-client';
import { seoTools } from '@/lib/seo-tools';
import {AlertDialog,AlertDialogContent,AlertDialogHeader,AlertDialogTitle,AlertDialogDescription,AlertDialogFooter,AlertDialogCancel,AlertDialogAction} from '@/components/ui/alert-dialog';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {useWorkspace,draft,type DocumentState} from '@/lib/workspace';
import {validateSelection,validatePages} from '@/lib/input-validation';
import {pageGeometry} from '@/lib/page-geometry';
const icons: Record<string, typeof FileText> = { merge: Merge, grid: Grid2X2, scissors: Scissors, compress: Minimize2, rotate: RotateCw, reverse: ArrowDownUp, copy: Copy, crop: Crop, edit: PenLine, pen: PenLine, shield: ShieldCheck, droplet: Droplets, numbers: Hash, layers: Layers, file: FileText, image: ImageIcon, text: Type, code: Code2, book: BookOpen, slides: Presentation, plus: Plus, moon: Moon, scan: ScanLine, audio: Volume2, lock: LockKeyhole, unlock: UnlockKeyhole, hash: Hash };
const searchAliases:Record<string,string>={images:'jpg jpeg png photo picture',word:'doc docx editable',compress:'reduce size smaller resume cv kb mb',organize:'delete remove rearrange reorder pages',sign:'signature autograph',ocr:'scan scanned searchable recognition',encrypt:'password security lock',decrypt:'unlock password',edit:'annotate annotation write highlight',form:'fill application checkbox'};
const defaults: Options = { range: '', text: '', title: '', author: '', subject: '', password: '', quality: 'balanced', angle: '90', margin: '20', start: '1', columns: '2', fields: {},flattenForm:false };
function Choice({ value, onChange, items, label }: {
    value: string;
    onChange: (v: string) => void;
    items: [
        string,
        string
    ][];
    label: string;
}) { return <label className="field"><span>{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger className="choice"><SelectValue /></SelectTrigger><SelectContent>{items.map(([v, t]) => <SelectItem key={v} value={v}>{t}</SelectItem>)}</SelectContent></Select></label>; }
function Thumb({ file, index, rotation = 0, large = false }: {
    file: Loaded;
    index: number;
    rotation?: number;
    large?: boolean;
}) { const [src, setSrc] = useState<string>(); const [error, setError] = useState(''); const holder = useRef<HTMLDivElement>(null); const [visible, setVisible] = useState(false); useEffect(() => { if (!holder.current)
    return; const obs = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) {
    setVisible(true);
    obs.disconnect();
} }, { rootMargin: '200px' }); obs.observe(holder.current); return () => obs.disconnect(); }, [large]); useEffect(() => { if (!visible)
    return; let active = true; setSrc(undefined); setError(''); if (file.image) {
    setSrc(file.image);
    return;
} render(file.bytes, index, large ? 1.4 : .25,undefined,rotation).then(c => { if (active)
    setSrc(c.toDataURL('image/jpeg', .85)); c.width = 0; c.height = 0; }).catch(() => active && setError('Preview unavailable')); return () => { active = false; }; }, [file.id, index, large, visible,rotation]); return <div ref={holder} className={large ? 'large-thumb' : 'thumb-shell'}>{src ? <img src={src} alt={`Page ${index + 1} of ${file.name}`} draggable={false}/> : <div className="thumb-loading">{error || <Loader2 className="spin" size={22}/>}</div>}</div>; }
function PageCard({ item, file, position, onRotate, onRemove, onMove, select, active }: {
    item: PageItem;
    file: Loaded;
    position: number;
    onRotate: () => void;
    onRemove: () => void;
    onMove: (d: number) => void;
    select: () => void;
    active: boolean;
}) { const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id }); return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .4 : 1 }} className={`page-card ${active ? 'chosen' : ''}`}><button className="drag-handle icon-button" aria-label={`Drag page ${position + 1}`} {...attributes} {...listeners}><GripVertical size={17}/></button><button className="page-preview" onClick={select} aria-label={`Select page ${position + 1}`}><Thumb file={file} index={item.index} rotation={item.rotation}/></button><div className="page-caption"><span>Page {position + 1}</span><span>{file.name}</span></div><div className="page-actions"><button aria-label={`Move page ${position + 1} earlier`} onClick={() => onMove(-1)}><ChevronLeft size={15}/></button><button aria-label={`Rotate page ${position + 1}`} onClick={onRotate}><RotateCw size={15}/></button><button aria-label={`Move page ${position + 1} later`} onClick={() => onMove(1)}><ChevronRight size={15}/></button><button aria-label={`Remove page ${position + 1}`} onClick={onRemove}><Trash2 size={15}/></button></div></article>; }
function Signature({onSave}:{onSave:(image:string)=>void}){
 const ref=useRef<HTMLCanvasElement>(null),down=useRef(false),ink=useRef(false);const [name,setName]=useState('');
 function point(e:React.PointerEvent<HTMLCanvasElement>){const c=e.currentTarget,r=c.getBoundingClientRect();return {x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
 return <Tabs defaultValue="draw"><TabsList><TabsTrigger value="draw">Draw</TabsTrigger><TabsTrigger value="type">Type</TabsTrigger><TabsTrigger value="upload">Upload</TabsTrigger></TabsList>
 <TabsContent value="draw"><p className="muted">Draw with a mouse or finger.</p><canvas aria-label="Signature drawing area. Use Type or Upload as alternatives." className="signature-pad" width={800} height={300} ref={ref} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);down.current=true;ink.current=true;const c=e.currentTarget.getContext('2d')!,p=point(e);c.beginPath();c.moveTo(p.x,p.y);c.lineWidth=4;c.strokeStyle='#172638';c.lineCap='round';c.lineTo(p.x+1,p.y);c.stroke();}} onPointerMove={e=>{if(down.current){const p=point(e),c=e.currentTarget.getContext('2d')!;c.lineTo(p.x,p.y);c.stroke();}}} onPointerUp={()=>down.current=false} onPointerCancel={()=>down.current=false}/><div className="row"><button className="secondary" onClick={()=>{ref.current!.getContext('2d')!.clearRect(0,0,800,300);ink.current=false;}}>Clear</button><button className="primary" onClick={()=>{if(!ink.current){toast.error('Draw a signature first.');return;}onSave(ref.current!.toDataURL('image/png'));}}>Use signature</button></div></TabsContent>
 <TabsContent value="type"><label className="field wide">Your name<input maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></label><p className="typed-signature">{name||'Your signature'}</p><button className="primary" disabled={!name.trim()} onClick={()=>{const c=document.createElement('canvas');c.width=800;c.height=220;const ctx=c.getContext('2d')!;ctx.fillStyle='#172638';ctx.font='italic 64px serif';const scale=Math.min(1,740/ctx.measureText(name).width);ctx.scale(scale,scale);ctx.fillText(name,25,135);onSave(c.toDataURL('image/png'));}}>Use signature</button></TabsContent>
 <TabsContent value="upload"><label className="field wide">PNG, JPG or WebP · up to 10.5 MB<input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{if(f.size>10*1024*1024)throw new Error('Choose a signature image below 10.5 MB.');const loaded=await loadFile(f);if(!loaded.image)throw new Error('Choose a PNG, JPG or WebP image.');onSave(loaded.image);}catch(e){toast.error(e instanceof Error?e.message:'Could not open this image.');}}}/></label></TabsContent>
 </Tabs>;
}
function ResultPreview({output}:{output:Output}){
 const [file,setFile]=useState<Loaded>(),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true;loadFile(new File([output.blob],output.name)).then(f=>alive&&setFile(f)).catch(()=>alive&&setMessage('This result cannot be previewed. Protected PDFs require a password in your PDF reader.'));return()=>{alive=false;};},[output]);
 return <div className="result-preview">{file?Array.from({length:file.pages},(_,i)=><div key={i}><p className="muted">Page {i+1}</p><Thumb file={file} index={i} large/></div>):<p role="status">{message||'Opening the exported file…'}</p>}</div>;
}
function App() {
    const { setOpenMobile } = useSidebar();
    const workspace=useWorkspace();const {files,setFiles,pages,setPages,marks,setMarks}=workspace;
    const [clearOpen,setClearOpen]=useState(false),[zoom,setZoom]=useState(1),[preview,setPreview]=useState(false),[savedDraft,setSavedDraft]=useState<DocumentState>(),[batchMode,setBatchMode]=useState(false),[pageSelection,setPageSelection]=useState<string[]>([]);
    const cancel=useRef<AbortController|undefined>(undefined),lastTool=useRef('organize'),toolOptions=useRef<Record<string,Options>>({});
    const batchTools=['compress','rotate','clean','jpg','png','encrypt','repair','grayscale'];
    const [view, setView] = useState('home'), [group, setGroup] = useState('All tools'), [search, setSearch] = useState(''), [dark, setDark] = useState(false), [options, setOptions] = useState<Options>(defaults), [busy, setBusy] = useState(false), [loading, setLoading] = useState(false), [progress, setProgress] = useState(0), [dragging, setDragging] = useState(false), [error, setError] = useState(''), [output, setOutput] = useState<Output>(), [shelfFiles, setShelfFiles] = useState<ShelfFile[]>([]), [activePage, setActivePage] = useState(''), [mode, setMode] = useState<'move' | 'text' | 'highlight' | 'redact'>('move'), [selected, setSelected] = useState(''), [signature, setSignature] = useState(false), [about, setAbout] = useState(false), [formFields, setFormFields] = useState<Awaited<ReturnType<typeof fields>>>([]);
    useEffect(()=>{currentFiles.current=files;},[files]);
    useEffect(()=>{draft('get').then(setSavedDraft).catch(()=>{});},[]);
    useEffect(()=>{if(!files.length&&!options.text)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[files,options.text]);
    const additive=isMulti(view)||batchMode;
    const compatible=!files.length||files.every(f=>accepted(view).split(',').some(ext=>f.name.toLowerCase().endsWith(ext)));
    const ready=compatible&&(!files.some(f=>f.pages===0)||['decrypt','hash','zip','docx','sheet','ebook','create','markdown'].includes(view));
    const tracking = useActivityTracking(view);
    const [analyticsAccess, setAnalyticsAccess] = useState(false);
    useEffect(() => { let alive = true; fetch('/api/analytics/access', { cache: 'no-store' }).then(r => { if (alive)
        setAnalyticsAccess(r.status === 204); }).catch(() => { }); return () => { alive = false; }; }, []);
    const input = useRef<HTMLInputElement>(null), imageInput = useRef<HTMLInputElement>(null), searchInput = useRef<HTMLInputElement>(null), queue = useRef(false), board = useRef<HTMLDivElement>(null), dragDepth = useRef(0), savedUrl = useRef<string | undefined>(undefined), currentFiles = useRef<Loaded[]>([]), gesture = useRef<{
        x: number;
        y: number;
        original: Mark;
        resize: boolean;
    } | undefined>(undefined);
    const tool = tools.find(t => t.id === view);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const opt = (key: keyof Options, value: string) => setOptions(o => ({ ...o, [key]: value }));
    function navigate(id:string){
      if(busy||loading)return;
      if(marks.some(m=>m.kind==='redact')&&!['home','redact','shelf'].includes(id)){setError('Export your redacted PDF and choose Continue editing before switching tools, or remove the redaction regions.');return;}
      if(typeof speechSynthesis!=='undefined')speechSynthesis.cancel();
      toolOptions.current[view]=options;setOptions(toolOptions.current[id]??{...defaults,quality:['jpg','png'].includes(id)?'2':id==='compress'?'compact':'balanced'});
      setView(id);setOpenMobile(false);setError('');setOutput(undefined);setSelected('');setBatchMode(false);
      if(id!=='home'&&id!=='shelf')lastTool.current=id;
      setPageSelection([]);setMode('move');window.history.replaceState(null,'',id==='home'?'/':`/#${id}`);
    }
    async function saveCurrentDraft(){try{await draft('save',{files,pages,marks});setSavedDraft({files,pages,marks});toast.success('Draft saved on this device. Save again after further edits.');}catch{toast.error('Could not save the draft. Download your file instead.');}}
    async function restoreDraft(){if(!savedDraft)return;setLoading(true);try{const restored:Loaded[]=[];for(const f of savedDraft.files){if(f.image||!f.pages)restored.push(f);else restored.push({...await loadFile(new File([f.bytes.slice().buffer as ArrayBuffer],f.name)),id:f.id});}workspace.replace({...savedDraft,files:restored});currentFiles.current=restored;setView('organize');setActivePage(savedDraft.pages[0]?.id??'');toast.success('Saved draft restored');}catch{setError('Could not restore this draft. Your saved copy has been kept.');}finally{setLoading(false);}}
    async function continueOutput(){if(!output)return;setLoading(true);try{const f=await loadFile(new File([output.blob],output.name));validatePages(f.pages);workspace.replace({files:[f],pages:Array.from({length:f.pages},(_,index)=>({id:crypto.randomUUID(),fileId:f.id,index,rotation:0})),marks:[]});currentFiles.current=[f];setView('organize');setOutput(undefined);setBatchMode(false);setOptions({...defaults});toast.success('Result opened in your workspace. Undo restores the previous document.');}catch(e){setError(e instanceof Error?e.message:'Could not reopen this output.');}finally{setLoading(false);}}
    useEffect(()=>{if(view==='form'&&files.length===1){let active=true;fields(files[0].bytes).then(ff=>{if(active){setFormFields(ff);setOptions(o=>({...o,fields:Object.fromEntries(ff.filter(f=>f.kind!=='unsupported').map(f=>[f.name,f.value]))}));}}).catch(()=>setFormFields([]));return()=>{active=false;};}if(view==='metadata'&&files[0]?.doc)setOptions(o=>({...o,title:files[0].doc!.getTitle()??'',author:files[0].doc!.getAuthor()??'',subject:files[0].doc!.getSubject()??''}));},[view,files]);
    useEffect(() => { const id = location.hash.slice(1); if (tools.some(t => t.id === id))
        navigate(id); shelf('list').then(setShelfFiles).catch(() => { }); try{setDark(localStorage.getItem('openpdf-theme') === 'dark');}catch{} const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setView('home');
        requestAnimationFrame(()=>searchInput.current?.focus());
    } if (e.key === 'Escape') {
        setSelected('');
        setMode('move');
    } }; window.addEventListener('keydown', key); return () => { window.removeEventListener('keydown', key); cancel.current?.abort();if (typeof speechSynthesis !== 'undefined')
        speechSynthesis.cancel(); if (savedUrl.current)
        URL.revokeObjectURL(savedUrl.current); }; }, []);
    useEffect(() => { setOutput(undefined); }, [files, pages, marks, options, view]);
    useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try{localStorage.setItem('openpdf-theme', dark ? 'dark' : 'light');}catch{} }, [dark]);
    useEffect(() => { const ctx = (document as Document & {
        modelContext?: {
            registerTool: (t: unknown, o: unknown) => Promise<void>;
        };
    }).modelContext; if (!ctx)
        return; const life = new AbortController(); Promise.resolve(ctx.registerTool({ name: 'open_pdf_tool', description: 'Open a named PDF tool. Preserves the current document when changing tools. Does not upload or process files.', inputSchema: { type: 'object', properties: { toolId: { type: 'string', enum: tools.map(t => t.id) } }, required: ['toolId'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async (input: {
            toolId: string;
        }) => { if (!tools.some(t => t.id === input.toolId))
            throw new Error('Unknown tool'); if (queue.current || busy || loading)
            throw new Error('The workspace is busy'); navigate(input.toolId); return { opened: input.toolId }; } }, { signal: life.signal })).catch(() => { }); return () => life.abort(); }, [busy, loading]);
    async function ingest(list: File[], target = view) { if (queue.current || busy)
        return; queue.current = true; setLoading(true); setError(''); setOutput(undefined); try {
        if (target === 'home') {
            target = list.every(f=>/\.(png|jpe?g|webp)$/i.test(f.name))?'images':list.length>1?'merge':'organize';
            navigate(target);
        }
        validateSelection(list,accepted(target),isMulti(target)||batchMode,(isMulti(target)||batchMode)?currentFiles.current.reduce((n,f)=>n+f.size,0):0);
        const incoming: Loaded[] = [];
        for (const f of list) {
            if (['decrypt', 'hash', 'zip'].includes(target)) {
                incoming.push({ id: crypto.randomUUID(), name: f.name, bytes: new Uint8Array(await f.arrayBuffer()), size: f.size, pages: 0 });
            }
            else
                incoming.push(await loadFile(f));
        }
        const adding=(isMulti(target)||batchMode)&&currentFiles.current.every(f=>accepted(target).split(',').some(ext=>f.name.toLowerCase().endsWith(ext)));
        const next = adding ? [...currentFiles.current, ...incoming] : incoming;
        if(batchMode&&next.length>20)throw new Error('Batch processing supports up to 20 files.');
        if (target === 'compare' && next.length > 2)
            throw new Error('Choose two PDFs to compare.');
        validatePages(next.reduce((n,f)=>n+f.pages,0));
        currentFiles.current = next;

        const extra = incoming.flatMap(f => Array.from({ length: f.pages }, (_, i) => ({ id: crypto.randomUUID(), fileId: f.id, index: i, rotation: 0 })));
        workspace.replace({files:next,pages:adding?[...pages,...extra]:extra,marks:adding?marks:[]});
        if (extra.length)
            setActivePage(extra[0].id);

        if (['create', 'markdown'].includes(target))
            opt('text', new TextDecoder().decode(incoming[0].bytes));
        if (target === 'metadata' && incoming[0].doc)
            setOptions(o => ({ ...o, title: incoming[0].doc!.getTitle() ?? '', author: incoming[0].doc!.getAuthor() ?? '', subject: incoming[0].doc!.getSubject() ?? '' }));
        if (target === 'form') {
            const ff = await fields(incoming[0].bytes);
            setFormFields(ff);
            setOptions(o => ({ ...o, fields: Object.fromEntries(ff.filter(f => f.kind !== 'unsupported').map(f => [f.name, f.value])) }));
        }
    }
    catch (e) {
        setError('Your existing workspace is retained. '+(e instanceof Error ? e.message : 'The file could not be opened. It may be damaged or encrypted.'));
    }
    finally {
        queue.current = false;
        setLoading(false);
    } }
    async function run(){
      if(busy||loading||!ready)return;const controller=new AbortController();cancel.current=controller;
      trackActivity('process_start',view);setBusy(true);setProgress(0);setError('');setOutput(undefined);
      try{let r:Output;
        if(batchMode&&files.length>1){const {default:JSZip}=await import('jszip');const z=new JSZip(),failures:string[]=[];let success=0;
          for(let i=0;i<files.length;i++){controller.signal.throwIfAborted();try{const file=files[i],items=pages.filter(p=>p.fileId===file.id);const one=await processPDF(view,[file],items,marks.filter(m=>items.some(p=>p.id===m.pageId)),options,n=>setProgress(Math.round((i+n/100)/files.length*100)),controller.signal);z.file(`${i+1}-${one.name}`,await one.blob.arrayBuffer());success++;}catch(e){controller.signal.throwIfAborted();failures.push(`${files[i].name}: ${e instanceof Error?e.message:'Processing failed'}`);}}
          if(!success)throw new Error('No files could be processed. Your source files are retained.');
          if(failures.length)z.file('failures.txt',failures.join('\n'));
          r={blob:await z.generateAsync({type:'blob'}),name:`pdf-studio-${view}-batch.zip`,report:`${success} of ${files.length} files completed.${failures.length?'\n'+failures.join('\n'):''}`};
        }else r=await processPDF(view,files,pages,marks,options,setProgress,controller.signal);
        controller.signal.throwIfAborted();
        if(view==='audio'){if(typeof speechSynthesis==='undefined')throw new Error('Read aloud is not available in this browser.');speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(r.report??''));}
        setOutput(r);setProgress(100);toast.success('Your file is ready');trackActivity('process_success',view);
      }catch(e){if(controller.signal.aborted){toast('Processing stopped. Your original document is retained.');}else{trackActivity('process_error',view);setError(e instanceof Error?e.message:'The operation could not be completed. Your document is retained.');}}
      finally{cancel.current=undefined;setBusy(false);}
    }
    function download(blob: Blob, name: string) { trackActivity('download', tool?.id ?? null); if (savedUrl.current)
        URL.revokeObjectURL(savedUrl.current); const url = URL.createObjectURL(blob); savedUrl.current = url; const a = document.createElement('a'); a.href = url; a.download = name; a.click(); }
    async function save(blob: Blob, name: string) { try {
        await shelf('save', { id: crypto.randomUUID(), name, blob, date: Date.now() });
        setShelfFiles(await shelf('list'));
        toast.success('Saved to My files on this device');
    }
    catch {
        toast.error('Could not save. Browser storage may be full or unavailable. Download your file instead.');
    } }
    useEffect(()=>{const keys=(e:KeyboardEvent)=>{const target=e.target as HTMLElement;if(target.closest('input,textarea,[contenteditable=true]')||busy||loading)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?workspace.redo():workspace.undo();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();workspace.redo();}};window.addEventListener('keydown',keys);return()=>window.removeEventListener('keydown',keys);},[workspace.undo,workspace.redo,busy,loading]);
    const current = pages.find(p => p.id === activePage) ?? pages[0];
    const currentFile = files.find(f => f.id === current?.fileId);
    const editor = ['edit', 'sign', 'redact'].includes(view)&&compatible;
    const geometry=currentFile?.doc&&current?pageGeometry(currentFile.doc.getPage(current.index),current.rotation):{width:595,height:842};
    const selectedMark = marks.find(m => m.id === selected);
    function addMark(kind: Mark['kind'], x = .2, y = .25, image?: string) { if (!current)
        return; const m: Mark = { id: crypto.randomUUID(), pageId: current.id, kind, x, y, w: kind === 'image' ? .3 : kind === 'text' ? .4 : .25, h: kind === 'image' ? .12 : kind === 'text' ? .09 : .045, text: 'Your text', url:kind==='link'?'https://example.com':undefined, image, color: kind === 'highlight' ? '#f4c653' : '#1a293b', fontSize: 16 }; if(image){const raw=atob(image.split(',')[1].slice(0,44)),a=Uint8Array.from(raw,c=>c.charCodeAt(0));if(a.length>=24){const d=new DataView(a.buffer),iw=d.getUint32(16),ih=d.getUint32(20);if(iw&&ih)m.h=Math.min(1-m.y,m.w*geometry.width/geometry.height*ih/iw);}}setMarks(ms => [...ms, m]); setSelected(m.id); setMode('move'); }
    function reorder(e: DragEndEvent) { if (e.over && e.active.id !== e.over.id)
        setPages(p => arrayMove(p, p.findIndex(i => i.id === e.active.id), p.findIndex(i => i.id === e.over!.id))); }
    const filtered = tools.filter(t => (group === 'All tools' || t.group === group) && `${t.name} ${t.description} ${searchAliases[t.id]??''}`.toLowerCase().includes(search.trim().toLowerCase()));
    return <>
    <Sidebar className="app-sidebar"><SidebarHeader><button className="brand" onClick={() => navigate('home')}><img className="studio-logo" src="/brand/pdf-studio-mark.png" alt="" width="44" height="44"/><span>PDF <span className="brand-light">Studio</span><small>FREE & OPEN SOURCE</small></span></button></SidebarHeader><SidebarContent><div className="nav-section"><span className="nav-label">WORKSPACE</span>{[['home', 'All tools', Grid2X2], ['shelf', 'My files', FolderOpen]].map(([id, name, Icon]) => { const I = Icon as typeof FileText; return <button key={id as string} className={`nav-item ${view === id ? 'active' : ''}`} onClick={() => navigate(id as string)}><I size={18}/>{name as string}{id === 'shelf' && shelfFiles.length > 0 && <small>{shelfFiles.length}</small>}</button>; })}</div>{['Pages', 'Edit & sign', 'Convert', 'Privacy'].map(g => <div className="nav-section" key={g}><span className="nav-label">{g}</span>{tools.filter(t => t.group === g&&['merge','organize','split','compress','edit','sign','redact','form','images','jpg','word','ocr','encrypt','decrypt','clean'].includes(t.id)).map(t => { const I = icons[t.icon]; return <button className={`nav-item ${view === t.id ? 'active' : ''}`} key={t.id} onClick={() => navigate(t.id)} disabled={busy || loading}><I size={17}/>{t.name}</button>; })}</div>)}</SidebarContent><SidebarFooter>{analyticsAccess && <a className="nav-item" href="/analytics" onClick={e=>{if(files.length){e.preventDefault();window.open('/analytics','_blank','noopener,noreferrer');}}}><Hash size={17}/>Analytics</a>}<div className="sidebar-note"><ShieldCheck size={18}/><span>Your files stay yours.<small>Processed on this device.</small></span></div><button className="nav-item" onClick={() => setAbout(true)}><GitBranch size={17}/>Open source · MIT</button></SidebarFooter></Sidebar>
    <a className="skip-link" href="#studio-content">Skip to workspace</a><main className="main"><header className="topbar"><div className="row"><SidebarTrigger className="mobile-menu"/><button className="mobile-brand" onClick={()=>navigate("home")} aria-label="PDF Studio home"><img src="/brand/pdf-studio-mark.png" alt="" width="28" height="28"/><span>PDF Studio</span></button><span className="breadcrumb">Workspace <span>/</span> <b>{view === 'home' ? 'All tools' : view === 'shelf' ? 'My files' : tool?.name}</b></span></div><div className="row"><span className="local-badge"><ShieldCheck size={15}/>On-device processing</span><button className="icon-button" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button><button className="source-top" onClick={() => setAbout(true)}><ShieldCheck size={17}/>Privacy</button></div></header>
    <div id="studio-content" tabIndex={-1} className="content" aria-busy={busy || loading} onDragEnter={e => { if (!busy&&!loading&&e.dataTransfer.types.includes('Files')) {
        e.preventDefault();
        dragDepth.current++;
        setDragging(true);
    } }} onDragOver={e => { if (e.dataTransfer.types.includes('Files')){e.preventDefault();e.dataTransfer.dropEffect=busy||loading?'none':'copy';} }} onDragLeave={e => { e.preventDefault(); dragDepth.current=Math.max(0,dragDepth.current-1); if (dragDepth.current <= 0)
        setDragging(false); }} onDrop={e => { e.preventDefault(); dragDepth.current = 0; setDragging(false); if (!busy&&!loading&&e.dataTransfer.files.length)
        ingest(Array.from(e.dataTransfer.files)); }}>
    <input ref={input} type="file" hidden multiple={additive || view === 'home'} accept={view === 'home' ? '.pdf,.png,.jpg,.jpeg,.webp' : accepted(view)} onChange={e => { if (e.target.files)
        ingest(Array.from(e.target.files)); e.target.value = ''; }}/>
    <input ref={imageInput} type="file" hidden accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) {
        try {
            const loaded = await loadFile(f);
            if (loaded.image)
                addMark('image', .25, .25, loaded.image);
        }
        catch {
            toast.error('Use a PNG, JPG or WebP image.');
        }
    } e.target.value = ''; }}/>
    {dragging && <div className="drag-overlay"><Upload size={44}/><h2>Drop your files here</h2><p>They stay on this device.</p></div>}
        {busy&&<div className="progress-wrap" role="status" aria-live="polite"><div className="row"><Loader2 className="spin" size={18}/><b>{progress?`Processing · ${progress}%`:'Preparing your document…'}</b><button className="secondary" onClick={()=>{cancel.current?.abort();toast('Stopping at the next safe processing step…');}}>Stop processing</button></div><Progress value={progress||undefined}/><p className="muted">Your originals are retained. Some library operations finish before stopping.</p></div>}
    {loading&&<p className="status" role="status"><Loader2 className="spin" size={18}/>Opening files on your device…</p>}
    {savedDraft&&<div className="draft-banner"><Save size={18}/><span>A saved draft is available on this device.</span><button className="secondary" disabled={busy||loading} onClick={restoreDraft}>Restore draft</button><button className="secondary" onClick={async()=>{try{await draft('delete');setSavedDraft(undefined);toast('Saved draft deleted');}catch{toast.error('Could not delete the draft.');}}}>Delete saved draft</button></div>}
    {files.length>0&&<section className="workspace-rail" aria-label="Shared document workspace"><div><span className="eyebrow">CURRENT DOCUMENT</span><b>{files.length===1?files[0].name:`${files.length} source files`}</b><p>{pages.length} pages · {(files.reduce((n,f)=>n+f.size,0)/1000/1000).toFixed(2)} MB · kept while switching tools</p></div><div className="row"><button className="icon-button" disabled={busy||loading||!workspace.canUndo} aria-label="Undo document change" onClick={workspace.undo}><Undo2 size={18}/></button><button className="icon-button" disabled={busy||loading||!workspace.canRedo} aria-label="Redo document change" onClick={workspace.redo}><Redo2 size={18}/></button><button className="secondary" disabled={busy||loading} onClick={saveCurrentDraft}><Save size={17}/>Save draft</button><button className="secondary" disabled={busy||loading} onClick={()=>navigate(view==='home'?lastTool.current:'home')}>{view==='home'?'Resume document':'Change tool'}</button></div></section>}
    <fieldset disabled={busy||loading} inert={busy||loading?true:undefined} className="studio-controls">
    {view === 'home' ? <>
        <div className="intro studio-intro"><span className="eyebrow">YOUR DOCUMENTS. YOUR STUDIO.</span><h1>A little less paperwork.<br/><span>A lot more possibility.</span></h1><p>Merge, edit, sign and make it yours. Your next PDF task starts here.</p></div>
        <div className="home-workspace"><button className="dropzone home-drop" onClick={() => input.current?.click()} disabled={loading}><span className="upload-symbol"><Upload size={27}/></span><div><h2>{loading ? 'Opening your files…' : 'Drop a PDF or images here'}</h2><p>or <span>choose files</span> to start organizing</p><small>PDF, PNG, JPG, WebP · 157.3 MB total · up to 400 pages</small></div><span className="drop-plus"><Plus size={22}/></span></button><div className="shelf-shortcut"><HardDrive size={22}/><h3>Pick up where you left off.</h3><p>Keep finished work on your device, ready for next time.</p><button onClick={() => navigate('shelf')}>Open My files <FolderOpen size={16}/></button></div></div>
        <div className="essentials-label"><h2>Start with the essentials</h2><span>One workspace. Keep creating.</span></div><div className="quick-tasks" aria-label="Common PDF tasks">{['organize','merge','split','edit','sign','compress','images','word','ocr'].map(id=>{const t=tools.find(t=>t.id===id)!,I=icons[t.icon];return <button className={`task-${t.group.replaceAll(" ","-").replaceAll("&","and").toLowerCase()}`} key={id} onClick={()=>navigate(id)}><I size={22}/><span>{t.name}</span></button>;})}</div><div className="catalogue-top"><div><h2>Your PDF toolbox <span>{tools.length}</span></h2><p className="muted">Search by task or file type. Keep your document as you go.</p></div><label className="search"><Search size={18}/><input ref={searchInput} placeholder="Find a tool…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search tools"/><kbd>Ctrl / ⌘ K</kbd></label></div>
        <div className="filters" role="group" aria-label="Filter tools">{groups.filter(g => g !== 'My files').map(g => <button key={g} aria-pressed={group===g} className={group === g ? 'selected' : ''} onClick={() => setGroup(g)}>{g}</button>)}</div>
        <div className="tool-grid">{filtered.map((t, i) => { const I = icons[t.icon]; return <button className={`tool-card color-${['Pages', 'Edit & sign', 'Convert', 'Privacy'].indexOf(t.group)}`} key={t.id} onClick={() => navigate(t.id)}><span className="tool-icon"><I size={23}/></span><h3>{t.name}</h3><p>{t.description}</p><span className="tool-category">{t.group}<b>FREE</b></span>{t.note&&<span className="card-caveat">{t.note}</span>}</button>; })}</div>{!filtered.length && <p className="empty">No tools match “{search}”. Try another search.</p>}
        </> : view === 'shelf' ? <><div className="tool-heading"><span className="eyebrow">YOUR DEVICE. YOUR DOCUMENTS.</span><h1>My files</h1><p>A private shelf for files you choose to save. Browser data clearing removes these copies.</p></div>{shelfFiles.length ? <div className="saved-list">{shelfFiles.map(f => <div key={f.id}><FileText size={24}/><div><b>{f.name}</b><p>{(f.blob.size / 1000).toFixed(0)} KB · {new Date(f.date).toLocaleDateString()}</p></div><button className="secondary" onClick={() => download(f.blob, f.name)}><Download size={16}/>Download</button>{f.name.endsWith('.pdf') && <button className="secondary" onClick={() => { navigate('organize'); ingest([new File([f.blob], f.name)], 'organize'); }}>Open</button>}<button className="icon-button" aria-label={`Remove ${f.name} from shelf`} onClick={async () => { try {
            await shelf('delete', f.id);
            setShelfFiles(await shelf('list'));
            toast('Removed from this device’s shelf');
        }
        catch {
            toast.error('Could not remove this file.');
        } }}><Trash2 size={18}/></button></div>)}</div> : <div className="empty-shelf"><FolderOpen size={45}/><h2>Room for your finished work.</h2><p>Process a document, then choose “Save to My files”.<br />Nothing is saved here automatically.</p><button className="primary" onClick={() => navigate('home')}>Browse tools</button></div>}</> : <>
        <div className="tool-heading"><button className="back-link" onClick={() => navigate('home')}><ChevronLeft size={16}/>All tools</button><span className="eyebrow">{tool?.group}</span><h1>{tool?.name}</h1><p>{tool?.description}</p></div>
        {!ready&&compatible&&files.length>0&&<div className="tool-note">This file has no loaded pages. Use Remove password for a protected PDF, then Continue editing.</div>}
        {tool?.note && <div className="tool-note"><FileText size={17}/><span>{tool.note}</span></div>}
            {batchTools.includes(view)&&<label className="batch-choice"><input className="studio-option-checkbox" type="checkbox" checked={batchMode} onChange={e=>setBatchMode(e.target.checked)} aria-label="Process each file separately"/><span>Batch processing <b>{batchMode ? "On" : "Off"}</b> · each file separately into a ZIP · up to 20 files</span></label>}
        {(!compatible)&&<div className="tool-note" role="status">Your current document is kept. This tool needs {accepted(view)} files; choose a file to replace the workspace.</div>}
        {((!files.length||!compatible) && !['create', 'markdown'].includes(view)) ? <button className="dropzone tool-drop" disabled={loading} onClick={() => input.current?.click()}><span className="upload-symbol"><Upload size={32}/></span><h2>{loading ? 'Opening your file…' : `Drop ${view === 'images' ? 'your images' : view === 'docx' ? 'a Word document' : view === 'sheet' ? 'a spreadsheet' : view === 'ebook' ? 'an EPUB' : 'your PDF' + (isMulti(view) ? 's' : '')} here`}</h2><p>or choose files from your device</p><span className="primary">Choose files</span><small>{accepted(view).replaceAll('.', '').toUpperCase()} · 157.3 MB total · 400 pages · No file upload</small></button> : <>
            {files.length > 0 && <div className="workspace-summary"><span><FileText size={18}/><b>{files.length} {files.length === 1 ? 'file' : 'files'}</b><span>·</span>{pages.length > 0 && `${pages.length} pages · `}{(files.reduce((s, f) => s + f.size, 0) / 1000 / 1000).toFixed(2)} MB</span><div className="row"><button className="secondary" disabled={busy || loading} onClick={() => input.current?.click()}><Plus size={16}/>{additive?'Add files':'Replace file'}</button><button className="icon-button" aria-label="Clear workspace" disabled={busy} onClick={()=>setClearOpen(true)}><X size={19}/></button></div></div>}
            {loading && <p className="status"><Loader2 className="spin" size={18}/>Reading your files…</p>}
                {editor && current && currentFile ? <div className="editor-layout"><div className="editor-main"><div className="editor-toolbar"><button className={mode === 'move' ? 'selected' : ''} onClick={() => setMode('move')}><MousePointer2 size={17}/>Move</button>{view !== 'redact' && <><button className={mode === 'text' ? 'selected' : ''} onClick={() => setMode('text')}><Type size={17}/>Text</button><button className={mode === 'highlight' ? 'selected' : ''} onClick={() => setMode('highlight')}><Highlighter size={17}/>Highlight</button><button onClick={() => setSignature(true)}><PenLine size={17}/>Signature</button><button onClick={() => imageInput.current?.click()}><ImageIcon size={17}/>Image</button><button onClick={()=>addMark('rectangle')}><Square size={17}/>Box</button><button onClick={()=>addMark('ellipse')}><Circle size={17}/>Circle</button><button onClick={()=>addMark('link')}><Link2 size={17}/>Link</button></>}{view === 'redact' && <button className={mode === 'redact' ? 'selected' : ''} onClick={() => setMode('redact')}><Square size={17}/>Redact region</button>}<button onClick={workspace.undo} disabled={!workspace.canUndo} aria-label="Undo document change"><Undo2 size={17}/></button><button onClick={workspace.redo} disabled={!workspace.canRedo} aria-label="Redo document change"><Redo2 size={17}/></button><button onClick={()=>setZoom(z=>Math.max(.5,z-.25))} aria-label="Zoom out"><ZoomOut size={17}/></button><button onClick={()=>setZoom(1)}>{Math.round(zoom*100)}%</button><button onClick={()=>setZoom(z=>Math.min(2,z+.25))} aria-label="Zoom in"><ZoomIn size={17}/></button></div><p className="editor-hint">{mode === 'move' ? 'Select an element to move it with arrow keys or the position fields. Drag to move; use the corner to resize.' : `Click or tap the page to add ${mode === 'text' ? 'text' : mode === 'highlight' ? 'a highlight' : 'a redaction region'}.`}</p><div className="board-scroll"><div className="page-board" style={{width:`${zoom*100}%`,maxWidth:"none"}} ref={board} onPointerDown={e => { if (e.target === e.currentTarget || e.target instanceof HTMLImageElement) {
                    if (mode !== 'move') {
                        const r = e.currentTarget.getBoundingClientRect();
                        addMark(mode, Math.min(.65, (e.clientX - r.left) / r.width), Math.min(.85, (e.clientY - r.top) / r.height));
                    }
                    else
                        setSelected('');
                } }} onPointerMove={e => { const g = gesture.current; if (!g || !board.current)
                    return; const r = board.current.getBoundingClientRect(), dx = (e.clientX - g.x) / r.width, dy = (e.clientY - g.y) / r.height; setMarks(ms => ms.map(m => m.id === g.original.id ? g.resize ? { ...m, w: Math.max(.03, Math.min(1 - m.x, g.original.w + dx)), h: Math.max(.02, Math.min(1 - m.y, g.original.h + dy)) } : { ...m, x: Math.max(0, Math.min(1 - m.w, g.original.x + dx)), y: Math.max(0, Math.min(1 - m.h, g.original.y + dy)) } : m)); }} onPointerUp={() => gesture.current = undefined} onPointerCancel={() => gesture.current = undefined}>
                <Thumb file={currentFile} index={current.index} rotation={current.rotation} large/>{marks.filter(m => m.pageId === current.id).map(m => <div key={m.id} role="group" aria-roledescription="Movable element" tabIndex={0} aria-label={`${m.kind} element. Arrow keys move it. Shift and arrow keys resize it.`} onKeyDown={e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();setMarks(ms=>ms.filter(x=>x.id!==m.id));return;}const dir={ArrowLeft:[-.005,0],ArrowRight:[.005,0],ArrowUp:[0,-.005],ArrowDown:[0,.005]}[e.key];if(dir){e.preventDefault();setMarks(ms=>ms.map(x=>x.id===m.id?e.shiftKey?{...x,w:Math.max(.03,Math.min(1-x.x,x.w+dir[0])),h:Math.max(.02,Math.min(1-x.y,x.h+dir[1]))}:{...x,x:Math.max(0,Math.min(1-x.w,x.x+dir[0])),y:Math.max(0,Math.min(1-x.h,x.y+dir[1]))}:x));}if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(m.id);}}} onFocus={()=>setSelected(m.id)} className={`mark ${m.kind} ${selected === m.id ? 'active-mark' : ''}`} style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, width: `${m.w * 100}%`, height: `${m.h * 100}%`, color: m.color, background: m.kind === 'highlight' ? `${m.color}40` : m.kind === 'redact' ? '#000' : undefined, fontSize: `${m.fontSize / geometry.width * 100}cqw`,border:['rectangle','ellipse','link'].includes(m.kind)?`2px solid ${m.color}`:undefined,borderRadius:m.kind==='ellipse'?'50%':undefined }} onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); setSelected(m.id); gesture.current = { x: e.clientX, y: e.clientY, original: { ...m }, resize: false }; }}>{m.kind === 'text' ? m.text : m.kind === 'image' ? <img src={m.image} alt="Inserted image" draggable={false}/> : null}{selected === m.id && <button className="resize-handle" aria-label="Resize element" onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); gesture.current = { x: e.clientX, y: e.clientY, original: { ...m }, resize: true }; }}/>}</div>)}</div></div><div className="editor-pager"><button className="icon-button" aria-label="Previous page" disabled={pages.indexOf(current) === 0} onClick={() => setActivePage(pages[pages.indexOf(current) - 1].id)}><ChevronLeft size={19}/></button><span>Page {pages.indexOf(current) + 1} of {pages.length}</span><button className="icon-button" aria-label="Next page" disabled={pages.indexOf(current) === pages.length - 1} onClick={() => setActivePage(pages[pages.indexOf(current) + 1].id)}><ChevronRight size={19}/></button></div></div><aside className="properties"><h3>Element settings</h3>{selectedMark ? <>{selectedMark.kind === 'text' && <><label className="field">Text<textarea value={selectedMark.text} onChange={e => setMarks(ms => ms.map(m => m.id === selected ? { ...m, text: e.target.value } : m))}/></label><label className="field">Font size (pt)<input type="number" min="6" max="96" value={selectedMark.fontSize} onChange={e => setMarks(ms => ms.map(m => m.id === selected ? { ...m, fontSize: Math.min(96, Math.max(6, Number(e.target.value))) } : m))}/></label></>}{['text','highlight','rectangle','ellipse','link'].includes(selectedMark.kind) && <label className="field">Colour<input type="color" value={selectedMark.color} onChange={e => setMarks(ms => ms.map(m => m.id === selected ? { ...m, color: e.target.value } : m))}/></label>}{selectedMark.kind==='link'&&<label className="field">Link URL<input type="url" value={selectedMark.url??''} onChange={e=>setMarks(ms=>ms.map(m=>m.id===selected?{...m,url:e.target.value}:m))}/></label>}<div className="position-grid">{(['x','y','w','h'] as const).map(k=><label className="field" key={k}>{{x:'Left (%)',y:'Top (%)',w:'Width (%)',h:'Height (%)'}[k]}<input type="number" step="0.5" min={k==='w'||k==='h'?3:0} max="100" value={Math.round(selectedMark[k]*1000)/10} onChange={e=>{const v=Number(e.target.value)/100;setMarks(ms=>ms.map(m=>m.id===selected?{...m,[k]:k==='x'?Math.max(0,Math.min(1-m.w,v)):k==='y'?Math.max(0,Math.min(1-m.h,v)):k==='w'?Math.max(.03,Math.min(1-m.x,v)):Math.max(.02,Math.min(1-m.y,v))}:m));}}/></label>)}</div><button className="secondary danger" onClick={() => { setMarks(ms => ms.filter(m => m.id !== selected)); setSelected(''); }}><Trash2 size={16}/>Remove element</button></> : <p className="muted">Select an element to edit it.</p>}</aside></div> : view === 'compare' && files.length === 2 ? <div className="compare-grid">{files.map(f => <div className="compare-document" key={f.id}><h3>{f.name}</h3>{Array.from({ length: f.pages }, (_, i) => <Thumb key={i} file={f} index={i} large/>)}</div>)}</div> : pages.length > 0 && !['form', 'metadata', 'privacy', 'hash', 'audio', 'encrypt'].includes(view) ? <><div className="page-grid-heading"><b>Document pages</b><div className="row"><button className="secondary" disabled={pages.length>=400} onClick={()=>setPages(ps=>current?[...ps.slice(0,ps.indexOf(current)+1),{...current,id:crypto.randomUUID()},...ps.slice(ps.indexOf(current)+1)]:ps)}><Copy size={16}/>Duplicate selected page</button><label className="row"><Checkbox checked={pageSelection.length===pages.length&&pages.length>0} onCheckedChange={v=>setPageSelection(v?pages.map(p=>p.id):[])}/>Select all</label>{pageSelection.length>0&&<><button className="secondary" onClick={()=>{setPages(ps=>ps.map(p=>pageSelection.includes(p.id)?{...p,rotation:(p.rotation+90)%360}:p));}}><RotateCw size={16}/>Rotate selected</button><button className="secondary danger" onClick={()=>{setPages(ps=>ps.filter(p=>!pageSelection.includes(p.id)));setPageSelection([]);}}>Delete selected</button></>}</div><span>Drag the handle to reorder · rotate or remove a page</span></div><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorder}><SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}><div className="page-grid">{pages.map((p, i) => <div className="page-cell" key={p.id}><label className="page-select"><Checkbox checked={pageSelection.includes(p.id)} onCheckedChange={v=>setPageSelection(ids=>v?[...ids,p.id]:ids.filter(id=>id!==p.id))}/>Select page {i+1}</label><PageCard item={p} file={files.find(f => f.id === p.fileId)!} position={i} active={current?.id===p.id} select={() => setActivePage(p.id)} onRotate={() => setPages(ps => ps.map(x => x.id === p.id ? { ...x, rotation: (x.rotation + 90) % 360 } : x))} onRemove={() => setPages(ps => ps.filter(x => x.id !== p.id))} onMove={d => { if (i + d >= 0 && i + d < pages.length)
                    setPages(ps => arrayMove(ps, i, i + d)); }}/></div>)}</div></SortableContext></DndContext></> : files.length > 0 && <div className="file-line"><FileText size={22}/>{files[0].name}<ShieldCheck size={18}/></div>}
            <div className="settings-panel">{view==='native-text'&&<><label className="field">Find original text<input value={options.findText??''} onChange={e=>setOptions(o=>({...o,findText:e.target.value}))}/></label><label className="field">Replace with<input value={options.replaceText??''} onChange={e=>setOptions(o=>({...o,replaceText:e.target.value}))}/></label><p className="muted">Changes original text, not an overlay. Limited to standard PDF fonts and English text that fits the original width. All supported matches are replaced. Inspect the export; unsupported documents fail without modifying your original.</p></>}{view === 'split' && <label className="field">Pages to extract<input placeholder="e.g. 1, 3-5" value={options.range} onChange={e => opt('range', e.target.value)}/></label>}{view === 'rotate' && <Choice label="Rotation" value={options.angle} onChange={v => opt('angle', v)} items={['90', '180', '270'].map(v => [v, `${v}° clockwise`])}/>}{view === 'compress' && <Choice label="Compression" value={options.quality} onChange={v => opt('quality', v)} items={[['compact','Keep text & links · compact'],['small', 'Smallest · page images'], ['balanced', 'Balanced'], ['high', 'High quality']]}/>}{['jpg', 'png'].includes(view) && <Choice label="Resolution" value={options.quality} onChange={v => opt('quality', v)} items={[['1', '72 DPI · screen'], ['2', '144 DPI · standard'], ['4', '288 DPI · print']]}/>}{view === 'nup' && <Choice label="Pages per sheet" value={options.columns} onChange={v => opt('columns', v)} items={[['2', '2 pages'], ['4', '4 pages']]}/>}{view === 'crop' && <label className="field">Margin on each side (pt)<input type="number" min="0" value={options.margin} onChange={e => opt('margin', e.target.value)}/></label>}{['watermark', 'bates', 'headers'].includes(view) && <label className="field">{view === 'bates' ? 'Prefix' : view==='headers'?'Header text':'Text'}<input value={options.text} onChange={e => opt('text', e.target.value)} placeholder={view === 'watermark' ? 'DRAFT' : view === 'bates' ? 'DOC-' : 'Your label'}/></label>}{view==='headers'&&<label className="field">Footer text<input value={options.footer??''} onChange={e=>setOptions(o=>({...o,footer:e.target.value}))} placeholder="Optional footer"/></label>}{['numbers', 'bates'].includes(view) && <label className="field">Starting number<input type="number" min="1" value={options.start} onChange={e => opt('start', e.target.value)}/></label>}{['create', 'markdown'].includes(view) && <label className="field wide">{view === 'markdown' ? 'Markdown' : 'Your document'}<textarea rows={12} value={options.text} onChange={e => opt('text', e.target.value)} placeholder={view === 'markdown' ? '# A new beginning\n\nStart writing here…' : 'Start writing here…'}/></label>}{view === 'metadata' && (['title', 'author', 'subject'] as const).map(k => <label className="field" key={k}>{k[0].toUpperCase() + k.slice(1)}<input value={options[k]} onChange={e => opt(k, e.target.value)}/></label>)}{['encrypt', 'decrypt'].includes(view) && <label className="field">{view === 'encrypt' ? 'New opening password (8+ characters)' : 'Current password'}<input type="password" autoComplete="off" value={options.password} onChange={e => opt('password', e.target.value)}/></label>}{view==='form'&&<label className="row"><Checkbox checked={options.flattenForm??false} onCheckedChange={v=>setOptions(o=>({...o,flattenForm:v===true}))}/>Flatten filled fields (make them read only)</label>}{view === 'form' && (formFields.length ? formFields.map(f => f.kind === 'unsupported' ? <p key={f.name}>Unsupported field: {f.name}</p> : f.kind === 'checkbox' ? <label className="field row" key={f.name}><Checkbox checked={Boolean(options.fields[f.name])} onCheckedChange={v => setOptions(o => ({ ...o, fields: { ...o.fields, [f.name]: v === true } }))}/>{f.name}</label> : f.kind === 'select' ? <Choice key={f.name} label={f.name} value={String(options.fields[f.name])} items={f.choices.map(v => [v, v])} onChange={v => setOptions(o => ({ ...o, fields: { ...o.fields, [f.name]: v } }))}/> : <label className="field" key={f.name}>{f.name}<input value={String(options.fields[f.name] ?? '')} onChange={e => setOptions(o => ({ ...o, fields: { ...o.fields, [f.name]: e.target.value } }))}/></label>) : <p className="muted">This PDF has no fillable fields. Use Edit PDF to add text instead.</p>)}</div>
            {view !== 'compare' && <div className="action-bar"><div><ShieldCheck size={18}/><span>Processed here. No watermark added.</span></div>{view === 'audio' && <button className="secondary" onClick={() => speechSynthesis.cancel()}><StopCircle size={17}/>Stop reading</button>}<button className="primary" disabled={busy || loading || !ready || (!files.length && !['create', 'markdown'].includes(view)) || (view === 'form' && !formFields.length) || (view === 'redact' && !marks.some(m => m.kind === 'redact'))} onClick={run}>{busy ? <Loader2 size={18} className="spin"/> : view === 'audio' ? <Volume2 size={18}/> : <Download size={18}/>} {busy ? 'Processing…' : view === 'privacy' ? 'Scan document' : view === 'audio' ? 'Read aloud' : view === 'hash' ? 'Calculate fingerprint' : `Export ${batchMode?'batch ZIP':['jpg', 'png', 'split-all', 'zip'].includes(view) ? 'ZIP' : view === 'word' ? 'Word file' : view === 'text' ? 'text file' : view === 'pptx' ? 'PowerPoint' : view === 'xlsx' ? 'spreadsheet' : 'output'}`}</button></div>}
            </>}
        
        {output && <div className="output-panel"><span className="success-icon"><Check size={22}/></span><div><h3 role="status">Your file is ready.</h3><p>{output.name} · {(output.blob.size / 1000).toFixed(0)} KB{view === 'compress' && !batchMode && files[0] ? ` · ${output.blob.size < files.reduce((n,f)=>n+f.size,0) ? Math.round((1 - output.blob.size / files.reduce((n,f)=>n+f.size,0)) * 100) + '% smaller' : 'no size reduction'}` : ''}</p></div>{view==='compress'&&files.length===1&&<button className="secondary" onClick={()=>download(new Blob([files[0].bytes.slice().buffer as ArrayBuffer],{type:'application/pdf'}),files[0].name)}>Download original</button>}<button className="primary" onClick={() => download(output.blob, output.name)}><Download size={17}/>Download</button>{output.blob.type==='application/pdf'&&<><button className="secondary" onClick={()=>setPreview(true)}><Eye size={17}/>Inspect result</button>{view!=='encrypt'&&<button className="secondary" onClick={continueOutput}><Layers size={17}/>Continue editing</button>}</>}<button className="secondary" onClick={() => save(output.blob, output.name)}><FolderOpen size={17}/>Save to My files</button>{output.report && view !== 'audio' && <pre>{output.report}</pre>}</div>}
        </>}
    {error && <div className="error-panel" role="alert"><b>That didn’t work.</b><span>{error}</span><button className="icon-button" aria-label="Dismiss error" onClick={() => setError('')}><X size={18}/></button></div>}
    </fieldset><nav className="seo-links" aria-label="PDF tool guides">{seoTools.map(t=><a key={t.slug} href={"/tools/"+t.slug}>{t.title}</a>)}</nav><footer><span><img src="/brand/pdf-studio-mark.png" alt="" width="22" height="22"/>PDF Studio · Built to be yours.</span><div><button onClick={() => setAbout(true)}>Privacy & about</button><span>No subscriptions. No file uploads.</span></div></footer>
    </div></main>
    <AlertDialog open={clearOpen} onOpenChange={setClearOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Clear the current workspace?</AlertDialogTitle><AlertDialogDescription>This removes the open files, edits and undo history. Separately saved drafts and My files remain on this device.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep working</AlertDialogCancel><AlertDialogAction onClick={()=>{workspace.clear();currentFiles.current=[];setOutput(undefined);setPageSelection([]);setSelected('');}}>Clear workspace</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="preview-dialog"><DialogTitle>Inspect exported result</DialogTitle><DialogDescription>This preview is rendered from the actual exported PDF.</DialogDescription>{output&&<ResultPreview output={output}/>}</DialogContent></Dialog>
    <Dialog open={signature} onOpenChange={setSignature}><DialogContent><DialogTitle>Your signature</DialogTitle><DialogDescription>Draw, type or upload a visual signature. This is not cryptographic digital signing.</DialogDescription><Signature onSave={img => { addMark('image', .2, .4, img); setSignature(false); }}/></DialogContent></Dialog>
    <Dialog open={about} onOpenChange={setAbout}><DialogContent><DialogTitle>Your files stay yours.</DialogTitle><DialogDescription>PDF Studio is a free PDF workspace with on-device document processing.</DialogDescription><p>Document bytes are processed in your browser. My files and Save draft store only the copies you explicitly save in this browser’s IndexedDB. Clearing browser data removes them.</p><p>Anonymous usage events count visitors and tool activity. No document content, filenames or passwords are sent. Analytics records expire after 48 hours.</p><label className="tracking-choice"><span>{tracking.privacyBlocked ? "Your browser’s privacy signal disables tracking." : "Share anonymous usage activity"}</span><input className="studio-option-checkbox" type="checkbox" aria-label="Share anonymous usage activity" checked={tracking.enabled} disabled={tracking.privacyBlocked} onChange={e=>tracking.setEnabled(e.target.checked)}/></label><p>The OCR tool downloads a recognition model. Read aloud uses voices provided by your browser. Standard tools require no paid APIs.</p></DialogContent></Dialog>
    <Toaster position="bottom-right" richColors/>
    </>;
}
export default function Home() { return <SidebarProvider><App /></SidebarProvider>; }
