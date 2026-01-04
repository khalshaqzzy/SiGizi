"use client"

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
  intervention: Intervention
  onConfirmDelivered?: (id: string) => void
  onCancel?: (id: string) => void
}

export function InterventionCard({ intervention, onConfirmDelivered, onCancel }: InterventionCardProps) {
  const isOnTheWay = intervention.status === "ON_THE_WAY"
  const isPending = intervention.status === "PENDING"
  const isCancelled = intervention.status === "CANCELLED"
  const isDelivered = intervention.status === "DELIVERED"
  const isHighUrgency = intervention.urgency === "HIGH"

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
              {intervention.patient_name}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              ID: {intervention.id} • Usia: {intervention.age_months} bulan
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Z-Score</p>
            <p className={cn("font-mono font-bold", intervention.z_score < -3 ? "text-red-600" : "text-amber-600")}>
              {intervention.z_score.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Stepper */}
        <InterventionStatusStepper currentStatus={intervention.status} />

        {/* Items List */}
        {intervention.items && intervention.items.length > 0 && (
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Barang yang Dikirim:</p>
            <div className="space-y-1">
              {intervention.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {item.qty} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Driver Info - only show when ON_THE_WAY */}
        {intervention.driver && isOnTheWay && (
          <div className="flex items-center justify-between rounded-lg border bg-emerald-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{intervention.driver.name}</p>
                <p className="text-xs text-muted-foreground">Driver</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              {intervention.driver.phone}
            </Button>
          </div>
        )}

        {/* ETA - only show when ON_THE_WAY */}
        {intervention.eta && isOnTheWay && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Estimasi tiba: {intervention.eta}</span>
          </div>
        )}

        {/* Cancelled Info */}
        {isCancelled && intervention.cancelled_at && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
            <p className="text-red-700">
              Dibatalkan oleh: {intervention.cancelled_by === "POSYANDU" ? "Posyandu" : "Logistik"}
            </p>
            <p className="text-red-600 text-xs mt-1">
              {format(new Date(intervention.cancelled_at), "d MMMM yyyy, HH:mm", { locale: id })}
            </p>
          </div>
        )}

        {/* Delivered Info */}
        {isDelivered && intervention.delivered_at && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <p className="text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Bantuan Telah Diterima
            </p>
            <p className="text-emerald-600 text-xs mt-1">
              {format(new Date(intervention.delivered_at), "d MMMM yyyy, HH:mm", { locale: id })}
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
