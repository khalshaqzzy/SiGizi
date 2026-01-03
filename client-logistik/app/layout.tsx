import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SiGizi Logistics - Dashboard",
  description: "Integrated Stunting Detection & Logistics Distribution System",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0FBA81",
  width: "device-width",
  initialScale: 1,
}

import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Server-side logging for environment verification
  console.log("=== SiGizi Frontend Startup ===");
  console.log("Google Maps Key Configured:", !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    console.log("Key Prefix:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10) + "...");
  }
  console.log("===============================");

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
