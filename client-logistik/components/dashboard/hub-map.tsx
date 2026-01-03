"use client"

import { MapPin, Navigation } from "lucide-react"
import type { Posyandu } from "@/lib/types"

interface HubMapProps {
  hubLocation: { lat: number; lng: number }
  posyandus: Posyandu[]
}

export function HubMap({ hubLocation, posyandus }: HubMapProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-base font-medium text-slate-900">Peta Jangkauan</h3>
        <p className="text-sm text-slate-500">Posyandu yang dilayani</p>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-48 bg-slate-100">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url('/street-map-jakarta.jpg')`,
          }}
        />

        {/* Hub Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs font-medium text-slate-700 bg-white px-2 py-0.5 rounded shadow mt-1 text-center">
            Hub
          </div>
        </div>

        {/* Posyandu Markers (simulated positions) */}
        {posyandus.slice(0, 3).map((pos, index) => {
          const positions = [
            { top: "30%", left: "25%" },
            { top: "60%", left: "70%" },
            { top: "20%", left: "65%" },
          ]
          const position = positions[index]

          return (
            <div
              key={pos.id}
              className="absolute z-5"
              style={{ top: position.top, left: position.left, transform: "translate(-50%, -50%)" }}
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow ring-2 ring-blue-500/20">
                <MapPin className="w-3 h-3 text-white" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span>Hub Anda</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Posyandu ({posyandus.length})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
