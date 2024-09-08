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

export async function getCostPerLocation(year: number) {
  const { data } = await supabase.from("total_cost_by_location_and_year")
    .select("*").eq("year", year);
  return data!.map((row) => ({
    location: row.location!,
    cost: row.total_cost!,
  }));
}

export async function getTitleCount() {
  const { data } = await supabase.from("average_pay_by_title").select("*")
    .limit(10000);
  return data!.length;
}
