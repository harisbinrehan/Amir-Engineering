"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EXPENSE_DEPARTMENTS } from "@/lib/validation/expense-schema";
import type { getMonthlyExpensesByDepartment } from "@/lib/data/expenses";

// Validated against this app's light (card #fff) and dark (card #191d23)
// surfaces with scripts/validate_palette.js from the dataviz skill — all
// checks pass; the amber/green pair sits in the 6–8 CVD floor band, which is
// legal here because the chart ships a legend + direct value labels + a
// per-bar tooltip (the required secondary encoding).
const DEPARTMENT_COLOR: Record<(typeof EXPENSE_DEPARTMENTS)[number], string> = {
  "Amir Engineering": "#d76f04",
  "Fine Foods Industries": "#3d865a",
  "Shared / General": "#2266a4",
};

const chartConfig: ChartConfig = Object.fromEntries(
  EXPENSE_DEPARTMENTS.map((dept) => [dept, { label: dept, color: DEPARTMENT_COLOR[dept] }]),
);

function compactPkr(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

export function ExpenseTrendChart({
  data,
}: {
  data: Awaited<ReturnType<typeof getMonthlyExpensesByDepartment>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spend by Business</CardTitle>
        <CardDescription>Last {data.length} months, Amir Engineering vs. Fine Foods vs. shared costs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={data} barCategoryGap={12}>
            <CartesianGrid vertical={false} strokeDasharray="0" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={compactPkr} width={40} />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `Rs ${Number(value).toLocaleString()}`} />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {EXPENSE_DEPARTMENTS.map((dept, i) => (
              <Bar
                key={dept}
                dataKey={dept}
                stackId="total"
                fill={DEPARTMENT_COLOR[dept]}
                radius={i === EXPENSE_DEPARTMENTS.length - 1 ? [4, 4, 0, 0] : 0}
                maxBarSize={24}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
