"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, Heart, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Data Anak", icon: Users },
  { href: "/dashboard/interventions", label: "Pelacakan Bantuan", icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (href: string) => {
    // Exact match for /dashboard
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    // For other routes, match exact or child routes
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">SiGizi</span>
            <p className="text-xs text-muted-foreground">Posyandu Client</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-card text-primary shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "text-primary")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-xl bg-card p-3">
            <p className="text-xs font-medium text-muted-foreground">Posyandu</p>
            <p className="truncate text-sm font-semibold text-foreground">
              {user?.posyandu_details.name || "Posyandu"}
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  )
}
