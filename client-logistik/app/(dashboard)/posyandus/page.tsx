"use client"

import { useQuery } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MapPin, Clock, Navigation, Loader2 } from "lucide-react"
import { CardGridSkeleton } from "@/components/skeletons"
import api from "@/lib/axios"
import type { Posyandu } from "@/lib/types"

export default function PosyandusPage() {
  const { data: posyandus = [], isLoading } = useQuery({
    queryKey: ["posyandus"],
    queryFn: async () => {
      const res = await api.get("/posyandus")
      return res.data
    },
  })

  return (
    <DashboardLayout title="Posyandus" description="Daftar Posyandu yang dilayani oleh hub Anda">
      <div className="space-y-6">
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Navigation className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-emerald-800">Assignment Otomatis</h4>
              <p className="text-sm text-emerald-700 mt-1">
                Posyandu di bawah ini secara otomatis di-assign ke hub Anda berdasarkan jarak dan waktu tempuh terdekat.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <CardGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posyandus.map((posyandu: any) => ( // Using any temporarily as backend type might differ slightly from frontend mock
              <div key={posyandu._id || posyandu.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-slate-900">{posyandu.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{posyandu.address}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Navigation className="w-4 h-4" />
                    <span>Lat: {posyandu.location?.coordinates[1]?.toFixed(4)}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">ID: {posyandu.health_posyandu_id}</div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && posyandus.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900">Belum ada Posyandu</h3>
            <p className="text-sm text-slate-500 mt-1">Posyandu akan muncul setelah di-sync dari sistem Health</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}