"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AzureButton } from "@/components/ui/azure-button"
import { HealthBadge } from "@/components/ui/health-badge"
import { PatientForm, type PatientFormData } from "@/components/patients/patient-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockPatients, calculateAgeInMonths } from "@/lib/mock-data"
import { Search, UserPlus, Eye, Ruler, Users, FileX } from "lucide-react"
import { toast } from "sonner"

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [patients, setPatients] = useState(mockPatients)

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.parent_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddPatient = (data: PatientFormData) => {
    const newPatient = {
      id: "pat_" + Date.now(),
      posyandu_id: "pos_001",
      ...data,
      created_at: new Date().toISOString(),
    }
    setPatients([...patients, newPatient])
    setShowForm(false)
    toast.success("Data anak berhasil ditambahkan")
  }

  return (
    <div>
      <PageHeader title="Data Anak" subtitle="Kelola data anak yang terdaftar di Posyandu">
        <AzureButton onClick={() => setShowForm(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Anak
        </AzureButton>
      </PageHeader>

      <div className="p-8 space-y-6">
        {/* Form */}
        {showForm && <PatientForm onSubmit={handleAddPatient} onCancel={() => setShowForm(false)} />}

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama anak atau orang tua..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {searchQuery ? (
                  <FileX className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Users className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{searchQuery ? "Tidak Ditemukan" : "Belum Ada Data Anak"}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                {searchQuery
                  ? "Tidak ada data anak yang cocok dengan pencarian Anda."
                  : "Belum ada data anak. Tambahkan profil anak pertama untuk mulai memantau gizi."}
              </p>
              {!searchQuery && (
                <AzureButton className="mt-6" onClick={() => setShowForm(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Anak Pertama
                </AzureButton>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Anak</TableHead>
                    <TableHead>Umur (Bulan)</TableHead>
                    <TableHead>Orang Tua</TableHead>
                    <TableHead>Status Gizi Terakhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => {
                    const ageMonths = calculateAgeInMonths(patient.dob)
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {patient.gender === "male" ? "Laki-laki" : "Perempuan"}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{ageMonths}</TableCell>
                        <TableCell className="text-muted-foreground">{patient.parent_name}</TableCell>
                        <TableCell>
                          {patient.latest_measurement ? (
                            <HealthBadge status={patient.latest_measurement.status} showIcon />
                          ) : (
                            <span className="text-sm text-muted-foreground">Belum ada data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/patients/${patient.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                Detail
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/patients/${patient.id}/measure`}>
                                <Ruler className="mr-1 h-4 w-4" />
                                Ukur
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
