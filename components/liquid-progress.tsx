'use client';
import {type CSSProperties} from 'react';
import './liquid-progress.css';
// Chokcoco: https://codepen.io/Chokcoco/pen/rNzGbWY
// Keep the original two elements and pseudo-elements. Only the demo's
// repeating level timer is replaced by a transition to measured progress.
export function LiquidProgress({value}:{value?:number}){
 const known=typeof value==='number'&&Number.isFinite(value),amount=known?Math.max(0,Math.min(100,value)):50;
 return <div className="liquid-progress" role="progressbar" aria-label="Processing progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={known?Math.round(amount):undefined} aria-valuetext={known?`${Math.round(amount)}%`:'Working'} style={{'--liquid-top':`${80-2*amount}px`} as CSSProperties}>
  <div className="liquid-container" aria-hidden="true"><div className="wave-change"/><div className="wave"/></div>
  <span className="liquid-value"><b>{known?`${Math.round(amount)}%`:'Working'}</b></span>
 </div>;
}
