"use client"

import { useEffect, useRef } from "react"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { Loader2 } from "lucide-react"
import type { Posyandu } from "@/lib/types"

interface HubMapProps {
  hubLocation: { lat: number; lng: number }
  posyandus: Posyandu[]
}

export function HubMap({ hubLocation, posyandus }: HubMapProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    if (isLoaded && mapRef.current && typeof google !== 'undefined') {
      try {
        // Initialize Map if not already initialized
        if (!mapInstance.current) {
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: hubLocation,
            zoom: 12,
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          })
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []

        const bounds = new google.maps.LatLngBounds()

        // 1. Add Hub Marker (Emerald/Green)
        const hubMarker = new google.maps.Marker({
          position: hubLocation,
          map: mapInstance.current,
          title: "Logistik Hub Anda",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#10B981", // emerald-500
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
            scale: 8
          }
        })
        markersRef.current.push(hubMarker)
        bounds.extend(hubLocation)

        // 2. Add Posyandu Markers (Blue)
        posyandus.forEach((pos) => {
          const posLocation = pos.location?.coordinates 
            ? { lat: pos.location.coordinates[1], lng: pos.location.coordinates[0] }
            : (pos as any).location; // Fallback for different data structures

          if (posLocation && posLocation.lat && posLocation.lng) {
            const marker = new google.maps.Marker({
              position: posLocation,
              map: mapInstance.current,
              title: pos.name,
              icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                fillColor: "#3B82F6", // blue-500
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#FFFFFF",
                scale: 4
              }
            })
            markersRef.current.push(marker)
            bounds.extend(posLocation)
          }
        })

        // Auto-fit bounds if we have more than the hub
        if (posyandus.length > 0) {
          mapInstance.current.fitBounds(bounds)
          // Add some padding to bounds
          const listener = google.maps.event.addListener(mapInstance.current, 'idle', () => {
            if (mapInstance.current && mapInstance.current.getZoom()! > 16) mapInstance.current.setZoom(16)
            google.maps.event.removeListener(listener)
          })
        }

      } catch (e) {
        console.error("[HubMap] Error initializing map:", e)
      }
    }
  }, [isLoaded, hubLocation, posyandus])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-slate-900">Peta Jangkauan</h3>
          <p className="text-sm text-slate-500">Hub & {posyandus.length} Posyandu Binaan</p>
        </div>
      </div>

      <div className="relative h-64 bg-slate-50">
        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-50/80 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          </div>
        )}
        
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-500">
            Gagal memuat peta. Pastikan koneksi internet stabil dan API Key valid.
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white shadow-sm" />
          <span className="font-medium">Hub Anda</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-3 h-3 bg-blue-500 rounded-md border border-white shadow-sm" />
          <span className="font-medium">Posyandu</span>
        </div>
      </div>
    </div>
  )
}