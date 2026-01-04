"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { MeasurementForm } from "@/components/patients/measurement-form"
import { ZScoreResultCard } from "@/components/patients/z-score-result-card"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useQuery, useMutation } from "@tanstack/react-query"

export default function MeasurePage() {
  const params = useParams()
  const patientId = params.id as string
  const router = useRouter()
  
  // Fetch patient details for name context
  const { data: patient, isLoading: isPatientLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => (await api.get(`/patients/${patientId}`)).data,
  })

  const [result, setResult] = useState<{ zScore: number; status: any } | null>(null)

  const measureMutation = useMutation({
    mutationFn: async (data: { weight: number; height: number; date: string }) => {
      const res = await api.post(`/patients/${patientId}/measurements`, data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success("Pengukuran berhasil disimpan")
      // Update result state to show the card
      setResult({
        zScore: data.measurement.z_score,
        status: data.measurement.status
      })
    },
    onError: () => toast.error("Gagal menyimpan pengukuran")
  })

  const requestAidMutation = useMutation({
    mutationFn: async () => {
      await api.post("/interventions", {
        patientId,
        urgency: "HIGH"
      })
    },
    onSuccess: (data: any) => {
      toast.success("Permintaan bantuan gizi telah dikirim ke Hub Logistik")
      router.push("/dashboard/interventions")
    },
    onError: () => toast.error("Gagal mengirim permintaan bantuan")
  })

  if (isPatientLoading) return <div className="p-8 text-center">Memuat data pasien...</div>
  if (!patient) return <div className="p-8 text-center">Pasien tidak ditemukan</div>

  const handleMeasurementSubmit = (data: { weight: number; height: number; date: string }) => {
    measureMutation.mutate(data)
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
            isLoading={measureMutation.isPending}
          />
        )}

        {/* Result Card */}
        {result && (
          <ZScoreResultCard
            zScore={result.zScore}
            status={result.status}
            onRequestAid={result.status === "SEVERELY_STUNTED" ? () => requestAidMutation.mutate() : undefined}
          />
        )}

        {/* Actions after result */}
        {result && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setResult(null)}>
              Input Ulang
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${patientId}`)}>
              Lihat Profil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}