"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, ArrowRight, Clock, Navigation } from "lucide-react"
import { mockPosyandu } from "@/lib/mock-data"

export function HubConnectionWidget() {
  const posyandu = mockPosyandu
  const hub = posyandu.assigned_hub

  if (!hub) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <Building2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-700">Belum Terhubung</p>
            <p className="text-sm text-amber-600">Posyandu belum memiliki Hub Logistik terkait</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Navigation className="h-5 w-5 text-primary" />
          Koneksi Hub Logistik
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Visual */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Posyandu */}
          <div className="flex-1 min-w-0 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Posyandu</p>
                <p className="text-sm font-semibold truncate">{posyandu.name}</p>
              </div>
            </div>
          </div>

          {/* Arrow with distance */}
          <div className="flex shrink-0 flex-col items-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">{hub.distance_km} km</span>
          </div>

          {/* Hub */}
          <div className="flex-1 min-w-0 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Hub Logistik</p>
                <p className="text-sm font-semibold truncate">{hub.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="relative h-40 overflow-hidden rounded-xl border bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Peta interaktif akan tampil di sini</p>
            </div>
          </div>
          {/* Posyandu Marker */}
          <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg">
              <MapPin className="h-3 w-3 text-white" />
            </div>
          </div>
          {/* Hub Marker */}
          <div className="absolute right-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
              <Building2 className="h-3 w-3 text-white" />
            </div>
          </div>
          {/* Connection Line */}
          <div className="absolute left-1/4 right-1/4 top-[42%] h-0.5 bg-gradient-to-r from-primary to-emerald-500 opacity-50" />
        </div>

        {/* Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Estimasi: {hub.travel_time_minutes} menit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
