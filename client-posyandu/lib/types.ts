// Health Status Types
export type HealthStatus = "HEALTHY" | "AT_RISK" | "STUNTED" | "SEVERELY_STUNTED"

// Patient Types
export interface Patient {
  id: string
  posyandu_id: string
  name: string
  dob: string
  gender: "male" | "female"
  parent_name: string
  address: string
  created_at: string
  latest_measurement?: Measurement
}

export interface Measurement {
  id: string
  patient_id: string
  date: string
  weight: number
  height: number
  z_score: number
  status: HealthStatus
  age_months: number // added age in months
}

export interface MeasurementHistory {
  date: string
  weight: number
  height: number
  z_score: number
  age_months: number
}

// Posyandu Types
export interface Posyandu {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  assigned_hub?: LogisticsHub
}

export interface LogisticsHub {
  id: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  distance_km: number
  travel_time_minutes: number
}

// Intervention Types
export type InterventionStatus = "PENDING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED"

export interface Intervention {
  id: string
  patient_id: string
  patient_name: string
  patient_initials: string
  age_months: number
  z_score: number
  status: InterventionStatus
  urgency: "HIGH" | "MEDIUM" | "LOW"
  created_at: string
  items?: InterventionItem[]
  driver?: {
    name: string
    phone: string
  }
  eta?: string
  delivered_at?: string
  cancelled_at?: string
  cancelled_by?: "POSYANDU" | "LOGISTIK"
}

export interface InterventionItem {
  sku: string
  name: string
  qty: number
  unit: string
}

// Dashboard Stats
export interface DashboardStats {
  total_children: number
  active_interventions: number
  red_zone_count: number
  healthy_count: number
  at_risk_count: number
}

// Auth Types
export interface User {
  id: string
  username: string
  role: "POSYANDU_ADMIN"
  posyandu_details: {
    name: string
    address: string
    location: {
      lat: number
      lng: number
    }
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
