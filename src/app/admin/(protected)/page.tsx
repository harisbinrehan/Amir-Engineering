import type { Metadata } from "next";
import { FileTextIcon, WrenchIcon, PackageIcon, ClockIcon } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils/format";
import { createClient } from "@/lib/supabase/server";
import { getQuotes, getMonthlyQuoteVolume, getQuotePipelineBreakdown } from "@/lib/data/quotes";
import { QuoteTrendChart } from "@/components/admin/overview/quote-trend-chart";
import { QuotePipelineChart } from "@/components/admin/overview/quote-pipeline-chart";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalQuotes },
    { count: newQuotes },
    { count: machineryCount },
    { count: productCount },
    recentQuotes,
    monthlyQuoteVolume,
    pipelineBreakdown,
  ] = await Promise.all([
    supabase.from("quotes").select("*", { count: "exact", head: true }),
    supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("machinery").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    getQuotes(),
    getMonthlyQuoteVolume(),
    getQuotePipelineBreakdown(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A snapshot of quote activity, pipeline health, and recent requests.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Quote Requests" value={totalQuotes ?? 0} icon={FileTextIcon} />
        <StatCard label="New Quotes" value={newQuotes ?? 0} icon={ClockIcon} hint="Awaiting review" />
        <StatCard label="Active Machinery" value={machineryCount ?? 0} icon={WrenchIcon} />
        <StatCard label="Active Products" value={productCount ?? 0} icon={PackageIcon} />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <QuoteTrendChart data={monthlyQuoteVolume} />
        </div>
        <div className="lg:col-span-2">
          <QuotePipelineChart data={pipelineBreakdown} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quote Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <EmptyState title="No quote requests yet" />
          ) : (
            <div className="divide-border divide-y">
              {recentQuotes.slice(0, 8).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{quote.full_name}</p>
                    <p className="text-muted-foreground">
                      {quote.reference_number} &middot; {formatDate(quote.created_at)}
                    </p>
                  </div>
                  <QuoteStatusBadge status={quote.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
