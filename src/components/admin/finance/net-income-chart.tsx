"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { getMonthlyFinanceTrend } from "@/lib/data/admin-finance";

// Net income is polarity around zero (profit vs. loss), not series identity,
// so each bar wears this app's fixed status steps (good/critical) rather
// than a categorical hue — never both in one chart, per the dataviz skill.
const NET_COLOR = { positive: "#0ca30c", negative: "#d03b3b" } as const;

const chartConfig: ChartConfig = {
  net: { label: "Net Income" },
};

function compactPkr(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}K`;
  return String(value);
}

export function NetIncomeChart({ data }: { data: Awaited<ReturnType<typeof getMonthlyFinanceTrend>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Income</CardTitle>
        <CardDescription>Revenue minus expenses, by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart data={data} margin={{ left: 0, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="0" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={compactPkr} width={56} />
            <ReferenceLine y={0} className="stroke-border" />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent formatter={(value) => `Rs ${Number(value).toLocaleString()}`} />}
            />
            <Bar dataKey="net" radius={4} maxBarSize={32} animationDuration={900} animationEasing="ease-out">
              {data.map((row) => (
                <Cell key={row.month} fill={row.net >= 0 ? NET_COLOR.positive : NET_COLOR.negative} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
