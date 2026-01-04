import { cn } from "@/lib/utils"
import { getStatusColor, getStatusLabel } from "@/lib/mock-data"
import type { HealthStatus } from "@/lib/types"

interface HealthBadgeProps {
  status: HealthStatus
  className?: string
  showIcon?: boolean
}

export function HealthBadge({ status, className, showIcon = false }: HealthBadgeProps) {
  const colors = getStatusColor(status)
  const label = getStatusLabel(status)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
    >
      {showIcon && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === "HEALTHY" && "bg-emerald-500",
            status === "AT_RISK" && "bg-amber-500",
            status === "STUNTED" && "bg-orange-500",
            status === "SEVERELY_STUNTED" && "bg-red-500 animate-pulse",
          )}
        />
      )}
      {label}
    </span>
  )
}
