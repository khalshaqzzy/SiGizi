"use client"

import { cn } from "@/lib/utils"

interface ZScoreGaugeProps {
  score: number
  className?: string
}

export function ZScoreGauge({ score, className }: ZScoreGaugeProps) {
  // Calculate position on the gauge (range from -5 to +3)
  const minScore = -5
  const maxScore = 3
  const range = maxScore - minScore
  const position = ((score - minScore) / range) * 100

  // Clamp position between 0 and 100
  const clampedPosition = Math.max(0, Math.min(100, position))

  return (
    <div className={cn("space-y-3", className)}>
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>-5 SD</span>
        <span>-3 SD</span>
        <span>-2 SD</span>
        <span>0</span>
        <span>+3 SD</span>
      </div>

      {/* Gauge Bar */}
      <div className="relative h-4 rounded-full overflow-hidden">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          {/* Severely Stunted (-5 to -3) = 25% */}
          <div className="h-full bg-red-400" style={{ width: "25%" }} />
          {/* Stunted/At Risk (-3 to -2) = 12.5% */}
          <div className="h-full bg-amber-400" style={{ width: "12.5%" }} />
          {/* Normal (-2 to +3) = 62.5% */}
          <div className="h-full bg-emerald-400" style={{ width: "62.5%" }} />
        </div>

        {/* Indicator needle */}
        <div
          className="absolute top-0 h-full w-1 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${clampedPosition}%` }}
        >
          <div className="h-full w-1 bg-foreground rounded-full shadow-lg" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-foreground" />
        </div>
      </div>

      {/* Score display */}
      <div className="text-center">
        <span
          className={cn(
            "text-2xl font-bold font-mono",
            score < -3 && "text-red-600",
            score >= -3 && score < -2 && "text-amber-600",
            score >= -2 && "text-emerald-600",
          )}
        >
          {score.toFixed(2)} SD
        </span>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="text-muted-foreground">{"< -3 SD (Stunting Berat)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="text-muted-foreground">-3 s/d -2 SD (Berisiko)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">{"> -2 SD (Normal)"}</span>
        </div>
      </div>
    </div>
  )
}