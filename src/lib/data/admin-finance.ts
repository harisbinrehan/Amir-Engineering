import { createClient } from "@/lib/supabase/server";
import { getExpenseSummary } from "@/lib/data/expenses";

export async function getRevenueSummary() {
  const supabase = await createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: allTime }, { data: thisMonth }] = await Promise.all([
    supabase.from("orders").select("total").neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  const totalAllTime = (allTime ?? []).reduce((sum, o) => sum + Number(o.total), 0);
  const totalThisMonth = (thisMonth ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  return {
    totalAllTime,
    totalThisMonth,
    orderCountAllTime: allTime?.length ?? 0,
  };
}

export async function getFinanceSummary() {
  const [revenue, expenses] = await Promise.all([getRevenueSummary(), getExpenseSummary()]);

  return {
    revenue,
    expenses,
    netThisMonth: revenue.totalThisMonth - expenses.totalThisMonth,
    netAllTime: revenue.totalAllTime - expenses.totalAllTime,
  };
}

