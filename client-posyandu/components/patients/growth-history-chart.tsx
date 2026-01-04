"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface GrowthHistoryChartProps {
  data: {
    date: string
    weight: number
    height: number
    z_score: number
  }[]
  metric: "weight" | "height" | "z_score"
}

export function GrowthHistoryChart({ data, metric }: GrowthHistoryChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    date: format(new Date(d.date), "MMM yy", { locale: id }),
    fullDate: format(new Date(d.date), "d MMM yyyy", { locale: id }),
  }))

  const getLabel = () => {
    switch (metric) {
      case "weight":
        return "Berat Badan (kg)"
      case "height":
        return "Tinggi Badan (cm)"
      case "z_score":
        return "Z-Score"
    }
  }

  const getColor = () => {
    switch (metric) {
      case "weight":
        return "#2563EB"
      case "height":
        return "#10B981"
      case "z_score":
        return "#F59E0B"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          {getLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColor()} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={getColor()} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={metric === "z_score" ? [-5, 1] : ["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
              />
              {metric === "z_score" && (
                <>
                  <ReferenceLine
                    y={-2}
                    stroke="#F59E0B"
                    strokeDasharray="5 5"
                    label={{ value: "-2 SD", position: "right", fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={-3}
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                    label={{ value: "-3 SD", position: "right", fontSize: 10 }}
                  />
                </>
              )}
              <Area type="monotone" dataKey={metric} stroke={getColor()} fill={`url(#gradient-${metric})`} />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={getColor()}
                strokeWidth={2}
                dot={{ fill: getColor(), strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}