'use client';
import {type ReactNode} from 'react';
export function WorkspaceFloatingControls({pages,disabled}:{docked?:boolean;pages?:ReactNode;about?:string;addLabel?:string;onAdd?:()=>void;disabled:boolean}){
 return pages?<details className="page-settings workspace-inline-organize"><summary aria-disabled={disabled}><OrganizePagesIcon/> Organize pages</summary><div className="page-settings-controls" inert={disabled}>{pages}</div></details>:null;
}
export function OrganizePagesIcon(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="8" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/><path d="M14 17h7m-3-3 3 3-3 3"/></svg>;}
