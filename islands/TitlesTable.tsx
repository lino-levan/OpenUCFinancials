import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { SortableTable } from "islands/SortableTable.tsx";

type TitleData = {
  title: string;
  average_pay: number;
  count: number;
};

type TitlesTableProps = {
  years: number[];
};

export function TitlesTable({ years }: TitlesTableProps) {
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const data = useSignal<TitleData[]>([]);
  const selectedYear = useSignal(years[years.length - 1]);

  const fetchData = async (year: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/titles?year=${year}`);
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
    fetchData(selectedYear.value);
  }, [selectedYear.value]);

  const columns = [
    {
      key: "title",
      name: "Title",
    },
    {
      key: "average_pay",
      name: "Average Pay",
      formatter: "currency" as const,
    },
    {
      key: "min_pay",
      name: "Minimum Pay",
      formatter: "currency" as const,
    },
    {
      key: "max_pay",
      name: "Maximum Pay",
      formatter: "currency" as const,
    },
    {
      key: "count",
      name: "# of Employees",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Titles and Average Pay</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="year-select" className="font-medium">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear.value}
            onChange={(e) => {
              selectedYear.value = Number(e.currentTarget.value);
            }}
            className="border rounded px-2 py-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading.value
        ? <div className="text-center py-4">Loading...</div>
        : error.value
        ? <div className="text-red-500 text-center py-4">{error.value}</div>
        : (
          <SortableTable
            initialData={data.value}
            columns={columns}
            getRowLink={(row) => `/title/${encodeURI(row.title as string)}`}
          />
        )}
    </div>
  );
}
