"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Driver } from "@/lib/types"
import { toast } from "sonner"

interface DriverModalProps {
  driver?: Driver | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Driver, "id" | "created_at">) => void
}

export function DriverModal({ driver, isOpen, onClose, onSave }: DriverModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicle_number: "",
    status: "AVAILABLE" as Driver["status"],
  })

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        phone: driver.phone,
        vehicle_number: driver.vehicle_number,
        status: driver.status,
      })
    } else {
      setFormData({
        name: "",
        phone: "",
        vehicle_number: "",
        status: "AVAILABLE",
      })
    }
  }, [driver])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.vehicle_number) {
      toast.error("Lengkapi semua field")
      return
    }

    // Simple phone validation
    if (!/^08[0-9]{8,12}$/.test(formData.phone)) {
      toast.error("Format nomor telepon tidak valid")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    onSave(formData)

    toast.success(driver ? "Driver berhasil diupdate!" : "Driver berhasil ditambahkan!")
    setIsLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">{driver ? "Edit Driver" : "Tambah Driver Baru"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Nama Lengkap</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="contoh: Budi Santoso"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Nomor Telepon</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="contoh: 081234567890"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-slate-400">Format: 08xxxxxxxxxx</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Nomor Kendaraan</Label>
            <Input
              value={formData.vehicle_number}
              onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value.toUpperCase() })}
              placeholder="contoh: B 1234 ABC"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 uppercase"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as Driver["status"] })}
            >
              <SelectTrigger className="h-10 bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                <SelectItem value="ON_DELIVERY">Dalam Pengiriman</SelectItem>
                <SelectItem value="OFF_DUTY">Tidak Bertugas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : driver ? (
                "Update Driver"
              ) : (
                "Tambah Driver"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
