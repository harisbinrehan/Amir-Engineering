import { createClient } from "@/lib/supabase/server";
import { EXPENSE_DEPARTMENTS } from "@/lib/validation/expense-schema";

export async function getExpenseCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expense_categories").select("*").order("name");

  if (error) throw error;
  return data;
}

export async function getVendors(options?: { search?: string }) {
  const supabase = await createClient();
  let query = supabase.from("vendors").select("*").order("name");

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getExpenses(options?: { categoryId?: string; department?: string; search?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("expenses")
    .select("*, category:expense_categories(id, name), vendor:vendors(id, name)")
    .order("expense_date", { ascending: false });

  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  if (options?.department) {
    query = query.eq("department", options.department);
  }

  if (options?.search) {
    const term = options.search.trim();
    query = query.ilike("description", `%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getExpenseById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*, category:expense_categories(id, name), vendor:vendors(id, name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Simple summary stats for the admin dashboard header — total this month, total all time, by department. */
export async function getExpenseSummary() {
  const supabase = await createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: allTime }, { data: thisMonth }] = await Promise.all([
    supabase.from("expenses").select("amount"),
    supabase.from("expenses").select("amount").gte("expense_date", startOfMonth.toISOString().slice(0, 10)),
  ]);

  const totalAllTime = (allTime ?? []).reduce((sum, e) => sum + Number(e.amount), 0);
  const totalThisMonth = (thisMonth ?? []).reduce((sum, e) => sum + Number(e.amount), 0);

  return {
    totalAllTime,
    totalThisMonth,
    countAllTime: allTime?.length ?? 0,
  };
}

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", { month: "short" });

/** Last `months` calendar months of spend, broken out by department — feeds the trend chart. */
export async function getMonthlyExpensesByDepartment(months = 6) {
  const supabase = await createClient();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (months - 1));

  const { data, error } = await supabase
    .from("expenses")
    .select("amount, expense_date, department")
    .gte("expense_date", start.toISOString().slice(0, 10));

  if (error) throw error;

  // Pre-build one bucket per month so empty months still render (not skipped).
  const buckets = new Map<string, { month: string; [dept: string]: number | string }>();
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const row: { month: string; [dept: string]: number | string } = { month: MONTH_LABEL.format(d) };
    for (const dept of EXPENSE_DEPARTMENTS) row[dept] = 0;
    buckets.set(key, row);
  }

  for (const expense of data) {
    const date = new Date(expense.expense_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const dept = expense.department ?? "Shared / General";
    bucket[dept] = (Number(bucket[dept]) || 0) + Number(expense.amount);
  }

  return Array.from(buckets.values());
}

/** All-time spend per category, ranked highest first — feeds the category breakdown chart. */
export async function getExpensesByCategory() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expenses").select("amount, category:expense_categories(name)");

  if (error) throw error;

  const totals = new Map<string, number>();
  for (const expense of data) {
    const name = expense.category?.name ?? "Uncategorized";
    totals.set(name, (totals.get(name) ?? 0) + Number(expense.amount));
  }

  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
