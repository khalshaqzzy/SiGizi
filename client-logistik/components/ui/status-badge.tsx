import type React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant =
  | "pending"
  | "assigned"
  | "on_the_way"
  | "delivered"
  | "confirmed"
  | "available"
  | "on_delivery"
  | "off_duty"
  | "high"
  | "medium"
  | "low"

interface StatusBadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  assigned: "bg-blue-50 text-blue-700 border-blue-200",
  on_the_way: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_delivery: "bg-blue-50 text-blue-700 border-blue-200",
  off_duty: "bg-slate-100 text-slate-600 border-slate-200",
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-600 border-slate-200",
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
