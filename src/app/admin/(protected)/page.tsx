import type { Metadata } from "next";
import { FileTextIcon, WrenchIcon, PackageIcon, ClockIcon } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { formatDate } from "@/lib/utils/format";
import { createClient } from "@/lib/supabase/server";
import { getQuotes } from "@/lib/data/quotes";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: totalQuotes }, { count: newQuotes }, { count: machineryCount }, { count: productCount }, recentQuotes] =
    await Promise.all([
      supabase.from("quotes").select("*", { count: "exact", head: true }),
      supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("machinery").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      getQuotes(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Round-1 foundation dashboard — financial reporting and full analytics ship in a later module.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Quote Requests" value={totalQuotes ?? 0} icon={FileTextIcon} />
        <StatCard label="New Quotes" value={newQuotes ?? 0} icon={ClockIcon} hint="Awaiting review" />
        <StatCard label="Active Machinery" value={machineryCount ?? 0} icon={WrenchIcon} />
        <StatCard label="Active Products" value={productCount ?? 0} icon={PackageIcon} />
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
