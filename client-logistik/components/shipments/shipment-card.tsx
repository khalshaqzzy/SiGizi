import { MapPin, Clock, User, AlertCircle, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function ShipmentCard({ shipment, onAssign, onViewDetails }: any) {
  const [liveEta, setLiveEta] = useState(shipment.eta)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Menunggu",
      ON_THE_WAY: "Dalam Perjalanan",
      DELIVERED: "Diterima Posyandu",
      CANCELLED: "Dibatalkan",
    }
    return labels[status] || status
  }

  const status = shipment.status || "PENDING"
  const isOnTheWay = status === "ON_THE_WAY"

  // Live Countdown Logic
  useEffect(() => {
    if (isOnTheWay && shipment.updated_at && shipment.eta) {
      const initialMinutes = parseInt(shipment.eta)
      if (isNaN(initialMinutes)) return

      const arrivalTime = new Date(shipment.updated_at).getTime() + initialMinutes * 60 * 1000

      const calculate = () => {
        const now = new Date().getTime()
        const diffMs = arrivalTime - now
        const diffMin = Math.ceil(diffMs / 60000)

        if (diffMin <= 0) {
          setLiveEta("Tiba segera")
        } else {
          setLiveEta(`${diffMin} menit`)
        }
      }

      calculate()
      const timer = setInterval(calculate, 30000) // Update every 30s
      return () => clearInterval(timer)
    } else {
      setLiveEta(shipment.eta)
    }
  }, [isOnTheWay, shipment.updated_at, shipment.eta])

  const urgency = shipment.urgency || shipment.patient_details?.urgency || "LOW"
  const patientName = shipment.patient_name || shipment.patient_details?.name || "-"
  const ageMonths = shipment.age_months || shipment.patient_details?.age_months || 0
  const zScore = shipment.z_score || shipment.patient_details?.z_score || 0
  const posyanduName = shipment.posyandu?.name || shipment.posyandu_id?.name || "Posyandu"
  const posyanduAddress = shipment.posyandu?.address || shipment.posyandu_id?.address || "-"

  const getAgeLabel = (months: number) => {
    if (!months) return "Umur -"
    if (months < 12) return `${months} bulan`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) return `${years} tahun`
    return `${years} tahun ${remainingMonths} bulan`
  }

  const getZScoreLabel = (zScore: number) => {
    if (zScore === undefined) return "Status -"
    if (zScore < -3) return "Stunting Berat"
    if (zScore < -2) return "Stunting"
    return "Normal"
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-medium text-slate-900">#{shipment.health_request_id}</span>
          <StatusBadge variant={urgency.toLowerCase() as any}>
            {urgency === "HIGH" ? "Mendesak" : urgency === "MEDIUM" ? "Sedang" : "Rendah"}
          </StatusBadge>
        </div>
        <StatusBadge variant={status.toLowerCase() as any}>
          {getStatusLabel(status)}
        </StatusBadge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Patient Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pasien</p>
              <p className="text-sm font-medium text-slate-900 mt-0.5 truncate max-w-[120px]" title={patientName}>{patientName}</p>
              <p className="text-xs text-slate-500">{getAgeLabel(ageMonths)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Gizi</p>
              <p className="text-sm font-medium text-red-600 mt-0.5">{getZScoreLabel(zScore)}</p>
              <p className="text-xs text-slate-500">Z-Score: {zScore?.toFixed(1) || "-"}</p>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">{posyanduName}</p>
            <p className="text-xs text-slate-500 truncate">{posyanduAddress}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span>{shipment.posyandu?.distance_km || shipment.posyandu_id?.distance_km || "-"} km</span>
              <span>~{shipment.posyandu?.travel_time_minutes || shipment.posyandu_id?.travel_time_minutes || "-"} menit</span>
            </div>
          </div>
        </div>

        {/* Driver Info (if assigned) */}
        {shipment.driver && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{shipment.driver.name}</p>
              <p className="text-xs text-blue-600">{shipment.driver.vehicle_number}</p>
            </div>
            {liveEta && isOnTheWay && (
              <div className="text-right">
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Sisa Waktu</p>
                <p className="text-sm font-bold text-blue-700 animate-pulse">{liveEta}</p>
              </div>
            )}
          </div>
        )}

        {/* Items (if assigned) */}
        {shipment.items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Dikirim</p>
            <div className="flex flex-wrap gap-2">
              {shipment.items.map((item, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                  {item.qty}x {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatDate(shipment.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails?.(shipment)}
          className="text-slate-600 hover:text-slate-900"
        >
          Detail
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        {shipment.status === "PENDING" && (
          <Button
            onClick={() => onAssign?.(shipment)}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
          >
            Tugaskan Driver
          </Button>
        )}
      </div>
    </div>
  )
}
