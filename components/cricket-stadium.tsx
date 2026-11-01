'use client';
import './cricket-screen.css';
import {useEffect,useRef,useState} from 'react';
import type {BowledBall,ShotSide,StrokeResult} from '@/lib/cricket-engine';
import {CricketStadiumFallback} from './cricket-stadium-fallback';

export type CricketSceneState={
 ball:BowledBall;elapsed:number;result:StrokeResult|null;shotDirection:ShotSide;
 battingColor?:string;fieldingColor?:string;night?:boolean;view?:'bat'|'bowl';quality?:'auto'|'low'|'high';
 loft:boolean;phase:'setup'|'bowling'|'result'|'done';strokeFlash:number;active:boolean;comfort:boolean;
};

/** The renderer is loaded only by cricket. The existing SVG remains playable without WebGL. */
export function CricketStadium(props:CricketSceneState){
 const canvas=useRef<HTMLCanvasElement>(null),latest=useRef(props);
 const [mode,setMode]=useState<'loading'|'3d'|'2d'>('loading');
 useEffect(()=>{latest.current=props;},[props]);
 useEffect(()=>{
  if(props.quality==='low'){const id=setTimeout(()=>setMode('2d'),0);return()=>clearTimeout(id);}
  let cancelled=false,dispose:(()=>void)|undefined;
  const fail=()=>{if(!cancelled){dispose?.();dispose=undefined;setMode('2d');}};
  void import('./cricket-stadium-scene').then(({createCricketScene})=>{
   if(cancelled||!canvas.current)return;
   try{dispose=createCricketScene(canvas.current,()=>latest.current,fail);setMode('3d');}catch{fail();}
  }).catch(fail);
  return()=>{cancelled=true;dispose?.();};
 },[props.quality]);
 const description=(props.view==='bowl'?'Cricket stadium from the bowling end. ':'Cricket stadium behind the striker. ')+props.ball.style+' delivery, '+props.ball.length+' length. '+(props.result?props.result.comment:'Watch the ball and bounce marker.');
 return <div className="pc-stadium" role="img" aria-label={description}>
  <canvas className="pc-stadium-canvas" ref={canvas} aria-hidden="true" hidden={mode!=='3d'}/>
  {mode!=='3d'&&<CricketStadiumFallback {...props}/>}
  <span className="pc-renderer-label">{mode==='loading'?'Preparing stadium…':mode==='2d'?'2D compatibility mode':'LIVE · STADIUM 01'}</span>
 </div>;
}
