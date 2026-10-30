'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {activeArcadeGames} from '@/lib/arcade-active';
import {mountGameFrame} from './game-frame-core';
import './game-frame.css';
import './game-screen.css';
const games=activeArcadeGames.map(g=>({slug:g.slug,name:g.name}));
/** Wraps every game page in the shared arcade frame. The game itself renders unchanged inside. */
export function GameFrame({slug,children}:{slug:string;children:ReactNode}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=host.current;if(!el)return;return mountGameFrame(el,{slug,games});},[slug]);
 return <div ref={host} className="gf-host"><div>{children}</div></div>;
}
