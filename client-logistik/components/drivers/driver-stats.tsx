"use client"

import { Users, Truck, Clock } from "lucide-react"
import type { Driver } from "@/lib/types"

interface DriverStatsProps {
  drivers: Driver[]
}

export function DriverStats({ drivers }: DriverStatsProps) {
  const available = drivers.filter((d) => d.status === "AVAILABLE").length
  const onDelivery = drivers.filter((d) => d.status === "ON_DELIVERY").length
  const offDuty = drivers.filter((d) => d.status === "OFF_DUTY").length

  const stats = [
    {
      label: "Total Driver",
      value: drivers.length,
      icon: Users,
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "Tersedia",
      value: available,
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Dalam Pengiriman",
      value: onDelivery,
      icon: Truck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Tidak Bertugas",
      value: offDuty,
      icon: Clock,
      color: "bg-slate-100 text-slate-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
