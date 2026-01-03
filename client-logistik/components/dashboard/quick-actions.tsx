"use client"

import Link from "next/link"
import { Package, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-base font-medium text-slate-900 mb-4">Aksi Cepat</h3>
      <div className="space-y-3">
        <Link href="/drivers?action=add" className="block">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 bg-transparent"
          >
            <Users className="w-4 h-4 text-emerald-500" />
            Tambah Driver
          </Button>
        </Link>
        <Link href="/inventory?action=add" className="block">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 bg-transparent"
          >
            <Package className="w-4 h-4 text-emerald-500" />
            Tambah Stok
          </Button>
        </Link>
        <Link href="/shipments?filter=pending" className="block">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 bg-transparent"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Lihat Pending
          </Button>
        </Link>
      </div>
    </div>
  )
}
