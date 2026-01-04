// Types for SiGizi Logistics Client

export interface User {
  id: string
  username: string
  role: "LOGISTICS_ADMIN"
  hub_details: {
    name: string
    address: string
    location: {
      lat: number
      lng: number
    }
  }
}

export interface Driver {
  id: string
  name: string
  phone: string
  vehicle_number: string
  status: "AVAILABLE" | "ON_DELIVERY" | "OFF_DUTY"
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  unit: "Box" | "Carton" | "Bottle" | "Pack"
  min_stock: number
  created_at: string
  updated_at: string
}

export interface Posyandu {
  id: string
  health_posyandu_id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  distance_km: number
  travel_time_minutes: number
}

export interface ShipmentItem {
  sku: string
  name: string
  qty: number
}

export interface Shipment {
  id: string
  health_request_id: string
  posyandu: Posyandu
  patient_initials: string
  age_months: number
  z_score: number
  urgency: "HIGH" | "MEDIUM" | "LOW"
  status: "PENDING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED"
  items: ShipmentItem[]
  driver?: Driver
  eta?: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  active_shipments: number
  driver_availability: number
  low_stock_items: number
  pending_requests: number
  completed_today: number
}
