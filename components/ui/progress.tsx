"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"
import './progress-wave.css'

// Fixed pixel geometry keeps the wavelength unchanged at every screen width.
// This layer never receives progress updates, so its CSS phase cannot restart.
const wave='M -40 10 '+Array.from({length:52},(_,i)=>{
  const x=-40+i*40;
  return `C ${x+3.684} 10 ${x+6.316} 7 ${x+10} 7 C ${x+13.684} 7 ${x+16.316} 10 ${x+20} 10 C ${x+23.684} 10 ${x+26.316} 13 ${x+30} 13 C ${x+33.684} 13 ${x+36.316} 10 ${x+40} 10`;
}).join(' ');
const WaveLayer=React.memo(function WaveLayer(){
  return <svg width="2080" height="20" aria-hidden="true" className="progress-wave-motion"><path d={wave} className="wave-tube-shadow"/><path d={wave} className="wave-tube-body"/><path d={wave} className="wave-tube-light"/></svg>;
});
function Progress({className,value,...props}:React.ComponentProps<typeof ProgressPrimitive.Root>){
  const amount=Math.max(0,Math.min(100,value??35));
  return <ProgressPrimitive.Root data-slot="progress" value={value} className={cn('relative w-full wavy-progress',className)} {...props}>
    <span aria-hidden="true" className="progress-wave-rest" style={{left:`calc(${amount}% + 8px)`,opacity:amount>=98?0:1}}/>
    <span aria-hidden="true" className="progress-wave-stop"/>
    <span aria-hidden="true" className="progress-wave-window" style={{width:`${amount}%`}}><WaveLayer/></span>
    <ProgressPrimitive.Indicator data-slot="progress-indicator" className="sr-only"/>
  </ProgressPrimitive.Root>;
}
export { Progress }
