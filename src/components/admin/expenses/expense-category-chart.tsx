"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EmptyState } from "@/components/common/empty-state";
import type { getExpensesByCategory } from "@/lib/data/expenses";

// Single metric (total spend) across categories — bar length already encodes
// magnitude, so this is one series in one hue, not a per-bar rainbow. Reuses
// this app's --industrial accent; validated separately against both chart
// surfaces by the dataviz skill's checks (contrast >= 3:1 on both).
const chartConfig: ChartConfig = {
  total: { label: "Total Spend", color: "var(--color-industrial)" },
};

export function ExpenseCategoryChart({ data }: { data: Awaited<ReturnType<typeof getExpensesByCategory>> }) {
  const top = data.slice(0, 8);

  if (top.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spend by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No expenses yet" description="Category totals will appear here once expenses are recorded." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Category</CardTitle>
        <CardDescription>All-time total, top {top.length} categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={top} layout="vertical" margin={{ left: 8, right: 56 }}>
            <CartesianGrid horizontal={false} strokeDasharray="0" className="stroke-border/50" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : String(v))}
            />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent formatter={(value) => `Rs ${Number(value).toLocaleString()}`} />}
            />
            <Bar dataKey="total" fill="var(--color-industrial)" radius={[0, 4, 4, 0]} maxBarSize={22}>
              <LabelList
                dataKey="total"
                position="right"
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `Rs ${Number(value).toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
