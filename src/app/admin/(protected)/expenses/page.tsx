import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { WalletIcon, CalendarIcon, ReceiptIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/admin/stat-card";
import { ExpensesTable } from "@/components/admin/expenses-table";
import { ExpenseFormDialog } from "@/components/admin/expense-form-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getExpenses, getExpenseCategories, getVendors, getExpenseSummary } from "@/lib/data/expenses";
import { EXPENSE_DEPARTMENTS } from "@/lib/validation/expense-schema";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Expenses" };

async function ExpensesData({ department, search, categories, vendors }: { department: string; search: string; categories: any; vendors: any }) {
  const expenses = await getExpenses({ department: department === "all" ? undefined : department, search });
  return <ExpensesTable expenses={expenses} categories={categories} vendors={vendors} />;
}

export default async function AdminExpensesPage(props: PageProps<"/admin/expenses">) {
  await requireRole(["super_admin", "admin", "finance"]);

  const params = await props.searchParams;
  const department = typeof params.department === "string" ? params.department : "all";
  const search = typeof params.q === "string" ? params.q : "";

  const [categories, vendors, summary] = await Promise.all([
    getExpenseCategories(),
    getVendors(),
    getExpenseSummary(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Company expenses by category, vendor and business.
          </p>
        </div>
        <ExpenseFormDialog categories={categories} vendors={vendors} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="This Month" value={formatCurrency(summary.totalThisMonth)} icon={CalendarIcon} />
        <StatCard label="All Time" value={formatCurrency(summary.totalAllTime)} icon={WalletIcon} />
        <StatCard label="Total Records" value={summary.countAllTime} icon={ReceiptIcon} />
      </div>

      <form className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" method="get">
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/expenses?department=all${search ? `&q=${search}` : ""}`} scroll={false}>
            <Badge
              variant={department === "all" ? "default" : "secondary"}
              className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground", department === "all" && "bg-industrial text-industrial-foreground")}
            >
              All
            </Badge>
          </Link>
          {EXPENSE_DEPARTMENTS.map((d) => (
            <Link key={d} href={`/admin/expenses?department=${encodeURIComponent(d)}${search ? `&q=${search}` : ""}`} scroll={false}>
              <Badge
                variant={department === d ? "default" : "secondary"}
                className={cn("px-3 py-1.5 text-sm font-normal transition-colors hover:bg-industrial hover:text-industrial-foreground", department === d && "bg-industrial text-industrial-foreground")}
              >
                {d}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="hidden" name="department" value={department} />
          <Input name="q" placeholder="Search description..." defaultValue={search} className="w-64" />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </div>
      </form>

      <Suspense key={department + search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <ExpensesData department={department} search={search} categories={categories} vendors={vendors} />
      </Suspense>
    </div>
  );
}
