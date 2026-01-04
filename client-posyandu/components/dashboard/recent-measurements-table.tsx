"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HealthBadge } from "@/components/ui/health-badge"
import { Activity } from "lucide-react"
import { mockPatients } from "@/lib/mock-data"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function RecentMeasurementsTable() {
  // Get last 5 measurements
  const recentMeasurements = mockPatients
    .filter((p) => p.latest_measurement)
    .sort((a, b) => {
      const dateA = new Date(a.latest_measurement?.date || 0)
      const dateB = new Date(b.latest_measurement?.date || 0)
      return dateB.getTime() - dateA.getTime()
    })
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
            {recentMeasurements.map((patient) => {
              const m = patient.latest_measurement!
              return (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(m.date), "d MMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{m.age_months} bln</TableCell>
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
