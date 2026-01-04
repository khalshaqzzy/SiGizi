"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, ArrowRight, Clock, Navigation, Loader2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useQuery } from "@tanstack/react-query"
import apiLogistics from "@/lib/axios-logistics"
import { AssignedHubMap } from "./assigned-hub-map"

export function HubConnectionWidget() {
  const { user } = useAuth();

  const { data: assignment, isLoading, isError, error } = useQuery({
    queryKey: ["my-hub"],
    queryFn: async () => {
      const res = await apiLogistics.get("/posyandus/my-hub");
      return res.data;
    },
    enabled: !!user,
    retry: 1
  });

  const hub = assignment?.assigned_hub_id;
  
  const posyanduLoc = user?.posyandu_details?.location?.coordinates 
    ? { lat: user.posyandu_details.location.coordinates[1], lng: user.posyandu_details.location.coordinates[0] }
    : null;

  const hubLoc = hub?.location?.coordinates 
    ? { lat: hub.location.coordinates[1], lng: hub.location.coordinates[0] }
    : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Navigation className="h-5 w-5 text-primary" />
          Koneksi Hub Logistik
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-red-50 border border-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm font-medium text-red-900">Gagal Memuat Koneksi</p>
            <p className="text-xs text-red-600 mt-1">{(error as any)?.response?.data?.message || "Hubungi admin sistem"}</p>
          </div>
        ) : (
          <>
            {/* Connection Visual */}
            <div className="flex items-center gap-3">
              {/* Posyandu */}
              <div className="flex-1 min-w-0 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Posyandu</p>
                    <p className="text-sm font-semibold truncate">{user?.posyandu_details?.name || "Posyandu"}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex shrink-0 flex-col items-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                  {hub ? "Connected" : "Searching"}
                </span>
              </div>

              {/* Hub */}
              <div className="flex-1 min-w-0 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Hub Penyuplai</p>
                    <p className="text-sm font-semibold truncate">{hub?.name || "Belum Tersedia"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            {posyanduLoc && hubLoc ? (
              <AssignedHubMap 
                posyanduLocation={posyanduLoc}
                hubLocation={hubLoc}
                hubName={hub.name}
              />
            ) : (
              <div className="h-32 flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-300 text-sm text-slate-400">
                Data lokasi belum lengkap untuk peta
              </div>
            )}

            {/* Metrics */}
            {hub && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Jarak</p>
                    <p className="text-sm font-semibold">{assignment.distance_km} km</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Waktu Tempuh</p>
                    <p className="text-sm font-semibold">{assignment.travel_time_minutes} menit</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}