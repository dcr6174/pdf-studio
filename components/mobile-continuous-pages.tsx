'use client';
import {useCallback,useEffect,useRef,type ReactNode} from 'react';
type Page={id:string};
export function MobileContinuousPages<T extends Page>({pages,activePage,onPage,renderPage}:{pages:T[];activePage:string;onPage:(id:string)=>void;renderPage:(page:T)=>ReactNode}){
 const host=useRef<HTMLDivElement>(null),frame=useRef<number|null>(null),current=useRef(activePage),fromScroll=useRef<string|null>(null);
 const select=useCallback(()=>{const node=host.current;if(!node)return;const children=Array.from(node.children) as HTMLElement[];const top=node.getBoundingClientRect().top+24;const child=children.find(el=>el.getBoundingClientRect().bottom>top)??children.at(-1),id=child?.dataset.pageId;if(id&&id!==current.current){fromScroll.current=id;current.current=id;onPage(id);}},[onPage]);
 const schedule=useCallback(()=>{if(frame.current!==null)return;frame.current=requestAnimationFrame(()=>{frame.current=null;select();});},[select]);
 useEffect(()=>{current.current=activePage;const node=host.current;if(!node)return;if(fromScroll.current===activePage){fromScroll.current=null;return;}const target=Array.from(node.children).find(child=>(child as HTMLElement).dataset.pageId===activePage) as HTMLElement|undefined;if(target)node.scrollTop+=target.getBoundingClientRect().top-node.getBoundingClientRect().top;},[activePage,pages.length]);
 useEffect(()=>{const node=host.current;if(!node)return;const observer=new ResizeObserver(schedule);observer.observe(node);return()=>{observer.disconnect();if(frame.current!==null){cancelAnimationFrame(frame.current);frame.current=null;}};},[pages.length,schedule]);
 return <div ref={host} className="mobile-continuous-pages mobile-pdf-scroll" role="region" tabIndex={0} aria-label="Scroll through PDF pages" onScroll={schedule}>{pages.map((page,i)=><section key={page.id} data-page-id={page.id} aria-label={`PDF page ${i+1}`}><span className="mobile-page-label">Page {i+1}</span>{renderPage(page)}</section>)}</div>;
}

