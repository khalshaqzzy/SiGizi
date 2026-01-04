"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HealthBadge } from "@/components/ui/health-badge"
import { Activity } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { calculateAgeInMonths } from "@/lib/utils"

export function RecentMeasurementsTable() {
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => (await api.get("/patients")).data,
  })

  // Extract all measurements and sort
  const recentMeasurements = patients
    .flatMap((p: any) => {
        if (!p.measurements) return []
        return p.measurements.map((m: any) => ({
            ...m,
            patientName: p.name,
            patientId: p._id,
            dob: p.dob
        }))
    })
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5 text-primary" />
          Pengukuran Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Anak</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Umur</TableHead>
              <TableHead className="text-right">BB (kg)</TableHead>
              <TableHead className="text-right">TB (cm)</TableHead>
              <TableHead className="text-right">Z-Score</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMeasurements.map((m: any, idx: number) => {
              const ageMonths = calculateAgeInMonths(m.dob)
              return (
                <TableRow key={`${m.patientId}-${idx}`}>
                  <TableCell className="font-medium">{m.patientName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(m.date), "d MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{ageMonths} bln</TableCell>
                  <TableCell className="text-right font-mono">{m.weight.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono">{m.height.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    <span
                      className={
                        m.z_score < -3 ? "text-red-600" : m.z_score < -2 ? "text-amber-600" : "text-emerald-600"
                      }
                    >
                      {m.z_score.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <HealthBadge status={m.status} showIcon />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}