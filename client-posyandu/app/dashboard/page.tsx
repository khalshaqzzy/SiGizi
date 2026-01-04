"use client"

import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/components/ui/stat-card"
import { HubConnectionWidget } from "@/components/dashboard/hub-connection-widget"
import { RecentMeasurementsTable } from "@/components/dashboard/recent-measurements-table"
import { Users, Activity, AlertTriangle, HeartPulse } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import api from "@/lib/axios"

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/dashboard/stats")).data,
  })

  // Default values to prevent crash if stats are undefined
  const defaultStats = {
    total_children: 0,
    active_interventions: 0,
    red_zone_count: 0,
    healthy_count: 0,
    at_risk_count: 0
  }

  const safeStats = stats || defaultStats;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Pantau kesehatan gizi anak di Posyandu Anda" />

      <div className="p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Anak" value={safeStats.total_children} subtitle="Terdaftar di Posyandu" icon={Users} />
          <StatCard
            title="Intervensi Aktif"
            value={safeStats.active_interventions}
            subtitle="Bantuan dalam proses"
            icon={Activity}
          />
          <StatCard
            title="Red Zone Alert"
            value={safeStats.red_zone_count}
            subtitle="Butuh penanganan segera"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Status Normal"
            value={safeStats.healthy_count}
            subtitle="Gizi baik"
            icon={HeartPulse}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hub Connection Widget */}
          <HubConnectionWidget />

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Berisiko"
              value={safeStats.at_risk_count}
              subtitle="Perlu monitoring ketat"
              icon={Activity}
              variant="warning"
            />
            {/* Remove static card for now or fetch real data later */}
          </div>
        </div>

        {/* Recent Measurements Table */}
        <RecentMeasurementsTable />
      </div>
    </div>
  )
}