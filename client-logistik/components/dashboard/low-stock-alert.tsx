"use client"

import { AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { InventoryItem } from "@/lib/types"

interface LowStockAlertProps {
  items: InventoryItem[]
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  const lowStockItems = items.filter((item) => item.quantity <= item.min_stock)

  if (lowStockItems.length === 0) return null

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-800">Stok Menipis</h4>
          <p className="text-sm text-amber-700 mt-1">{lowStockItems.length} item membutuhkan restok segera</p>
          <div className="mt-2 space-y-1">
            {lowStockItems.slice(0, 3).map((item: any) => (
              <div key={item.sku || item._id || item.id} className="flex items-center justify-between text-xs">
                <span className="text-amber-800">{item.name}</span>
                <span className="font-medium text-amber-900">
                  {item.quantity} / {item.min_stock} {item.unit}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/inventory?filter=low"
            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-amber-700 hover:text-amber-800"
          >
            Lihat semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
