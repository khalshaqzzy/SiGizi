"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AzureButton } from "@/components/ui/azure-button"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { Heart, Eye, EyeOff, ArrowRight, ArrowLeft, MapPin, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form data
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [posyanduName, setPosyanduName] = useState("")
  const [address, setAddress] = useState("")
  const [lat, setLat] = useState(-6.2)
  const [lng, setLng] = useState(106.816)

  const { register } = useAuth()
  const router = useRouter()

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok")
      return
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await register({
        username,
        password,
        posyandu_name: posyanduName,
        address,
        lat,
        lng,
      })

      if (success) {
        toast.success("Registrasi berhasil!")
        router.push("/dashboard")
      } else {
        toast.error("Registrasi gagal. Silakan coba lagi.")
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary to-primary/80 p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Heart className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance">Bergabung dengan Jaringan SiGizi</h1>
          <p className="text-lg text-white/80">
            Daftarkan Posyandu Anda dan mulai pantau kesehatan gizi anak dengan sistem terintegrasi.
          </p>

          {/* Steps Indicator */}
          <div className="flex justify-center gap-4 pt-8">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 transition-colors",
                step >= 1 ? "bg-white/20" : "bg-white/5",
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  step >= 1 ? "bg-white text-primary" : "bg-white/20",
                )}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm">Info Akun</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 transition-colors",
                step >= 2 ? "bg-white/20" : "bg-white/5",
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  step >= 2 ? "bg-white text-primary" : "bg-white/20",
                )}
              >
                2
              </div>
              <span className="text-sm">Detail Posyandu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SiGizi</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">{step === 1 ? "Buat Akun Baru" : "Detail Posyandu"}</CardTitle>
              <CardDescription>
                {step === 1
                  ? "Langkah 1 dari 2: Buat kredensial akun Anda"
                  : "Langkah 2 dari 2: Lengkapi informasi Posyandu"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <form onSubmit={handleStep1} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <AzureButton type="submit" className="w-full">
                    Lanjutkan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </AzureButton>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="posyanduName">Nama Posyandu</Label>
                    <Input
                      id="posyanduName"
                      type="text"
                      placeholder="Contoh: Posyandu Mawar 01"
                      value={posyanduName}
                      onChange={(e) => setPosyanduName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Masukkan alamat lengkap"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Map Preview Placeholder */}
                  <div className="space-y-2">
                    <Label>Lokasi Posyandu</Label>
                    <div className="relative h-48 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <MapPin className="h-8 w-8 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground text-center px-4">
                          Peta Google Maps akan terintegrasi di sini
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Klik untuk memilih lokasi</p>
                      </div>
                    </div>
                    {/* Coordinates Display */}
                    <div className="flex gap-4 text-xs">
                      <div className="flex-1 rounded-lg bg-muted p-2">
                        <span className="text-muted-foreground">Latitude: </span>
                        <span className="font-mono">{lat.toFixed(6)}</span>
                      </div>
                      <div className="flex-1 rounded-lg bg-muted p-2">
                        <span className="text-muted-foreground">Longitude: </span>
                        <span className="font-mono">{lng.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                    <AzureButton type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          Daftar Sekarang
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </AzureButton>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Sudah punya akun? </span>
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Masuk di sini
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
