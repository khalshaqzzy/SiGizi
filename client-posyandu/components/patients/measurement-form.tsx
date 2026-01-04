"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AzureButton } from "@/components/ui/azure-button"
import { Button } from "@/components/ui/button"
import { Ruler, Scale, Calendar, Calculator } from "lucide-react"
import { format } from "date-fns"

interface MeasurementFormProps {
  patientName: string
  onSubmit: (data: { weight: number; height: number; date: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function MeasurementForm({ patientName, onSubmit, onCancel, isLoading }: MeasurementFormProps) {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      weight: Number.parseFloat(weight),
      height: Number.parseFloat(height),
      date,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Input Pengukuran - {patientName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Berat Badan
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="pr-12 font-mono text-lg"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">kg</span>
              </div>
            </div>

            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary" />
                Tinggi Badan
              </Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="0.0"
                  className="pr-12 font-mono text-lg"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Tanggal Pengukuran
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Batal
            </Button>
            <AzureButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Menghitung...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Hitung Z-Score
                </>
              )}
            </AzureButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}