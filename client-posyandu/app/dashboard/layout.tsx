import type React from "react"
import { AuthProvider } from "@/components/auth/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}
