"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AzureButton } from "@/components/ui/azure-button"
import { Button } from "@/components/ui/button"
import { UserPlus, X } from "lucide-react"

export interface PatientFormData {
  name: string
  dob: string
  gender: "MALE" | "FEMALE"
}

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void
  onCancel: () => void
  initialData?: PatientFormData
}

export function PatientForm({ onSubmit, onCancel, initialData }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(
    initialData || {
      name: "",
      dob: "",
      gender: "MALE",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-primary" />
          {initialData ? "Edit Data Anak" : "Tambah Anak Baru"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap Anak</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Tanggal Lahir</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => setFormData({ ...formData, gender: v as "MALE" | "FEMALE" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Laki-laki</SelectItem>
                  <SelectItem value="FEMALE">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <AzureButton type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              {initialData ? "Simpan Perubahan" : "Tambah Anak"}
            </AzureButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}