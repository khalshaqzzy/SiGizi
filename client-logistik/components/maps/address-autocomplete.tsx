"use client"
import { useState, useRef, useEffect } from "react"
import { MapPin, Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGoogleMaps } from "@/hooks/use-google-maps"

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string, lat: number, lng: number) => void
  placeholder?: string
  className?: string
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Cari alamat...",
  className,
}: AddressAutocompleteProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [query, setQuery] = useState(value)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerInstance = useRef<google.maps.Marker | null>(null)

  // Sync internal query with prop value
  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    // Inisialisasi widget dan peta menggunakan cara tradisional
    if (isLoaded && inputRef.current && typeof google !== 'undefined' && google.maps && google.maps.places) {
      try {
        // 1. Initialize Autocomplete
        if (!autocompleteInstance.current) {
          autocompleteInstance.current = new google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: "id" },
            fields: ["geometry", "formatted_address"],
            types: ["address"],
          })

          autocompleteInstance.current.addListener("place_changed", () => {
            const place = autocompleteInstance.current?.getPlace()
            
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat()
              const lng = place.geometry.location.lng()
              const address = place.formatted_address || ""
              
              setQuery(address)
              setSelectedLocation({ lat, lng })
              onChange(address, lat, lng)

              // Update Map and Marker
              if (mapInstance.current && markerInstance.current) {
                mapInstance.current.setCenter(place.geometry.location)
                mapInstance.current.setZoom(17)
                markerInstance.current.setPosition(place.geometry.location)
                markerInstance.current.setVisible(true)
              }
            }
          })
          console.log("[Autocomplete] Widget initialized.");
        }

        // 2. Initialize Map if ref exists
        if (mapRef.current && !mapInstance.current) {
          const defaultLocation = { lat: -6.2088, lng: 106.8456 } // Jakarta
          
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 12,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'cooperative',
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          })

          markerInstance.current = new google.maps.Marker({
            position: defaultLocation,
            map: mapInstance.current,
            visible: false,
            animation: google.maps.Animation.DROP
          })
          
          console.log("[Map] Interactive map initialized.");
        }
      } catch (e) {
        console.error("[Autocomplete/Map] Initialization error:", e);
      }
    }
  }, [isLoaded, onChange])

  const handleClear = () => {
    setQuery("")
    setSelectedLocation(null)
    onChange("", 0, 0)
    if (markerInstance.current) markerInstance.current.setVisible(false)
    if (mapInstance.current) mapInstance.current.setZoom(12)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative space-y-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLoaded ? placeholder : "Memuat peta..."}
          className="h-10 pl-9 pr-9 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
        />
        {!isLoaded && !loadError && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />
        )}
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Map Preview Area */}
      <div 
        className={cn(
          "w-full h-48 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 transition-all duration-500",
          selectedLocation ? "opacity-100 shadow-sm" : "opacity-60"
        )}
      >
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {selectedLocation && (
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="font-medium">Pin lokasi terpasang</span>
          </div>
          <p className="text-[10px] font-mono text-emerald-600 bg-white/50 px-2 py-0.5 rounded border border-emerald-100">
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}