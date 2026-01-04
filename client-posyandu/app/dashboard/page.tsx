"use client"

import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { HubConnectionWidget } from "@/components/dashboard/hub-connection-widget"
import { RecentMeasurementsTable } from "@/components/dashboard/recent-measurements-table"
import { mockDashboardStats } from "@/lib/mock-data"
import { Users, Activity, AlertTriangle, HeartPulse } from "lucide-react"

export default function DashboardPage() {
  const stats = mockDashboardStats

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Pantau kesehatan gizi anak di Posyandu Anda" />

      <div className="p-8 space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Anak" value={stats.total_children} subtitle="Terdaftar di Posyandu" icon={Users} />
          <StatCard
            title="Intervensi Aktif"
            value={stats.active_interventions}
            subtitle="Bantuan dalam proses"
            icon={Activity}
          />
          <StatCard
            title="Red Zone Alert"
            value={stats.red_zone_count}
            subtitle="Butuh penanganan segera"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Status Normal"
            value={stats.healthy_count}
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
              value={stats.at_risk_count}
              subtitle="Perlu monitoring ketat"
              icon={Activity}
              variant="warning"
            />
            <StatCard
              title="Pemeriksaan Bulan Ini"
              value={12}
              subtitle="Anak sudah diperiksa"
              icon={HeartPulse}
              trend={{ value: 15, positive: true }}
            />
          </div>
        </div>

        {/* Recent Measurements Table */}
        <RecentMeasurementsTable />
      </div>
    </div>
  )
}
