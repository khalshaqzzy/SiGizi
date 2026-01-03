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
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 mb-4">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Daftar Logistics Hub</h1>
          <p className="text-sm text-slate-500 mt-2">
            Bergabung dengan jaringan SiGizi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Informasi Akun</h3>

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Konfirmasi</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detail Hub</h3>

            <div className="space-y-1.5">
              <Label htmlFor="hubName">Nama Hub</Label>
              <Input
                id="hubName"
                value={formData.hubName}
                onChange={(e) => setFormData({ ...formData, hubName: e.target.value })}
                className="bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Alamat Lengkap</Label>
              <AddressAutocomplete
                value={formData.address}
                onChange={handleAddressChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar Sekarang"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-emerald-600 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}