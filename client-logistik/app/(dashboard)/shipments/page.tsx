"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ShipmentFilters } from "@/components/shipments/shipment-filters"
import { ShipmentCard } from "@/components/shipments/shipment-card"
import { AssignDriverModal } from "@/components/shipments/assign-driver-modal"
import { CardGridSkeleton } from "@/components/skeletons"
import type { Shipment } from "@/lib/types"
import { Package } from "lucide-react"
import api from "@/lib/axios"
import { toast } from "sonner"

import { HealthDetailModal } from "@/components/shipments/health-detail-modal"

type FilterTab = "all" | "pending" | "on_the_way" | "delivered" | "cancelled"

export default function ShipmentsPage() {
  const queryClient = useQueryClient()
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewHealthRequestId, setViewHealthRequestId] = useState<string | null>(null)

  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const res = await api.get("/shipments")
      return res.data
    },
  })

  const assignMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return api.put(`/shipments/${id}/assign`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] })
      setIsModalOpen(false)
      toast.success("Driver assigned")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Assignment failed")
    }
  })

  const counts = useMemo(() => {
    return {
      all: shipments.length,
      pending: shipments.filter((s: Shipment) => s.status === "PENDING").length,
      on_the_way: shipments.filter((s: Shipment) => s.status === "ON_THE_WAY").length,
      delivered: shipments.filter((s: Shipment) => s.status === "DELIVERED").length,
      cancelled: shipments.filter((s: Shipment) => s.status === "CANCELLED").length,
    }
  }, [shipments])

  const filteredShipments = useMemo(() => {
    if (activeFilter === "all") return shipments
    if (activeFilter === "pending") return shipments.filter((s: Shipment) => s.status === "PENDING")
    if (activeFilter === "on_the_way") return shipments.filter((s: Shipment) => s.status === "ON_THE_WAY")
    if (activeFilter === "delivered") return shipments.filter((s: Shipment) => s.status === "DELIVERED")
    if (activeFilter === "cancelled") return shipments.filter((s: Shipment) => s.status === "CANCELLED")
    return shipments
  }, [shipments, activeFilter])

  const handleAssign = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setIsModalOpen(true)
  }

  const handleAssignComplete = (data: { driverId: string; items: any[]; eta: string }) => {
    if (selectedShipment) {
      assignMutation.mutate({
        id: selectedShipment.id || (selectedShipment as any)._id,
        data: {
          driver_id: data.driverId,
          items: data.items,
          eta: data.eta
        }
      })
    }
  }

  return (
    <DashboardLayout title="Pengiriman" description="Kelola permintaan pengiriman">
      <div className="space-y-6">
        <ShipmentFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

        {isLoading ? <CardGridSkeleton /> : filteredShipments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-900 font-medium">Tidak ada pengiriman</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShipments.map((shipment: Shipment) => (
              <ShipmentCard 
                key={shipment.id || (shipment as any)._id} 
                shipment={shipment} 
                onAssign={handleAssign} 
                onViewDetails={(s) => setViewHealthRequestId(s.health_request_id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedShipment && (
        <AssignDriverModal
          shipment={selectedShipment}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedShipment(null) }}
          onAssign={handleAssignComplete}
        />
      )}

      {viewHealthRequestId && (
        <HealthDetailModal 
          healthRequestId={viewHealthRequestId}
          isOpen={!!viewHealthRequestId}
          onClose={() => setViewHealthRequestId(null)}
        />
      )}
    </DashboardLayout>
  )
}