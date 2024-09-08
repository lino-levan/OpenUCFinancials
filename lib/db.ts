import { createClient } from "@supabase/supabase-js";
import { Database } from "lib/supabase.ts";

const supabase = Deno.env.get("SUPABASE_URL")
  ? createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_KEY")!,
  )
  : null!;

export async function getRowCount() {
  const { count } = await supabase.from("employee_salaries").select("", {
    count: "exact",
  });
  return count!;
}

export async function getTotalCost() {
  const { data } = await supabase.from("total_cost").select("*").single();
  return data!.cost!;
}

export async function getYears() {
  const { data } = await supabase.from("years").select("*");
  return data!.map((year) => year.year!);
}

export async function getCostPerYear() {
  const { data } = await supabase.from("total_cost_per_year").select("*");
  return data!.map((row) => ({ year: row.year!, cost: row.total_cost! }));
}
