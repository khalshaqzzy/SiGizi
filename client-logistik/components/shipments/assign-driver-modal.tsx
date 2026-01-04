"use client"

import { useState } from "react"
import { X, User, Package, Plus, Minus, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import type { Shipment, ShipmentItem, InventoryItem, Driver } from "@/lib/types"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { ShipmentRouteMap } from "./shipment-route-map"
import { useEffect, useMemo } from "react"

interface AssignDriverModalProps {
  shipment: any
  isOpen: boolean
  onClose: () => void
  onAssign: (data: { driverId: string; items: ShipmentItem[]; eta: string }) => void
}

export function AssignDriverModal({ shipment, isOpen, onClose, onAssign }: AssignDriverModalProps) {
  const { user } = useAuth()
  const { isLoaded } = useGoogleMaps()
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [selectedItems, setSelectedItems] = useState<ShipmentItem[]>([])
  const [eta, setEta] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const posyandu = shipment.posyandu || shipment.posyandu_id || {}
  
  const hubLoc = useMemo(() => {
    return user?.location?.coordinates 
      ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }
      : null;
  }, [user?.location?.coordinates]);

  const posyanduLoc = useMemo(() => {
    return posyandu.location?.coordinates
      ? { lat: posyandu.location.coordinates[1], lng: posyandu.location.coordinates[0] }
      : null;
  }, [posyandu.location?.coordinates]);

  console.log("[AssignDriverModal] Map Data Check:", {
    hubLoc,
    posyanduLoc
  });

  // Auto-calculate ETA from Google Maps
  useEffect(() => {
    if (isLoaded && isOpen && hubLoc && posyanduLoc && typeof google !== 'undefined') {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [hubLoc],
          destinations: [posyanduLoc],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK" && response && response.rows[0].elements[0].duration) {
            const durationMinutes = Math.ceil(response.rows[0].elements[0].duration.value / 60);
            setEta(durationMinutes.toString());
          } else {
            console.warn("Distance Matrix failed:", status);
            // Don't overwrite if user already typed something
            if (!eta) setEta("15"); 
          }
        }
      );
    }
  }, [isLoaded, isOpen, hubLoc, posyanduLoc]);

  // Fetch real drivers
  const { data: drivers = [] } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => (await api.get("/drivers")).data,
    enabled: isOpen
  })

  // Fetch real inventory
  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => (await api.get("/inventory")).data,
    enabled: isOpen
  })

  const availableDrivers = drivers.filter((d: Driver) => d.status === "AVAILABLE")

  const handleAddItem = (item: InventoryItem) => {
    const existing = selectedItems.find((i) => i.sku === item.sku)
    if (existing) {
      if (existing.qty < item.quantity) {
        setSelectedItems((prev) => prev.map((i) => (i.sku === item.sku ? { ...i, qty: i.qty + 1 } : i)))
      } else {
        toast.error("Stok tidak mencukupi")
      }
    } else {
      setSelectedItems((prev) => [...prev, { sku: item.sku, name: item.name, qty: 1 }])
    }
  }

  const handleUpdateQty = (sku: string, delta: number) => {
    const item = inventory.find((i: InventoryItem) => i.sku === sku)
    if (!item) return

    setSelectedItems(
      (prev) =>
        prev
          .map((i) => {
            if (i.sku !== sku) return i
            const newQty = i.qty + delta
            if (newQty <= 0) return null
            if (newQty > item.quantity) {
                toast.error("Stok tidak mencukupi")
                return i
            }
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

    setIsSubmitting(true)
    try {
        await onAssign({
            driverId: selectedDriver,
            items: selectedItems,
            eta: `${eta} menit`,
        })
        onClose()
    } catch (e) {
        // Error handled by mutation
    } finally {
        setIsSubmitting(false)
    }
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
            <p className="text-sm font-medium text-slate-900">{posyandu.name || "Nama Posyandu -"}</p>
            <p className="text-xs text-slate-500 mt-1">{posyandu.address || "Alamat -"}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">{posyandu.distance_km || "-"} km</span>
              <span>~{posyandu.travel_time_minutes || "-"} menit perjalanan</span>
            </div>
          </div>

          {/* Route Map */}
          {hubLoc && posyanduLoc && (
            <ShipmentRouteMap origin={hubLoc} destination={posyanduLoc} />
          )}

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
                  availableDrivers.map((driver: Driver) => (
                    <SelectItem key={driver.id || (driver as any)._id} value={driver.id || (driver as any)._id}>
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
                  const inventoryItem = inventory.find((i: InventoryItem) => i.sku === item.sku)
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
                {inventory.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">Tidak ada stok di gudang</div>
                ) : inventory.map((item: InventoryItem) => {
                  const isSelected = selectedItems.some((i) => i.sku === item.sku)
                  const isLowStock = item.quantity <= item.min_stock
                  return (
                    <button
                      key={item.id || (item as any)._id}
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
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
          >
            {isSubmitting ? (
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
