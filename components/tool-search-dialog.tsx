'use client';
import '@/app/tool-search.css';
import {useRef,useState} from 'react';
import {Search,FileText} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {groups} from '@/lib/tools';
import {searchToolsDetailed,commonToolIds} from '@/lib/tool-search';
import {toolIcons} from '@/lib/tool-icons';
export function ToolSearchDialog({open,onOpenChange,onSelect}:{open:boolean;onOpenChange:(open:boolean)=>void;onSelect:(id:string)=>void}){
 const [query,setQuery]=useState(''),[active,setActive]=useState(0);
 const previousFocus=useRef<HTMLElement|null>(null);
 const input=useRef<HTMLInputElement>(null),rows=useRef<(HTMLButtonElement|null)[]>([]);
 const found=searchToolsDetailed(query),searching=query.trim().length>0;
 const results=found.tools;
 const choose=(id:string)=>{onSelect(id);onOpenChange(false);};
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent viewportPositioned className="tool-search-panel" style={{position:'fixed',top:'max(12px, 8dvh)',left:0,right:0,bottom:'auto',marginInline:'auto',transform:'none',translate:'none',width:'min(640px, calc(100vw - 24px))',maxWidth:'640px',maxHeight:'min(720px, 84dvh)'}} onCloseAutoFocus={e=>{e.preventDefault();if(previousFocus.current?.isConnected)previousFocus.current.focus();}} onOpenAutoFocus={e=>{e.preventDefault();previousFocus.current=document.activeElement as HTMLElement;setQuery('');setActive(0);input.current?.focus();}}>
 <DialogTitle className="sr-only">Find a PDF tool</DialogTitle><DialogDescription className="sr-only">Browse every tool or search by task. Arrow keys select; Enter opens.</DialogDescription>
 <div className="tool-search-input"><Search size={23} aria-hidden="true"/><input ref={input} value={query} placeholder="Find a PDF tool — try ‘reduce size’" aria-label="Search PDF tools" role="combobox" aria-autocomplete="list" aria-expanded={true} aria-controls="tool-search-results" aria-activedescendant={results[active]?'search-tool-'+results[active].id:undefined} autoComplete="off" spellCheck={false} onChange={e=>{setQuery(e.target.value);setActive(0);}} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(['ArrowDown','ArrowUp'].includes(e.key)&&results.length){e.preventDefault();const next=(active+(e.key==='ArrowDown'?1:-1)+results.length)%results.length;setActive(next);rows.current[next]?.scrollIntoView({block:'nearest'});}if(e.key==='Enter'&&results[active]){e.preventDefault();choose(results[active].id);}}}/></div>
 <p className="tool-search-meta" role="status">{searching?results.length+(results.length===1?' matching tool':' matching tools')+(found.mode==='any'?' · Related matches':''):'All '+results.length+' tools · search by name or task'}</p>
 <div id="tool-search-results" className="tool-search-results" role="listbox" aria-label="PDF tools">{results.map((t,i)=>{const Icon=toolIcons[t.id]??FileText;return <div key={t.id}>{!searching&&(i===0||i===commonToolIds.length||i>commonToolIds.length&&results[i-1].group!==t.group)&&<h3>{i===0?'Common tasks':t.group}</h3>}<button ref={el=>{rows.current[i]=el;}} id={'search-tool-'+t.id} role="option" aria-selected={active===i} tabIndex={-1} className={'tool-search-row category-'+groups.indexOf(t.group)+(active===i?' is-active':'')} onPointerMove={()=>setActive(i)} onClick={()=>choose(t.id)}><span className="tool-search-icon"><Icon size={21}/></span><span><b>{t.name}</b><small>{t.description}</small></span></button></div>;})}{!results.length&&<div className="tool-search-empty"><b>No matching tools</b><p>Try “smaller”, “combine” or “signature”.</p><button onClick={()=>{setQuery('');setActive(0);input.current?.focus();}}>Show all tools</button></div>}</div>
 </DialogContent></Dialog>;
}

