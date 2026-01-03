import type React from "react"
import { Package } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side: Visual/Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background patterns */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white mb-12">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">SiGizi</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight max-w-md">
            Distribusi Bantuan Gizi <span className="text-emerald-400">Tepat Sasaran</span>.
          </h2>
          <p className="text-slate-400 mt-6 text-lg max-w-sm leading-relaxed">
            Menghubungkan posyandu dan gudang logistik untuk mempercepat intervensi stunting di Indonesia.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-8 items-center">
            <div>
              <p className="text-white font-bold text-2xl">100+</p>
              <p className="text-slate-500 text-sm">Hub Terintegrasi</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <p className="text-white font-bold text-2xl">24/7</p>
              <p className="text-slate-500 text-sm">Monitoring Real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form Content */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
          {children}
        </div>
        
        {/* Mobile Footer */}
        <div className="md:hidden p-6 text-center border-t border-slate-200">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">SiGizi Logistics</p>
        </div>
      </div>
    </div>
  )
}