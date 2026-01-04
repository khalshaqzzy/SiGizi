"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { MeasurementForm } from "@/components/patients/measurement-form"
import { ZScoreResultCard } from "@/components/patients/z-score-result-card"
import { mockPatients } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import type { HealthStatus } from "@/lib/types"

// Mock Z-Score calculation
function calculateZScore(weight: number, height: number, ageMonths: number): { zScore: number; status: HealthStatus } {
  // This is a simplified mock calculation
  // In reality, this would use WHO growth standards
  const baseZScore = (weight / height) * 100 - 12.5
  const zScore = Math.max(-5, Math.min(3, baseZScore + (Math.random() - 0.5) * 2))

  let status: HealthStatus = "HEALTHY"
  if (zScore < -3) status = "SEVERELY_STUNTED"
  else if (zScore < -2) status = "AT_RISK"
  else if (zScore < -1.5) status = "HEALTHY"

  return { zScore, status }
}

function calculateAgeInMonths(dob: string): number {
  const birthDate = new Date(dob)
  const today = new Date()
  return (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())
}

export default function MeasurePage() {
  const params = useParams()
  const patientId = params.id as string
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ zScore: number; status: HealthStatus } | null>(null)

  const patient = mockPatients.find((p) => p.id === patientId)

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Pasien tidak ditemukan</p>
      </div>
    )
  }

  const handleMeasurementSubmit = async (data: { weight: number; height: number; date: string }) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const ageMonths = calculateAgeInMonths(patient.dob)
    const calculatedResult = calculateZScore(data.weight, data.height, ageMonths)

    setResult(calculatedResult)
    setIsLoading(false)

    toast.success("Pengukuran berhasil disimpan")
  }

  const handleRequestAid = () => {
    toast.success("Permintaan bantuan gizi telah dikirim ke Hub Logistik")
    router.push("/dashboard/interventions")
  }

  return (
    <div>
      <PageHeader title="Input Pengukuran" subtitle={`Catat pengukuran baru untuk ${patient.name}`}>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </PageHeader>

      <div className="p-8 space-y-6 max-w-4xl">
        {/* Measurement Form */}
        {!result && (
          <MeasurementForm
            patientName={patient.name}
            onSubmit={handleMeasurementSubmit}
            onCancel={() => router.back()}
            isLoading={isLoading}
          />
        )}

        {/* Result Card */}
        {result && (
          <ZScoreResultCard
            zScore={result.zScore}
            status={result.status}
            onRequestAid={result.status === "SEVERELY_STUNTED" ? handleRequestAid : undefined}
          />
        )}

        {/* Actions after result */}
        {result && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setResult(null)}>
              Input Ulang
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
              Lihat Profil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
