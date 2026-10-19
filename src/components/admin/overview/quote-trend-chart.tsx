"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { getMonthlyQuoteVolume } from "@/lib/data/quotes";

// Single metric over time — one series, one hue (this app's brand amber),
// no legend needed per the dataviz skill's nominal-categorical rule.
const chartConfig: ChartConfig = {
  count: { label: "Quote Requests", color: "var(--color-industrial)" },
};

export function QuoteTrendChart({ data }: { data: Awaited<ReturnType<typeof getMonthlyQuoteVolume>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Request Volume</CardTitle>
        <CardDescription>Last {data.length} months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 12 }}>
            <defs>
              <linearGradient id="quoteVolumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-industrial)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--color-industrial)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="0" className="stroke-border/50" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#quoteVolumeFill)"
              stroke="var(--color-industrial)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-industrial)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
