import type { Metadata } from "next";
import { TrendingUpIcon, TrendingDownIcon, ScaleIcon } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { VendorsTable } from "@/components/admin/vendors-table";
import { VendorFormDialog } from "@/components/admin/vendor-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getFinanceSummary } from "@/lib/data/admin-finance";
import { getVendors } from "@/lib/data/expenses";
import { formatCurrency } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Finance" };

export default async function AdminFinancePage() {
  await requireRole(["super_admin", "admin", "finance"]);

  const [summary, vendors] = await Promise.all([getFinanceSummary(), getVendors()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground mt-1 text-sm">Revenue vs. expenses overview, and vendor management.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold">This Month</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <StatCard label="Revenue" value={formatCurrency(summary.revenue.totalThisMonth)} icon={TrendingUpIcon} />
          <StatCard label="Expenses" value={formatCurrency(summary.expenses.totalThisMonth)} icon={TrendingDownIcon} />
          <StatCard label="Net" value={formatCurrency(summary.netThisMonth)} icon={ScaleIcon} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold">All Time</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <StatCard label="Revenue" value={formatCurrency(summary.revenue.totalAllTime)} icon={TrendingUpIcon} />
          <StatCard label="Expenses" value={formatCurrency(summary.expenses.totalAllTime)} icon={TrendingDownIcon} />
          <StatCard label="Net" value={formatCurrency(summary.netAllTime)} icon={ScaleIcon} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Vendors</h2>
          <VendorFormDialog />
        </div>
        <VendorsTable vendors={vendors} />
      </div>
    </div>
  );
}
