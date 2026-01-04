"use client"

import { useState, useEffect } from "react"
import { X, Activity, Ruler, Weight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface HealthDetailModalProps {
  shipmentId: string
  isOpen: boolean
  onClose: () => void
}

export function HealthDetailModal({ shipmentId, isOpen, onClose }: HealthDetailModalProps) {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ["health-data", shipmentId],
    queryFn: async () => {
      const res = await api.get(`/shipments/${shipmentId}/health-data`)
      return res.data
    },
    enabled: isOpen && !!shipmentId,
  })

  if (!isOpen) return null

  const patient = healthData?.patient_id
  const measurements = patient?.measurements || []

  // Format data for chart
  const chartData = measurements.map((m: any) => ({
    date: new Date(m.date).toLocaleDateString("id-ID", { month: 'short', day: 'numeric' }),
    weight: m.weight,
    height: m.height,
    zScore: m.z_score
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Data Kesehatan Anak</h2>
              {patient && <p className="text-sm text-slate-500">{patient.name}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl">
              Gagal memuat data kesehatan.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Weight className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Berat Terakhir</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {measurements[measurements.length - 1]?.weight} <span className="text-sm font-medium">kg</span>
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Ruler className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Tinggi Terakhir</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {measurements[measurements.length - 1]?.height} <span className="text-sm font-medium">cm</span>
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Z-Score</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900">
                    {measurements[measurements.length - 1]?.z_score.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Grafik Pertumbuhan (Berat Badan)</h3>
                <ChartContainer config={{
                  weight: {
                    label: "Berat (kg)",
                    color: "hsl(var(--chart-1))",
                  },
                }} className="h-full w-full">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      tick={{ fill: '#64748B', fontSize: 12 }} 
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      tick={{ fill: '#64748B', fontSize: 12 }} 
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#0FBA81" 
                      strokeWidth={3} 
                      dot={{ fill: "#0FBA81", strokeWidth: 2, r: 4, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* History List */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Riwayat Pengukuran</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-4 py-2">Tanggal</th>
                        <th className="px-4 py-2">Berat</th>
                        <th className="px-4 py-2">Tinggi</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...measurements].reverse().map((m: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-600">
                            {new Date(m.date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-2 font-medium">{m.weight} kg</td>
                          <td className="px-4 py-2">{m.height} cm</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              m.status === 'SEVERELY_STUNTED' ? 'bg-red-100 text-red-700' :
                              m.status === 'STUNTED' ? 'bg-orange-100 text-orange-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {m.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
