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
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null)

  // Sync internal query with prop value
  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    // Inisialisasi widget menggunakan cara tradisional
    if (isLoaded && inputRef.current && typeof google !== 'undefined' && google.maps && google.maps.places) {
      try {
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
            }
          })
          console.log("[Autocomplete] Widget initialized via traditional API.");
        }
      } catch (e) {
        console.error("[Autocomplete] Initialization error:", e);
      }
    }
  }, [isLoaded, onChange])

  const handleClear = () => {
    setQuery("")
    setSelectedLocation(null)
    onChange("", 0, 0)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLoaded ? placeholder : "Memuat peta..."}
          className="h-10 pl-9 pr-9 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
        {!isLoaded && !loadError && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-spin" />
        )}
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {selectedLocation && (
        <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Lokasi dipilih</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}