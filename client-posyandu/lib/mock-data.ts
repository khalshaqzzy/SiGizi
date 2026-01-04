import type { Patient, Measurement, Intervention, DashboardStats, Posyandu } from "./types"

// Mock Posyandu Data
export const mockPosyandu: Posyandu = {
  id: "pos_001",
  name: "Posyandu Mawar 01",
  address: "Jl. Kebon Jeruk No 1, Jakarta Barat",
  location: {
    lat: -6.2,
    lng: 106.816,
  },
  assigned_hub: {
    id: "hub_001",
    name: "Hub Logistik Jakarta Barat",
    address: "Jl. Raya Kebayoran No 45",
    location: {
      lat: -6.215,
      lng: 106.785,
    },
    distance_km: 4.2,
    travel_time_minutes: 15,
  },
}

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: "pat_001",
    posyandu_id: "pos_001",
    name: "Ahmad Rasyid",
    dob: "2023-03-15",
    gender: "male",
    parent_name: "Siti Aminah",
    address: "Jl. Mangga No 5",
    created_at: "2024-01-10",
    latest_measurement: {
      id: "meas_001",
      patient_id: "pat_001",
      date: "2025-01-02",
      weight: 8.2,
      height: 72.5,
      z_score: -3.45,
      status: "SEVERELY_STUNTED",
      age_months: 22, // added age_months
    },
  },
  {
    id: "pat_002",
    posyandu_id: "pos_001",
    name: "Bunga Citra",
    dob: "2023-06-20",
    gender: "female",
    parent_name: "Dewi Lestari",
    address: "Jl. Melati No 12",
    created_at: "2024-02-15",
    latest_measurement: {
      id: "meas_002",
      patient_id: "pat_002",
      date: "2025-01-02",
      weight: 9.1,
      height: 75.0,
      z_score: -2.1,
      status: "AT_RISK",
      age_months: 19, // added age_months
    },
  },
  {
    id: "pat_003",
    posyandu_id: "pos_001",
    name: "Cahya Putra",
    dob: "2024-01-10",
    gender: "male",
    parent_name: "Rina Wati",
    address: "Jl. Anggrek No 8",
    created_at: "2024-03-20",
    latest_measurement: {
      id: "meas_003",
      patient_id: "pat_003",
      date: "2025-01-03",
      weight: 7.8,
      height: 68.0,
      z_score: -0.5,
      status: "HEALTHY",
      age_months: 12, // added age_months
    },
  },
  {
    id: "pat_004",
    posyandu_id: "pos_001",
    name: "Dinda Ayu",
    dob: "2023-09-05",
    gender: "female",
    parent_name: "Sri Mulyani",
    address: "Jl. Dahlia No 3",
    created_at: "2024-04-12",
    latest_measurement: {
      id: "meas_004",
      patient_id: "pat_004",
      date: "2025-01-01",
      weight: 8.9,
      height: 74.2,
      z_score: -1.8,
      status: "HEALTHY",
      age_months: 16, // added age_months
    },
  },
  {
    id: "pat_005",
    posyandu_id: "pos_001",
    name: "Eka Saputra",
    dob: "2022-12-25",
    gender: "male",
    parent_name: "Yuni Kartika",
    address: "Jl. Mawar No 7",
    created_at: "2024-05-08",
    latest_measurement: {
      id: "meas_005",
      patient_id: "pat_005",
      date: "2024-12-28",
      weight: 10.5,
      height: 82.0,
      z_score: -2.8,
      status: "STUNTED",
      age_months: 24, // added age_months
    },
  },
]

// Mock Measurement History for patient pat_001
export const mockMeasurementHistory: Measurement[] = [
  {
    id: "meas_h1",
    patient_id: "pat_001",
    date: "2024-06-15",
    weight: 5.8,
    height: 58.0,
    z_score: -1.2,
    status: "HEALTHY",
    age_months: 15, // added age_months
  },
  {
    id: "meas_h2",
    patient_id: "pat_001",
    date: "2024-07-15",
    weight: 6.1,
    height: 60.5,
    z_score: -1.5,
    status: "HEALTHY",
    age_months: 16, // added age_months
  },
  {
    id: "meas_h3",
    patient_id: "pat_001",
    date: "2024-08-15",
    weight: 6.4,
    height: 62.0,
    z_score: -1.8,
    status: "HEALTHY",
    age_months: 17, // added age_months
  },
  {
    id: "meas_h4",
    patient_id: "pat_001",
    date: "2024-09-15",
    weight: 6.6,
    height: 64.0,
    z_score: -2.2,
    status: "AT_RISK",
    age_months: 18, // added age_months
  },
  {
    id: "meas_h5",
    patient_id: "pat_001",
    date: "2024-10-15",
    weight: 7.0,
    height: 66.5,
    z_score: -2.6,
    status: "AT_RISK",
    age_months: 19, // added age_months
  },
  {
    id: "meas_h6",
    patient_id: "pat_001",
    date: "2024-11-15",
    weight: 7.5,
    height: 69.0,
    z_score: -3.0,
    status: "STUNTED",
    age_months: 20, // added age_months
  },
  {
    id: "meas_h7",
    patient_id: "pat_001",
    date: "2024-12-15",
    weight: 7.9,
    height: 71.0,
    z_score: -3.2,
    status: "SEVERELY_STUNTED",
    age_months: 21, // added age_months
  },
  {
    id: "meas_001",
    patient_id: "pat_001",
    date: "2025-01-02",
    weight: 8.2,
    height: 72.5,
    z_score: -3.45,
    status: "SEVERELY_STUNTED",
    age_months: 22, // added age_months
  },
]

// Mock Interventions
export const mockInterventions: Intervention[] = [
  {
    id: "int_001",
    patient_id: "pat_001",
    patient_name: "Ahmad Rasyid",
    patient_initials: "A.R",
    age_months: 22,
    z_score: -3.45,
    status: "ON_THE_WAY",
    urgency: "HIGH",
    created_at: "2025-01-02T10:30:00Z",
    items: [
      { sku: "MILK-01", name: "Susu SGM 400g", qty: 3, unit: "Kotak" },
      { sku: "VIT-01", name: "Vitamin A", qty: 2, unit: "Botol" },
      { sku: "BISKUIT-01", name: "Biskuit PMT", qty: 5, unit: "Pack" },
    ],
    driver: {
      name: "Budi Santoso",
      phone: "081234567890",
    },
    eta: "14:30",
  },
  {
    id: "int_002",
    patient_id: "pat_005",
    patient_name: "Eka Saputra",
    patient_initials: "E.S",
    age_months: 24,
    z_score: -2.8,
    status: "DELIVERED",
    urgency: "HIGH",
    created_at: "2024-12-28T09:00:00Z",
    items: [
      { sku: "MILK-01", name: "Susu SGM 400g", qty: 2, unit: "Kotak" },
      { sku: "TELUR-01", name: "Telur Ayam", qty: 1, unit: "Tray" },
    ],
    driver: {
      name: "Andi Wijaya",
      phone: "081298765432",
    },
    delivered_at: "2024-12-28T14:30:00Z",
  },
  {
    id: "int_003",
    patient_id: "pat_002",
    patient_name: "Bunga Citra",
    patient_initials: "B.C",
    age_months: 18,
    z_score: -2.1,
    status: "PENDING",
    urgency: "MEDIUM",
    created_at: "2025-01-03T08:00:00Z",
  },
  {
    id: "int_004",
    patient_id: "pat_003",
    patient_name: "Cahya Putra",
    patient_initials: "C.P",
    age_months: 12,
    z_score: -2.5,
    status: "CANCELLED",
    urgency: "MEDIUM",
    created_at: "2024-12-20T08:00:00Z",
    cancelled_at: "2024-12-21T10:00:00Z",
    cancelled_by: "POSYANDU",
  },
]

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  total_children: 5,
  active_interventions: 2,
  red_zone_count: 1,
  healthy_count: 2,
  at_risk_count: 2,
}

// Calculate age in months from DOB
export function calculateAgeInMonths(dob: string): number {
  const birthDate = new Date(dob)
  const today = new Date()
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())
  return months
}

// Get status color classes
export function getStatusColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case "HEALTHY":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
    case "AT_RISK":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "STUNTED":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" }
    case "SEVERELY_STUNTED":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" }
  }
}

// Get status label in Indonesian
export function getStatusLabel(status: string): string {
  switch (status) {
    case "HEALTHY":
      return "Normal"
    case "AT_RISK":
      return "Berisiko"
    case "STUNTED":
      return "Stunting"
    case "SEVERELY_STUNTED":
      return "Stunting Berat"
    default:
      return status
  }
}

// Get intervention status label
export function getInterventionStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "Menunggu Pengiriman"
    case "ON_THE_WAY":
      return "Dalam Perjalanan"
    case "DELIVERED":
      return "Diterima"
    case "CANCELLED":
      return "Dibatalkan"
    default:
      return status
  }
}
