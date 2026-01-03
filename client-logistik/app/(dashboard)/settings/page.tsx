"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddressAutocomplete } from "@/components/maps/address-autocomplete"
import { MapPin, Building2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import api from "@/lib/axios"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    hubName: "",
    address: "",
    lat: 0,
    lng: 0,
    phone: "",
    email: "", // Not editable usually, or separate
  })

  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            hubName: user.name || "",
            // We might need to fetch full profile details if user context is slim
        }))
        // Fetch full profile
        api.get('/drivers').then(() => {}).catch(() => {}) // Dummy call to check auth? No.
        // Actually we don't have a specific /me endpoint that returns full details if they are not in the token/context.
        // Let's assume user context has basic info and we might need to fetch more if needed.
        // For now, let's prefill what we have.
    }
  }, [user])

  const handleAddressChange = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      address,
      lat,
      lng,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
        const res = await api.put('/auth/profile', {
            name: formData.hubName,
            address: formData.address,
            lat: formData.lat,
            lng: formData.lng,
            // phone: formData.phone // Backend authController updateProfile needs to support phone if we want it
        })
        
        updateUser(res.data.user)
        toast.success("Pengaturan berhasil disimpan!")
    } catch (error: any) {
        toast.error("Gagal menyimpan pengaturan")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Pengaturan" description="Kelola profil dan konfigurasi hub Anda">
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hub Profile */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-slate-900">Profil Hub</h2>
                <p className="text-sm text-slate-500">Informasi dasar logistics hub Anda</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Nama Hub</Label>
                <Input
                  value={formData.hubName}
                  onChange={(e) => setFormData({ ...formData, hubName: e.target.value })}
                  className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-slate-900">Lokasi Hub</h2>
                <p className="text-sm text-slate-500">Lokasi digunakan untuk kalkulasi jarak pengiriman</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Alamat Lengkap</Label>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="Cari atau ubah alamat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Latitude</Label>
                  <Input
                    value={formData.lat.toFixed(6)}
                    readOnly
                    className="h-10 bg-slate-50 border-slate-200 text-slate-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Longitude</Label>
                  <Input
                    value={formData.lng.toFixed(6)}
                    readOnly
                    className="h-10 bg-slate-50 border-slate-200 text-slate-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
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
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}