"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryModal } from "@/components/inventory/inventory-modal"
import { DeleteConfirmModal } from "@/components/inventory/delete-confirm-modal"
import { TableSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InventoryItem } from "@/lib/types"
import { toast } from "sonner"
import api from "@/lib/axios"

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await api.get("/inventory")
      return res.data
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/inventory", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      setIsModalOpen(false)
      toast.success("Inventory updated")
    },
    onError: () => toast.error("Failed to save inventory"),
  })

  const deleteMutation = useMutation({
    mutationFn: async (sku: string) => {
      return api.delete(`/inventory/${sku}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      setIsDeleteModalOpen(false)
      toast.success("Item deleted")
    },
    onError: () => toast.error("Failed to delete item"),
  })

  const filteredItems = items.filter(
    (item: InventoryItem) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSave = (data: any) => {
    saveMutation.mutate(data)
  }

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.sku)
    }
  }

  const lowStockCount = items.filter((item: InventoryItem) => item.quantity <= item.min_stock).length

  return (
    <DashboardLayout title="Inventory" description="Kelola stok barang dan material">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Cari item atau SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-white border-slate-200"
            />
          </div>
          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                {lowStockCount} item stok rendah
              </span>
            )}
            <Button
              onClick={() => { setSelectedItem(null); setIsModalOpen(true) }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <InventoryTable 
            items={filteredItems}  
            onEdit={(item) => { setSelectedItem(item); setIsModalOpen(true) }} 
            onDelete={(item) => { setSelectedItem(item); setIsDeleteModalOpen(true) }} 
          />
        )}
      </div>

      <InventoryModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        title="Hapus Item"
        description={`Hapus "${selectedItem?.name}"?`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}