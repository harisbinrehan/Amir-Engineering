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

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Revenue, expenses and net per month — feeds the finance trend charts. */
export async function getMonthlyFinanceTrend(months = 6) {
  const supabase = await createClient();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (months - 1));

  const [{ data: orders }, { data: expenses }] = await Promise.all([
    supabase.from("orders").select("total, created_at").neq("status", "cancelled").gte("created_at", start.toISOString()),
    supabase.from("expenses").select("amount, expense_date").gte("expense_date", start.toISOString().slice(0, 10)),
  ]);

  const buckets = new Map<string, { month: string; revenue: number; expenses: number; net: number }>();
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { month: MONTH_LABEL.format(d), revenue: 0, expenses: 0, net: 0 });
  }

  for (const order of orders ?? []) {
    const date = new Date(order.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.revenue += Number(order.total);
  }

  for (const expense of expenses ?? []) {
    const date = new Date(expense.expense_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.expenses += Number(expense.amount);
  }

  for (const bucket of buckets.values()) bucket.net = bucket.revenue - bucket.expenses;

  return Array.from(buckets.values());
}

