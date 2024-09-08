import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "lib/supabase.ts";

const supabase = Deno.env.get("SUPABASE_URL")
  ? createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_KEY")!,
  )
  : null!;

function throwError(err: PostgrestError | null) {
  if (err) {
    throw new Error(err.message);
  }
}

export async function getRowCount() {
  const { count, error } = await supabase.from("employee_salaries").select("", {
    count: "exact",
  });
  throwError(error);
  return count!;
}

export async function getTotalCost() {
  const { data, error } = await supabase.from("total_cost").select("*")
    .single();
  throwError(error);
  return data!.cost!;
}

export async function getYears() {
  const { data, error } = await supabase.from("years").select("*");
  throwError(error);
  return data!.map((year) => year.year!);
}

export async function getCostPerYear() {
  const { data, error } = await supabase.from("total_cost_per_year").select(
    "*",
  );
  throwError(error);
  return data!.map((row) => ({ year: row.year!, cost: row.total_cost! }));
}

export async function getCostPerLocation(year: number) {
  const { data, error } = await supabase.from("total_cost_by_location_and_year")
    .select("*").eq("year", year);
  throwError(error);
  return data!.map((row) => ({
    location: row.location!,
    cost: row.total_cost!,
  }));
}

export async function getAveragePayByYear(year: number) {
  const { data, error } = await supabase.from("pay_by_title").select(
    "*",
  ).eq(
    "year",
    year,
  );
  throwError(error);
  return data!.map((row) => ({
    title: row.title!,
    min_pay: row.min_pay!,
    max_pay: row.max_pay!,
    average_pay: row.average_pay!,
    count: row.count!,
  }));
}

export async function getAveragePayByTitle(title: string) {
  const { data, error } = await supabase.from("pay_by_title").select(
    "*",
  ).eq("title", title);
  throwError(error);
  return data!.map((row) => ({
    year: row.year!,
    min_pay: row.min_pay!,
    max_pay: row.max_pay!,
    average_pay: row.average_pay!,
    count: row.count!,
  }));
}

export async function getPeopleByTitle(title: string) {
  const { data, error } = await supabase.from("employee_salaries").select(
    "*",
  ).eq("title", title).limit(10000);
  throwError(error);
  return data!;
}
