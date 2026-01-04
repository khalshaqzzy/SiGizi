"use client"

import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Shipment } from "@/lib/types"

interface RecentShipmentsProps {
  shipments: Shipment[]
}

export function RecentShipments({ shipments }: RecentShipmentsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusLabel = (status: Shipment["status"]) => {
    const labels: Record<Shipment["status"], string> = {
      PENDING: "Menunggu",
      ON_THE_WAY: "Dalam Perjalanan",
      DELIVERED: "Selesai",
      CANCELLED: "Dibatalkan",
    }
    return labels[status]
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-slate-900">Pengiriman Terbaru</h3>
          <p className="text-sm text-slate-500">5 permintaan terakhir</p>
        </div>
        <Link
          href="/shipments"
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Lihat semua
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {shipments.slice(0, 5).map((shipment) => (
          <div key={shipment.id} className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">#{shipment.health_request_id}</span>
                  <StatusBadge variant={shipment.urgency.toLowerCase() as "high" | "medium" | "low"}>
                    {shipment.urgency}
                  </StatusBadge>
                </div>
                <p className="text-sm text-slate-600 mt-1 truncate">{shipment.posyandu.name}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatDate(shipment.created_at)}
                </div>
              </div>
              <StatusBadge variant={shipment.status.toLowerCase() as "pending" | "on_the_way" | "delivered" | "cancelled"}>
                {getStatusLabel(shipment.status)}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
