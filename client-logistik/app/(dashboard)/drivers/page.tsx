"use client"

import { useState } from "react"
import { Plus, Search, Users } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DriverCard } from "@/components/drivers/driver-card"
import { DriverModal } from "@/components/drivers/driver-modal"
import { DriverStats } from "@/components/drivers/driver-stats"
import { DeleteConfirmModal } from "@/components/inventory/delete-confirm-modal"
import { CardGridSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Driver } from "@/lib/types"
import { toast } from "sonner"
import api from "@/lib/axios"

export default function DriversPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const res = await api.get("/drivers")
      return res.data.map((d: any) => ({ ...d, id: d._id }))
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post("/drivers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setIsModalOpen(false)
      toast.success("Driver created")
    }
  })

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/drivers/${id}/status`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      toast.success("Status updated")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/drivers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] })
      setIsDeleteModalOpen(false)
      toast.success("Driver deleted")
    }
  })

  const filteredDrivers = drivers.filter(
    (driver: Driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout title="Drivers" description="Kelola driver dan armada">
      <div className="space-y-6">
        <DriverStats drivers={drivers} />

        <div className="flex justify-between gap-4">
          <Input
            placeholder="Cari driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm bg-white"
          />
          <Button onClick={() => { setSelectedDriver(null); setIsModalOpen(true) }} className="bg-emerald-500 text-white">
            <Plus className="w-4 h-4 mr-2" /> Tambah Driver
          </Button>
        </div>

        {isLoading ? (
          <CardGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map((driver: Driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onEdit={(d) => { setSelectedDriver(d); setIsModalOpen(true) }} // Edit not fully implemented in backend yet, reusing add for now or just view
                onDelete={(d) => { setSelectedDriver(d); setIsDeleteModalOpen(true) }}
                onStatusChange={(d, status) => statusMutation.mutate({ id: d.id, status })}
              />
            ))}
          </div>
        )}
      </div>

      <DriverModal
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => createMutation.mutate(data)}
      />

      <DeleteConfirmModal
        title="Hapus Driver"
        description={`Hapus "${selectedDriver?.name}"?`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => selectedDriver && deleteMutation.mutate(selectedDriver.id)}
      />
    </DashboardLayout>
  )
}