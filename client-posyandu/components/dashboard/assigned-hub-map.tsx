"use client"

import { useEffect, useRef } from "react"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { Loader2 } from "lucide-react"

interface AssignedHubMapProps {
  posyanduLocation: { lat: number; lng: number }
  hubLocation: { lat: number; lng: number }
  hubName: string
}

export function AssignedHubMap({ posyanduLocation, hubLocation, hubName }: AssignedHubMapProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (isLoaded && mapRef.current && typeof google !== 'undefined') {
      try {
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(posyanduLocation)
        bounds.extend(hubLocation)

        if (!mapInstance.current) {
          mapInstance.current = new google.maps.Map(mapRef.current, {
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

        mapInstance.current.fitBounds(bounds)

        // 1. Posyandu Marker (Blue)
        new google.maps.Marker({
          position: posyanduLocation,
          map: mapInstance.current,
          title: "Posyandu Anda",
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            fillColor: "#2563EB", // primary blue
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
            scale: 6
          }
        })

        // 2. Hub Marker (Emerald)
        new google.maps.Marker({
          position: hubLocation,
          map: mapInstance.current,
          title: hubName,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#10B981", // emerald
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
            scale: 8
          }
        })

        // 3. Draw connection line
        new google.maps.Polyline({
          path: [posyanduLocation, hubLocation],
          geodesic: true,
          strokeColor: "#64748B",
          strokeOpacity: 0.6,
          strokeWeight: 2,
          map: mapInstance.current,
          icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            offset: '50%'
          }]
        })

      } catch (e) {
        console.error("[AssignedHubMap] Error:", e)
      }
    }
  }, [isLoaded, posyanduLocation, hubLocation, hubName])

  return (
    <div className="relative h-64 w-full rounded-xl border border-border overflow-hidden bg-slate-50">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}
