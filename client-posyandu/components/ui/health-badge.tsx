import { cn } from "@/lib/utils"

export type HealthStatus = "HEALTHY" | "AT_RISK" | "STUNTED" | "SEVERELY_STUNTED" | "NORMAL" | "RISK"

interface HealthBadgeProps {
  status: HealthStatus
  className?: string
  showIcon?: boolean
}

// Map backend statuses to colors/labels
// Backend uses: NORMAL, RISK, STUNTED, SEVERELY_STUNTED
// Frontend mock used: HEALTHY, AT_RISK

function getStatusColor(status: string) {
  switch (status) {
    case "HEALTHY":
    case "NORMAL":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
    case "AT_RISK":
    case "RISK":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "STUNTED":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" }
    case "SEVERELY_STUNTED":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" }
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "HEALTHY":
    case "NORMAL":
      return "Normal"
    case "AT_RISK":
    case "RISK":
      return "Berisiko"
    case "STUNTED":
      return "Stunting"
    case "SEVERELY_STUNTED":
      return "Stunting Berat"
    default:
      return status
  }
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
            (status === "HEALTHY" || status === "NORMAL") && "bg-emerald-500",
            (status === "AT_RISK" || status === "RISK") && "bg-amber-500",
            status === "STUNTED" && "bg-orange-500",
            status === "SEVERELY_STUNTED" && "bg-red-500 animate-pulse",
          )}
        />
      )}
      {label}
    </span>
  )
}