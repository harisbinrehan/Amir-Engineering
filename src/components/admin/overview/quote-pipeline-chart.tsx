"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EmptyState } from "@/components/common/empty-state";
import type { getQuotePipelineBreakdown } from "@/lib/data/quotes";

// These are state, not identity, so they wear this app's fixed status steps
// (good/warning/critical — see dataviz skill palette.md) rather than a
// categorical hue cycle; a status color is paired with its legend label here,
// never color alone.
const BUCKET_COLOR = { Open: "#fab219", Won: "#0ca30c", Lost: "#d03b3b" } as const;

const chartConfig: ChartConfig = {
  Open: { label: "Open", color: BUCKET_COLOR.Open },
  Won: { label: "Won", color: BUCKET_COLOR.Won },
  Lost: { label: "Lost", color: BUCKET_COLOR.Lost },
};

export function QuotePipelineChart({ data }: { data: Awaited<ReturnType<typeof getQuotePipelineBreakdown>> }) {
  const chartData = (["Open", "Won", "Lost"] as const)
    .map((bucket) => ({ bucket, value: data[bucket], fill: BUCKET_COLOR[bucket] }))
    .filter((row) => row.value > 0);
  const total = data.Open + data.Won + data.Lost;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Pipeline</CardTitle>
        <CardDescription>All-time requests by outcome</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState title="No quote requests yet" description="Pipeline breakdown will appear here once requests come in." />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="bucket" hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="bucket"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                cornerRadius={4}
                strokeWidth={2}
                className="stroke-card"
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((row) => (
                  <Cell key={row.bucket} fill={row.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null;
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="bucket" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
