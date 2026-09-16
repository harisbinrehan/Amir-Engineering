import { createClient } from "@/lib/supabase/server";

export async function getExpenseCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("expense_categories").select("*").order("name");

  if (error) throw error;
  return data;
}

export async function getVendors() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("vendors").select("*").order("name");

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
