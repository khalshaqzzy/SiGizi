"use client"

import { useEffect, useRef, useState } from "react"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { Loader2 } from "lucide-react"

interface ShipmentRouteMapProps {
  origin: { lat: number; lng: number }
  destination: { lat: number; lng: number }
}

export function ShipmentRouteMap({ origin, destination }: ShipmentRouteMapProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [apiError, setApiError] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const directionsService = useRef<google.maps.DirectionsService | null>(null)
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    console.log("[ShipmentRouteMap] Effect Triggered", { isLoaded, hasRef: !!mapRef.current, origin, destination });
    
    if (isLoaded && mapRef.current && typeof google !== 'undefined') {
      try {
        console.log("[ShipmentRouteMap] Initializing Map & Services...");
        if (!directionsService.current) {
          directionsService.current = new google.maps.DirectionsService()
          directionsRenderer.current = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            markerOptions: {
                animation: google.maps.Animation.DROP
            }
          })
        }

        const map = new google.maps.Map(mapRef.current, {
          disableDefaultUI: true,
          zoomControl: true,
        })

        directionsRenderer.current.setMap(map)

        console.log("[ShipmentRouteMap] Requesting Route...");
        directionsService.current.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            console.log("[ShipmentRouteMap] Directions Result Received. Status:", status);
            if (status === google.maps.DirectionsStatus.OK && result) {
              setApiError(false)
              directionsRenderer.current?.setDirections(result)
            } else {
              console.error("[ShipmentRouteMap] Directions API failed:", status);
              setApiError(true)
            }
          }
        )
      } catch (e) {
        console.error("[ShipmentRouteMap] Fatal Catch Error:", e);
        setApiError(true)
      }
    }
  }, [isLoaded, origin, destination])

  return (
    <div className="relative h-48 w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-50 mb-4">
      {(!isLoaded || apiError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm z-10 p-4 text-center">
          {!isLoaded ? (
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase">Peta Rute Tidak Tersedia</p>
              <p className="text-[10px] text-slate-400 mt-1">Pastikan Directions API telah diaktifkan di Google Cloud Console.</p>
            </>
          )}
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}
