'use client';
import Link from '@/components/browser-link';
export function CreativeMenu({disabled=false}:{disabled?:boolean}){
 return <Link className="lab-link" href="/lab" aria-disabled={disabled} onClick={e=>{if(disabled)e.preventDefault();}} title="Image Studio and Creative Studio">Lab</Link>;
}
