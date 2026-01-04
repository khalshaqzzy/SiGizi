"use client"

import { cn } from "@/lib/utils"

type FilterTab = "all" | "pending" | "on_the_way" | "delivered" | "cancelled"

interface ShipmentFiltersProps {
  activeFilter: FilterTab
  onFilterChange: (filter: FilterTab) => void
  counts: Record<FilterTab, number>
}

export function ShipmentFilters({ activeFilter, onFilterChange, counts }: ShipmentFiltersProps) {
  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "pending", label: "Menunggu" },
    { id: "on_the_way", label: "Dalam Perjalanan" },
    { id: "delivered", label: "Selesai" },
    { id: "cancelled", label: "Batal" },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-all",
            activeFilter === tab.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
          )}
        >
          {tab.label}
          <span
            className={cn(
              "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
              activeFilter === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500",
            )}
          >
            {counts[tab.id]}
          </span>
        </button>
      ))}
    </div>
  )
}
