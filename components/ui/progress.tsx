"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import './progress-wave.css'

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const clipId=React.useId();
  const amount=Math.max(0,Math.min(100,value??35))*2.8;
  const wave='M -64 10 '+Array.from({length:13},(_,i)=>{const x=-64+i*32;return `C ${x+4} 10 ${x+4} 6 ${x+8} 6 S ${x+20} 14 ${x+24} 14 S ${x+28} 10 ${x+32} 10`;}).join(' ');
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative h-4 w-full overflow-hidden wavy-progress",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 280 20" preserveAspectRatio="none" aria-hidden="true" className="progress-wave-svg">
        <defs><clipPath id={clipId}><rect width={amount} height="20"/></clipPath></defs>
        {amount<272&&<line x1={amount+8} y1="10" x2="278" y2="10" className="progress-wave-track"/>}
        <g clipPath={`url(#${clipId})`}><path d={wave} className="progress-wave-fill"/></g>
      </svg>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className="sr-only"/>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
