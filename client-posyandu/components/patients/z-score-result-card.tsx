"use client"

import { Card, CardContent } from "@/components/ui/card"
import { HealthBadge } from "@/components/ui/health-badge"
import { ZScoreGauge } from "./z-score-gauge"
import { AlertTriangle, HeartPulse, Truck } from "lucide-react"
import type { HealthStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ZScoreResultCardProps {
  zScore: number
  status: HealthStatus
  onRequestAid?: () => void
}

export function ZScoreResultCard({ zScore, status, onRequestAid }: ZScoreResultCardProps) {
  const isSeverelyStunted = status === "SEVERELY_STUNTED"

  return (
    <Card className={cn("overflow-hidden", isSeverelyStunted && "border-red-300 ring-2 ring-red-100")}>
      {isSeverelyStunted && (
        <div className="flex items-center gap-2 bg-red-500 px-4 py-2 text-white">
          <AlertTriangle className="h-5 w-5" />
          <span className="text-sm font-semibold">ZONA MERAH - Intervensi Segera Diperlukan</span>
        </div>
      )}
      <CardContent className="p-6 space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                isSeverelyStunted ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary",
              )}
            >
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hasil Kalkulasi Z-Score</p>
              <p
                className={cn(
                  "text-3xl font-bold font-mono",
                  zScore < -3 && "text-red-600",
                  zScore >= -3 && zScore < -2 && "text-amber-600",
                  zScore >= -2 && "text-emerald-600",
                )}
              >
                {zScore.toFixed(2)}
              </p>
            </div>
          </div>
          <HealthBadge status={status} showIcon className="text-sm px-4 py-1.5" />
        </div>

        {/* Z-Score Gauge */}
        <ZScoreGauge score={zScore} />

        {/* Red Zone Action Button */}
        {isSeverelyStunted && onRequestAid && (
          <button
            onClick={onRequestAid}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 px-6 py-4 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-600 hover:shadow-xl animate-pulse-red"
          >
            <Truck className="h-5 w-5" />
            Ajukan Bantuan Gizi Sekarang
          </button>
        )}
      </CardContent>
    </Card>
  )
}