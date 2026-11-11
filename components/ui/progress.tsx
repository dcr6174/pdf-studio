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
  const wave="M-20 8 Q-15 1 -10 8 T10 8 T30 8 T50 8 T70 8 T90 8 T110 8 T130 8";
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
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true" className="progress-wave-svg">
        <defs><clipPath id={clipId}><rect width={Math.max(0,Math.min(100,value??35))} height="16"/></clipPath></defs>
        <path d={wave} className="progress-wave-track"/>
        <g clipPath={`url(#${clipId})`}><path d={wave} className="progress-wave-fill"/></g>
      </svg>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className="sr-only"/>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
