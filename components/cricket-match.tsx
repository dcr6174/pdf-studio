'use client';
import type {ArcadeEffect} from '@/lib/arcade-audio';
import {CricketQuickGame} from './cricket-quick-game';
export type CricketMatchProps={active:boolean;comfort:boolean;sound?:boolean;onToggleSound?:()=>void;onStart?:()=>void;onScore:(score:number)=>void;onFinish:(won:boolean,message:string)=>void;onSound:(effect:ArcadeEffect)=>void};
/** One route, one quick-match state machine. The shared frame owns global commands. */
export function CricketMatch(props:CricketMatchProps){return <CricketQuickGame {...props}/>;}
