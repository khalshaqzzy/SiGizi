import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  variant?: "default" | "danger" | "warning" | "success"
  className?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-shadow hover:shadow-md",
        variant === "danger" && "border-red-200 bg-red-50/50",
        variant === "warning" && "border-amber-200 bg-amber-50/50",
        variant === "success" && "border-emerald-200 bg-emerald-50/50",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              variant === "danger" && "bg-red-100 text-red-600",
              variant === "warning" && "bg-amber-100 text-amber-600",
              variant === "success" && "bg-emerald-100 text-emerald-600",
              variant === "default" && "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              "mt-1 text-3xl font-bold tracking-tight",
              variant === "danger" && "text-red-600",
              variant === "warning" && "text-amber-600",
              variant === "success" && "text-emerald-600",
              variant === "default" && "text-foreground",
            )}
          >
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-2 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% dari bulan lalu
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
