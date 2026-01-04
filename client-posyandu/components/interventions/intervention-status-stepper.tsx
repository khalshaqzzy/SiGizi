"use client"

import { cn } from "@/lib/utils"
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react"
import type { InterventionStatus } from "@/lib/types"

interface InterventionStatusStepperProps {
  currentStatus: InterventionStatus
  className?: string
}

const steps = [
  { status: "PENDING", label: "Menunggu", icon: Clock },
  { status: "ON_THE_WAY", label: "Dikirim", icon: Truck },
  { status: "DELIVERED", label: "Diterima", icon: CheckCircle2 },
]

const statusOrder: InterventionStatus[] = ["PENDING", "ON_THE_WAY", "DELIVERED"]

export function InterventionStatusStepper({ currentStatus, className }: InterventionStatusStepperProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className={cn("flex w-full justify-center", className)}>
        <div className="flex items-center justify-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-700">Bantuan Dibatalkan</p>
            <p className="text-sm text-red-600">Permintaan ini telah dibatalkan</p>
          </div>
        </div>
      </div>
    )
  }

  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <div className="flex items-center w-full max-w-sm">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const Icon = step.icon

          return (
            <div key={step.status} className="flex flex-1 items-center">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "border-border bg-card text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      index < currentIndex ? "bg-primary" : "bg-border",
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
