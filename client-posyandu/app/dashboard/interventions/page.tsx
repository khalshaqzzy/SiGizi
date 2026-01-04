"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InterventionCard } from "@/components/interventions/intervention-card"
import { mockInterventions } from "@/lib/mock-data"
import { Clock, CheckCircle2, Truck, XCircle } from "lucide-react"
import { toast } from "sonner"
import type { Intervention } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null)

  const pendingInterventions = interventions.filter((i) => i.status === "PENDING")
  const onTheWayInterventions = interventions.filter((i) => i.status === "ON_THE_WAY")
  const deliveredInterventions = interventions.filter((i) => i.status === "DELIVERED")
  const cancelledInterventions = interventions.filter((i) => i.status === "CANCELLED")

  const handleConfirmDelivered = (id: string) => {
    setInterventions((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "DELIVERED" as const, delivered_at: new Date().toISOString() } : i,
      ),
    )
    toast.success("Penerimaan bantuan berhasil dikonfirmasi")
  }

  const handleCancelClick = (id: string) => {
    setSelectedInterventionId(id)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedInterventionId) {
      setInterventions((prev) =>
        prev.map((i) =>
          i.id === selectedInterventionId
            ? {
                ...i,
                status: "CANCELLED" as const,
                cancelled_at: new Date().toISOString(),
                cancelled_by: "POSYANDU" as const,
              }
            : i,
        ),
      )
      toast.success("Bantuan berhasil dibatalkan")
    }
    setCancelDialogOpen(false)
    setSelectedInterventionId(null)
  }

  return (
    <div>
      <PageHeader title="Pelacakan Bantuan" subtitle="Pantau status pengiriman bantuan gizi" />

      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingInterventions.length}</p>
                <p className="text-xs text-muted-foreground">Menunggu</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onTheWayInterventions.length}</p>
                <p className="text-xs text-muted-foreground">Dalam Perjalanan</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{deliveredInterventions.length}</p>
                <p className="text-xs text-muted-foreground">Diterima</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{cancelledInterventions.length}</p>
                <p className="text-xs text-muted-foreground">Dibatalkan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Truck className="h-4 w-4" />
              Aktif ({pendingInterventions.length + onTheWayInterventions.length})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Diterima ({deliveredInterventions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="gap-2">
              <XCircle className="h-4 w-4" />
              Dibatalkan ({cancelledInterventions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {pendingInterventions.length === 0 && onTheWayInterventions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Truck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Tidak Ada Bantuan Aktif</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                    Saat ini tidak ada permintaan bantuan yang sedang diproses.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {[...onTheWayInterventions, ...pendingInterventions].map((intervention) => (
                  <InterventionCard
                    key={intervention.id}
                    intervention={intervention}
                    onConfirmDelivered={handleConfirmDelivered}
                    onCancel={handleCancelClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {deliveredInterventions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Belum Ada Riwayat</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                    Riwayat bantuan yang sudah diterima akan muncul di sini.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {deliveredInterventions.map((intervention) => (
                  <InterventionCard key={intervention.id} intervention={intervention} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledInterventions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Tidak Ada Pembatalan</h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                    Bantuan yang dibatalkan akan muncul di sini.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {cancelledInterventions.map((intervention) => (
                  <InterventionCard key={intervention.id} intervention={intervention} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Permintaan Bantuan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan permintaan bantuan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700">
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
