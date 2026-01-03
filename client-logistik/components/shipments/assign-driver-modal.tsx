"use client"

import { useState } from "react"
import { X, User, Package, Plus, Minus, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockDrivers, mockInventory } from "@/lib/mock-data"
import type { Shipment, ShipmentItem, InventoryItem } from "@/lib/types"
import { toast } from "sonner"

interface AssignDriverModalProps {
  shipment: Shipment
  isOpen: boolean
  onClose: () => void
  onAssign: (data: { driverId: string; items: ShipmentItem[]; eta: string }) => void
}

export function AssignDriverModal({ shipment, isOpen, onClose, onAssign }: AssignDriverModalProps) {
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [selectedItems, setSelectedItems] = useState<ShipmentItem[]>([])
  const [eta, setEta] = useState<string>("15")
  const [isLoading, setIsLoading] = useState(false)

  const availableDrivers = mockDrivers.filter((d) => d.status === "AVAILABLE")

  const handleAddItem = (item: InventoryItem) => {
    const existing = selectedItems.find((i) => i.sku === item.sku)
    if (existing) {
      if (existing.qty < item.quantity) {
        setSelectedItems((prev) => prev.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + 1 } : i)))
      }
    } else {
      setSelectedItems((prev) => [...prev, { sku: item.sku, name: item.name, qty: 1 }])
    }
  }

  const handleUpdateQty = (sku: string, delta: number) => {
    const item = mockInventory.find((i) => i.sku === sku)
    if (!item) return

    setSelectedItems(
      (prev) =>
        prev
          .map((i) => {
            if (i.sku !== sku) return i
            const newQty = i.qty + delta
            if (newQty <= 0) return null
            if (newQty > item.quantity) return i
            return { ...i, qty: newQty }
          })
          .filter(Boolean) as ShipmentItem[],
    )
  }

  const handleRemoveItem = (sku: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.sku !== sku))
  }

  const handleSubmit = async () => {
    if (!selectedDriver) {
      toast.error("Pilih driver terlebih dahulu")
      return
    }
    if (selectedItems.length === 0) {
      toast.error("Tambahkan minimal 1 item")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onAssign({
      driverId: selectedDriver,
      items: selectedItems,
      eta: `${eta} menit`,
    })

    toast.success("Driver berhasil ditugaskan!", {
      description: `Pengiriman ke ${shipment.posyandu.name}`,
    })

    setIsLoading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-900">Tugaskan Driver & Stok</h2>
            <p className="text-sm text-slate-500">#{shipment.health_request_id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Destination Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tujuan Pengiriman</p>
            <p className="text-sm font-medium text-slate-900">{shipment.posyandu.name}</p>
            <p className="text-xs text-slate-500 mt-1">{shipment.posyandu.address}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">{shipment.posyandu.distance_km} km</span>
              <span>~{shipment.posyandu.travel_time_minutes} menit perjalanan</span>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              <User className="w-4 h-4 inline mr-1" />
              Pilih Driver
            </Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="h-10 bg-white border-slate-200">
                <SelectValue placeholder="Pilih driver tersedia" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">Tidak ada driver tersedia</div>
                ) : (
                  availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{driver.name}</span>
                        <span className="text-slate-400">-</span>
                        <span className="text-slate-500">{driver.vehicle_number}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Allocation */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              <Package className="w-4 h-4 inline mr-1" />
              Alokasi Stok
            </Label>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2 mb-3">
                {selectedItems.map((item) => {
                  const inventoryItem = mockInventory.find((i) => i.sku === item.sku)
                  return (
                    <div
                      key={item.sku}
                      className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          Stok tersedia: {inventoryItem?.quantity || 0} {inventoryItem?.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.sku, -1)}
                          className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.sku, 1)}
                          className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.sku)}
                          className="ml-2 text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Available Items */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pilih Item</p>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                {mockInventory.map((item) => {
                  const isSelected = selectedItems.some((i) => i.sku === item.sku)
                  const isLowStock = item.quantity <= item.min_stock
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => !isSelected && handleAddItem(item)}
                      disabled={isSelected || item.quantity === 0}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isLowStock ? "text-amber-600" : "text-slate-500"}`}>
                          {item.quantity} {item.unit}
                        </span>
                        {!isSelected && item.quantity > 0 && <Plus className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              <Clock className="w-4 h-4 inline mr-1" />
              Estimasi Waktu Tiba (menit)
            </Label>
            <Input
              type="number"
              value={eta}
              onChange={(e) => setEta(e.target.value)}
              min="1"
              className="h-10 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-transparent"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              "Tugaskan & Kirim"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
