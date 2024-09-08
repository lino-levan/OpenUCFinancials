import { ChartColors, transparentize } from "fresh-charts/utils.ts";
import Chart from "islands/Chart.tsx";
import { getCostPerYear, getRowCount, getTotalCost, getYears } from "lib/db.ts";

const numberFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
});

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function Home() {
  const [
    rowCount,
    totalCost,
    years,
    costPerYear,
  ] = await Promise.all([
    getRowCount(),
    getTotalCost(),
    getYears(),
    getCostPerYear(),
  ]);
  return (
    <div class="flex flex-col w-screen h-screen items-center px-4">
      <div class="max-w-screen-md space-y-4 overflow-y-auto px-4">
        <h1 class="text-2xl">Welcome to OpenUCFinancials.</h1>
        <p>
          We have collected <b>{numberFormatter.format(rowCount)}</b>{" "}
          bits of financial records and made them available for you to
          explore.<br />Here are some fun pieces of data:
        </p>
        <ul class="list-disc pl-4">
          <li>
            The UC system has spent a total of{" "}
            <b>
              {moneyFormatter.format(totalCost)}
            </b>{" "}
            on salaries from{" "}
            {years[0]}-{years[years.length - 1]}. Here's that breakdown year
            over year:
          </li>
        </ul>
        <Chart
          type="line"
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          data={{
            labels: costPerYear.map((year) => year.year),
            datasets: [{
              label: "UC Salary Spending",
              data: costPerYear.map((year) => year.cost),
              borderColor: ChartColors.Red,
              backgroundColor: transparentize(ChartColors.Red, 0.5),
              borderWidth: 1,
            }],
          }}
        />
      </div>
    </div>
  );
}
