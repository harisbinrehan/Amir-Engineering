"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { getMonthlyFinanceTrend } from "@/lib/data/admin-finance";

// Two series, identity (revenue vs. expenses), not polarity — reuses this
// app's already-validated expense-chart palette (green/amber) for the same
// light/dark surfaces, so no new palette validation is needed.
const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "#3d865a" },
  expenses: { label: "Expenses", color: "#d76f04" },
};

function compactPkr(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export function RevenueExpenseChart({ data }: { data: Awaited<ReturnType<typeof getMonthlyFinanceTrend>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs. Expenses</CardTitle>
        <CardDescription>Last {data.length} months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={data} margin={{ left: 0, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="0" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={compactPkr} width={40} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `Rs ${Number(value).toLocaleString()}`} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-revenue)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />
            <Line
              dataKey="expenses"
              type="monotone"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-expenses)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
