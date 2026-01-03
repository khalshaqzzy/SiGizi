"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Package, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import api from "@/lib/axios"

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', formData)
      login(response.data.token, response.data.user)
    } catch (error: any) {
      toast.error("Login gagal", {
        description: error.response?.data?.message || "Username atau password salah",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="mb-10 md:hidden">
        <div className="flex items-center gap-2 text-slate-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SiGizi</span>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h1>
        <p className="text-slate-500 mt-2">Masuk ke akun SiGizi Hub Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="h-12 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
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
              className="h-12 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 pr-12 rounded-xl"
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
        </Button>
      </form>

      <div className="mt-10 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}