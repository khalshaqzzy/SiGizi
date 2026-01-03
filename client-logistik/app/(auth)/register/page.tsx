"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Eye, EyeOff, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddressAutocomplete } from "@/components/maps/address-autocomplete"
import { toast } from "sonner"
import api from "@/lib/axios"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    hubName: "",
    address: "",
    lat: 0,
    lng: 0,
  })

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok")
      return
    }

    if (!formData.lat || !formData.lng) {
      toast.error("Lokasi belum dipilih")
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/register', {
        username: formData.username,
        password: formData.password,
        name: formData.hubName,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng
      });

      toast.success("Registrasi berhasil!", {
        description: "Akun telah dibuat. Silakan login.",
      })

      router.push("/login")
    } catch (error: any) {
      toast.error("Registrasi gagal", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-10 md:hidden">
        <div className="flex items-center gap-2 text-slate-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SiGizi</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Buat Akun Hub</h1>
        <p className="text-slate-500 mt-2">Daftarkan gudang logistik Anda untuk mulai mendistribusikan bantuan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Section */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informasi Akun</h3>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                placeholder="nama_pengguna"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="text-sm font-semibold text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 pr-12 rounded-xl"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" title="Konfirmasi Password" className="text-sm font-semibold text-slate-700">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Hub Details Section */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Hub</h3>

            <div className="space-y-2">
              <Label htmlFor="hubName" className="text-sm font-semibold text-slate-700">Nama Gudang/Hub</Label>
              <Input
                id="hubName"
                value={formData.hubName}
                onChange={(e) => setFormData({ ...formData, hubName: e.target.value })}
                className="h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                placeholder="Gudang Bandung Pusat"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Alamat & Lokasi Map</Label>
              <AddressAutocomplete
                value={formData.address}
                onChange={handleAddressChange}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              Masuk
            </Link>
          </p>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
          </Button>
        </div>
      </form>
    </div>
  )
}