'use client';
import {memo,type CSSProperties} from 'react';
import './liquid-progress.css';
// Inspired by Chokcoco's CSS liquid fill. Rotation is independent of real progress.
const Surface=memo(function Surface(){return <><i className="liquid-surface liquid-surface-one"/><i className="liquid-surface liquid-surface-two"/></>;});
export function LiquidProgress({value}:{value?:number}){
 const known=typeof value==='number'&&Number.isFinite(value),amount=known?Math.max(0,Math.min(100,value)):50;
 return <div className={'liquid-progress'+(!known?' is-indeterminate':'')} role="progressbar" aria-label="Processing progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={known?Math.round(amount):undefined} aria-valuetext={known?`${Math.round(amount)}%`:'Working'} style={{'--liquid-level':`${40-amount}%`} as CSSProperties}>
  <div className="liquid-vessel" aria-hidden="true"><div className="liquid-level"><Surface/></div></div>
  <span className="liquid-value"><b>{known?`${Math.round(amount)}%`:'Working'}</b></span>
 </div>;
}
