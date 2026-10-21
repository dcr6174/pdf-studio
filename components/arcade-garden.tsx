'use client';
import {lazy,Suspense,useState} from 'react';
const GardenPanel=lazy(()=>import('@/components/arcade-garden-panel').then(m=>({default:m.ArcadeGardenPanel})));
/** Shared by the directory and all three Arcade game families, never PDF tools. */
export function ArcadeGarden({onOpen}:{onOpen?:()=>void}){const [open,setOpen]=useState(false);return <><button type="button" className="arcade-garden-trigger" onClick={()=>{onOpen?.();setOpen(true);}} aria-haspopup="dialog"><span aria-hidden="true">✿</span> Buddy’s Garden</button>{open&&<Suspense fallback={<div className="arcade-garden-loading" role="status">Opening your garden… <button type="button" onClick={()=>setOpen(false)}>Cancel</button></div>}><GardenPanel onClose={()=>setOpen(false)}/></Suspense>}</>;}
