import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { SortableTable } from "islands/SortableTable.tsx";
import { Tables } from "lib/supabase.ts";

type EmployeeData = Tables<"employee_salaries">;

export function EmployeeTable() {
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<EmployeeData[]>([]);
  const nameSearch = useSignal("");

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const queryParams = new URLSearchParams({
        name: nameSearch.value,
      });
      const response = await fetch(`/api/employees?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      data.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(debounceTimer);
  }, [nameSearch.value]);

  const columns = [
    {
      key: "first_name",
      name: "First Name",
    },
    {
      key: "last_name",
      name: "Last Name",
    },
    {
      key: "title",
      name: "Job Title",
    },
    {
      key: "location",
      name: "Location",
    },
    {
      key: "year",
      name: "Year",
    },
    {
      key: "gross_pay",
      name: "Gross Pay",
      formatter: "currency" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Employee Data</h2>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by Name"
          value={nameSearch.value}
          onInput={(e) => nameSearch.value = e.currentTarget.value}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {isLoading.value
        ? <div className="text-center py-4">Loading...</div>
        : error.value
        ? <div className="text-red-500 text-center py-4">{error.value}</div>
        : (
          <SortableTable
            initialData={data.value}
            columns={columns}
            getRowLink={(row) => `/employee/${row.id}`}
          />
        )}
    </div>
  );
}
