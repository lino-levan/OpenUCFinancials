import { Signal, useComputed, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { moneyFormatter } from "lib/formatters.ts";

// Define types for our formatters
type FormatterFunction = (value: unknown) => string | number;

type Formatters = {
  default: FormatterFunction;
  currency: FormatterFunction;
  date: FormatterFunction;
  percentage: FormatterFunction;
};

// Predefined formatters
const formatters: Formatters = {
  default: (value: unknown) => String(value),
  currency: (value: unknown) => moneyFormatter.format(value as number),
  date: (value: unknown) =>
    new Date(value as string | number | Date).toLocaleDateString(),
  percentage: (value: unknown) => `${((value as number) * 100).toFixed(2)}%`,
};

// Define types for our column and data structures
type ColumnDefinition = {
  key: string;
  name: string;
  formatter?: keyof Formatters;
};

type DataItem = Record<string, unknown>;

type SortConfig = {
  key: string | null;
  direction: "ascending" | "descending";
};

type SortableTableProps = {
  initialData: DataItem[];
  columns: ColumnDefinition[];
  getRowLink?: (row: DataItem) => string | null;
};

export function SortableTable(
  { initialData, columns, getRowLink }: SortableTableProps,
) {
  const data: Signal<DataItem[]> = useSignal(initialData);
  const sortConfig: Signal<SortConfig> = useSignal({
    key: null,
    direction: "ascending",
  });

  const sortedData = useComputed(() => {
    let sortableItems = [...data.value];
    if (sortConfig.value.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.value.key!];
        const bValue = b[sortConfig.value.key!];
        if (aValue < bValue) {
          return sortConfig.value.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.value.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  });

  const requestSort = useCallback((key: string) => {
    sortConfig.value = {
      key,
      direction: sortConfig.value.key === key &&
          sortConfig.value.direction === "ascending"
        ? "descending"
        : "ascending",
    };
  }, []);

  const renderRow = (item: DataItem, index: number) => {
    const rowContent = (
      <>
        {columns.map((column) => (
          <td key={column.key} className="px-3 py-4 whitespace-nowrap">
            {(formatters[column.formatter || "default"])(
              item[column.key],
            )}
          </td>
        ))}
      </>
    );

    if (getRowLink) {
      const link = getRowLink(item);
      if (link) {
        return (
          <tr
            key={index}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => window.location.href = link}
          >
            {rowContent}
          </tr>
        );
      }
    }

    return <tr key={index}>{rowContent}</tr>;
  };

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort(column.key)}
              >
                {column.name}
                {sortConfig.value.key === column.key && (
                  <span className="ml-2">
                    {sortConfig.value.direction === "ascending" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.value.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
}
