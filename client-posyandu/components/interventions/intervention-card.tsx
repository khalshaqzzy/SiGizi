"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AzureButton } from "@/components/ui/azure-button"
import { InterventionStatusStepper } from "./intervention-status-stepper"
import { Package, Phone, Clock, AlertTriangle, CheckCircle2, User, XCircle } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Intervention } from "@/lib/types"
import { cn } from "@/lib/utils"

interface InterventionCardProps {
  intervention: any // Using any to accommodate backend response shape
  onConfirmDelivered?: (id: string) => void
  onCancel?: (id: string) => void
}

export function InterventionCard({ intervention, onConfirmDelivered, onCancel }: InterventionCardProps) {
  const [liveEta, setLiveEta] = useState(intervention.eta)
  const isOnTheWay = intervention.status === "ON_THE_WAY"
  const isPending = intervention.status === "PENDING"
  const isCancelled = intervention.status === "CANCELLED"
  const isDelivered = intervention.status === "DELIVERED"
  const isHighUrgency = intervention.urgency === "HIGH"

  // Live Countdown Logic
  useEffect(() => {
    if (isOnTheWay && intervention.shipped_at && intervention.eta) {
      const initialMinutes = parseInt(intervention.eta)
      if (isNaN(initialMinutes)) return

      const arrivalTime = new Date(intervention.shipped_at).getTime() + initialMinutes * 60 * 1000

      const calculate = () => {
        const now = new Date().getTime()
        const diffMs = arrivalTime - now
        const diffMin = Math.ceil(diffMs / 60000)

        if (diffMin <= 0) {
          setLiveEta("Tiba segera")
        } else {
          setLiveEta(`${diffMin} menit lagi`)
        }
      }

      calculate()
      const timer = setInterval(calculate, 30000) // Update every 30s
      return () => clearInterval(timer)
    } else {
      setLiveEta(intervention.eta)
    }
  }, [isOnTheWay, intervention.shipped_at, intervention.eta])

  const canCancel = !isCancelled && !isDelivered
  const canConfirmDelivered = isOnTheWay

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isHighUrgency && isPending && "border-red-200",
        isCancelled && "opacity-75",
      )}
    >
      {isHighUrgency && isPending && (
        <div className="flex items-center gap-2 bg-red-500 px-4 py-1.5 text-white text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Urgensi Tinggi</span>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground font-normal">Anak: </span>
              {intervention.patient_name}
            </CardTitle>
            <p className="mt-1 text-[10px] font-mono text-muted-foreground">
              REQ-ID: {intervention.id}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Stepper */}
        <InterventionStatusStepper currentStatus={intervention.status} />

        {/* Shipment Details */}
        {intervention.shipped_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 p-2 rounded border border-slate-100">
            <Clock className="h-3.5 w-3.5" />
            <span>Dikirim pada: {format(new Date(intervention.shipped_at), "HH:mm", { locale: id })}</span>
          </div>
        )}

        {/* Driver Info */}
        {intervention.driver && (isOnTheWay || isDelivered) && (
          <div className="flex items-center justify-between rounded-lg border bg-emerald-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{intervention.driver.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1 rounded font-bold uppercase tracking-tighter">Driver</span>
                  {isOnTheWay && (
                    <span className="text-[10px] text-emerald-700 font-semibold animate-pulse">
                      ~{liveEta}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-none h-8" asChild>
              <a href={`tel:${intervention.driver.phone}`}>
                <Phone className="h-3.5 w-3.5" />
                Hubungi
              </a>
            </Button>
          </div>
        )}

        {/* Cancelled Info */}
        {isCancelled && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
            <p className="text-red-700">
              Dibatalkan
            </p>
          </div>
        )}

        {/* Delivered Info */}
        {isDelivered && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <p className="text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Bantuan Telah Diterima
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canConfirmDelivered && onConfirmDelivered && (
            <AzureButton className="flex-1" onClick={() => onConfirmDelivered(intervention.id)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Konfirmasi Diterima
            </AzureButton>
          )}

          {canCancel && onCancel && (
            <Button
              variant="outline"
              className={cn(
                "gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700",
                canConfirmDelivered ? "" : "flex-1",
              )}
              onClick={() => onCancel(intervention.id)}
            >
              <XCircle className="h-4 w-4" />
              Batalkan
            </Button>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground text-center">
          Dibuat: {format(new Date(intervention.created_at), "d MMMM yyyy, HH:mm", { locale: id })}
        </p>
      </CardContent>
    </Card>
  )
}