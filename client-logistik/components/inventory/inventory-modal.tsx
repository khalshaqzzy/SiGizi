"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { InventoryItem } from "@/lib/types"
import { toast } from "sonner"

interface InventoryModalProps {
  item?: InventoryItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<InventoryItem, "id" | "created_at">) => void
}

export function InventoryModal({ item, isOpen, onClose, onSave }: InventoryModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    unit: "Box" as InventoryItem["unit"],
    min_stock: 0,
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unit: item.unit,
        min_stock: item.min_stock,
      })
    } else {
      setFormData({
        name: "",
        sku: "",
        quantity: 0,
        unit: "Box",
        min_stock: 0,
      })
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.sku) {
      toast.error("Lengkapi semua field")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    onSave(formData)

    toast.success(item ? "Item berhasil diupdate!" : "Item berhasil ditambahkan!")
    setIsLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">{item ? "Edit Item" : "Tambah Item Baru"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Nama Item</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="contoh: SGM Eksplor 1+ (400g)"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">SKU</Label>
            <Input
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="contoh: MILK-001"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Kuantitas</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                min="0"
                className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value as InventoryItem["unit"] })}
              >
                <SelectTrigger className="h-10 bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Box">Box</SelectItem>
                  <SelectItem value="Carton">Carton</SelectItem>
                  <SelectItem value="Bottle">Bottle</SelectItem>
                  <SelectItem value="Pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Minimum Stok</Label>
            <Input
              type="number"
              value={formData.min_stock}
              onChange={(e) => setFormData({ ...formData, min_stock: Number.parseInt(e.target.value) || 0 })}
              min="0"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-slate-400">Alert akan muncul jika stok di bawah nilai ini</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : item ? (
                "Update Item"
              ) : (
                "Tambah Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
