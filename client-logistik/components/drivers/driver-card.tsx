"use client"

import { Phone, Truck, Edit2, Trash2, MoreHorizontal } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { Driver } from "@/lib/types"

interface DriverCardProps {
  driver: Driver
  onEdit: (driver: Driver) => void
  onDelete: (driver: Driver) => void
  onStatusChange: (driver: Driver, status: Driver["status"]) => void
}

export function DriverCard({ driver, onEdit, onDelete, onStatusChange }: DriverCardProps) {
  const getStatusLabel = (status: Driver["status"]) => {
    const labels: Record<Driver["status"], string> = {
      AVAILABLE: "Tersedia",
      ON_DELIVERY: "Dalam Pengiriman",
      OFF_DUTY: "Tidak Bertugas",
    }
    return labels[status]
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-emerald-700">{getInitials(driver.name)}</span>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-base font-medium text-slate-900">{driver.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{driver.phone}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Truck className="w-3.5 h-3.5" />
                <span>{driver.vehicle_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(driver)} className="cursor-pointer">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusChange(driver, "AVAILABLE")}
              disabled={driver.status === "AVAILABLE"}
              className="cursor-pointer"
            >
              Set Tersedia
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(driver, "OFF_DUTY")}
              disabled={driver.status === "OFF_DUTY"}
              className="cursor-pointer"
            >
              Set Tidak Bertugas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(driver)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status & Date */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <StatusBadge variant={driver.status.toLowerCase() as "available" | "on_delivery" | "off_duty"}>
          {getStatusLabel(driver.status)}
        </StatusBadge>
        <span className="text-xs text-slate-400">Bergabung: {formatDate(driver.created_at)}</span>
      </div>
    </div>
  )
}
