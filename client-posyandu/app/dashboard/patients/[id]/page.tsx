"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AzureButton } from "@/components/ui/azure-button"
import { HealthBadge } from "@/components/ui/health-badge"
import { ZScoreGauge } from "@/components/patients/z-score-gauge"
import { GrowthHistoryChart } from "@/components/patients/growth-history-chart"
import { mockPatients, mockMeasurementHistory, calculateAgeInMonths } from "@/lib/mock-data"
import { ArrowLeft, Ruler, User, Calendar, MapPin, Phone } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = params.id as string
  const router = useRouter()

  const patient = mockPatients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Pasien tidak ditemukan</p>
      </div>
    )
  }

  const ageMonths = calculateAgeInMonths(patient.dob)
  const latestMeasurement = patient.latest_measurement

  return (
    <div>
      <PageHeader title={patient.name} subtitle={`Detail profil dan riwayat pengukuran`}>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <AzureButton asChild>
            <Link href={`/dashboard/patients/${patient.id}/measure`}>
              <Ruler className="mr-2 h-4 w-4" />
              Input Pengukuran
            </Link>
          </AzureButton>
        </div>
      </PageHeader>

      <div className="p-8 space-y-6">
        {/* Patient Info Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Profil Anak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">{patient.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {patient.gender === "male" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Tanggal Lahir</p>
                    <p className="font-medium">{format(new Date(patient.dob), "d MMMM yyyy", { locale: id })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Umur</p>
                    <p className="font-medium">{ageMonths} bulan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Orang Tua/Wali</p>
                    <p className="font-medium">{patient.parent_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Alamat</p>
                    <p className="font-medium">{patient.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Measurement */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-primary" />
                  Pengukuran Terakhir
                </span>
                {latestMeasurement && <HealthBadge status={latestMeasurement.status} showIcon />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestMeasurement ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Berat Badan</p>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        {latestMeasurement.weight.toFixed(1)} <span className="text-base font-normal">kg</span>
                      </p>
                    </div>
                    <div className="rounded-xl border bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Tinggi Badan</p>
                      <p className="text-2xl font-bold font-mono text-foreground">
                        {latestMeasurement.height.toFixed(1)} <span className="text-base font-normal">cm</span>
                      </p>
                    </div>
                    <div className="rounded-xl border bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">Tanggal Ukur</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(latestMeasurement.date), "d MMM yyyy", { locale: id })}
                      </p>
                    </div>
                  </div>
                  <ZScoreGauge score={latestMeasurement.z_score} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Belum ada data pengukuran</p>
                  <AzureButton className="mt-4" asChild>
                    <Link href={`/dashboard/patients/${patient.id}/measure`}>
                      <Ruler className="mr-2 h-4 w-4" />
                      Input Pengukuran Pertama
                    </Link>
                  </AzureButton>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Growth Charts */}
        {latestMeasurement && (
          <div className="grid gap-6 lg:grid-cols-2">
            <GrowthHistoryChart data={mockMeasurementHistory} metric="weight" />
            <GrowthHistoryChart data={mockMeasurementHistory} metric="height" />
          </div>
        )}

        {/* Z-Score History */}
        {latestMeasurement && <GrowthHistoryChart data={mockMeasurementHistory} metric="z_score" />}
      </div>
    </div>
  )
}
