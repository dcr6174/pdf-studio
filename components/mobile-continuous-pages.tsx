'use client';
import {useEffect,useRef,type ReactNode} from 'react';
type Page={id:string};
export function MobileContinuousPages<T extends Page>({pages,activePage,onPage,renderPage}:{pages:T[];activePage:string;onPage:(id:string)=>void;renderPage:(page:T)=>ReactNode}){
 const host=useRef<HTMLDivElement>(null),frame=useRef<number|null>(null),current=useRef(activePage);current.current=activePage;
 const select=()=>{const node=host.current;if(!node)return;const children=Array.from(node.children) as HTMLElement[];if(!children.length)return;const center=node.scrollTop+Math.min(node.clientHeight/2,160);let low=0,high=children.length-1;while(low<high){const mid=Math.floor((low+high)/2),child=children[mid];if(child.offsetTop+child.offsetHeight<center)low=mid+1;else high=mid;}const id=children[low]?.dataset.pageId;if(id&&id!==current.current){current.current=id;onPage(id);}};
 const schedule=()=>{if(frame.current!==null)return;frame.current=requestAnimationFrame(()=>{frame.current=null;select();});};
 useEffect(()=>{const node=host.current;if(!node)return;const initial=Array.from(node.children).find(child=>(child as HTMLElement).dataset.pageId===current.current) as HTMLElement|undefined;if(initial)node.scrollTop=initial.offsetTop;select();const observer=new ResizeObserver(schedule);observer.observe(node);return()=>{observer.disconnect();if(frame.current!==null)cancelAnimationFrame(frame.current);};},[pages.length]);
 return <div ref={host} className="mobile-continuous-pages" aria-label="Scroll through PDF pages" onScroll={schedule}>{pages.map((page,i)=><section key={page.id} data-page-id={page.id} aria-label={`PDF page ${i+1}`}><span className="mobile-page-label">Page {i+1}</span>{renderPage(page)}</section>)}</div>;
}
