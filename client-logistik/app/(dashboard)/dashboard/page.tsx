"use client"

import { useQuery } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentShipments } from "@/components/dashboard/recent-shipments"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { HubMap } from "@/components/dashboard/hub-map"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { Package, Truck, Users, AlertTriangle } from "lucide-react"
import api from "@/lib/axios"
import { useAuth } from "@/context/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/dashboard/stats")).data,
  })

  const { data: shipments = [] } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => (await api.get("/shipments")).data,
  })

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => (await api.get("/inventory")).data,
  })

  const { data: posyandus = [] } = useQuery({
    queryKey: ["posyandus"],
    queryFn: async () => (await api.get("/posyandus")).data,
  })

  return (
    <DashboardLayout title="Dashboard" description="Ringkasan operasional logistics hub Anda">
      <div className="space-y-6">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Pengiriman Aktif"
              value={stats.active_shipments}
              subtitle="Dalam proses"
              icon={Package}
              variant="default"
            />
            <StatsCard
              title="Ketersediaan Driver"
              value={`${stats.driver_availability}%`}
              subtitle="Siap antar"
              icon={Users}
              variant="success"
            />
            <StatsCard
              title="Stok Menipis"
              value={stats.low_stock_items}
              subtitle="Perlu restok"
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title="Selesai Hari Ini"
              value={stats.completed_today}
              subtitle="Pengiriman sukses"
              icon={Truck}
              variant="success"
            />
          </div>
        )}

        <LowStockAlert items={inventory} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentShipments shipments={shipments} />
          </div>

          <div className="space-y-6">
            <QuickActions />
            {user?.location && (
              <HubMap 
                hubLocation={{ lat: user.location.coordinates[1], lng: user.location.coordinates[0] }} 
                posyandus={posyandus} 
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}