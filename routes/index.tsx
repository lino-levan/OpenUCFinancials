import { ChartColors, transparentize } from "fresh-charts/utils.ts";
import Chart from "islands/Chart.tsx";
import {
  getCostPerLocation,
  getCostPerYear,
  getRowCount,
  getTotalCost,
  getYears,
} from "lib/db.ts";
import { moneyFormatter, numberFormatter } from "lib/formatters.ts";

export default async function Home() {
  const [
    rowCount,
    totalCost,
    years,
    costPerYear,
    costPerLocation,
  ] = await Promise.all([
    getRowCount(),
    getTotalCost(),
    getYears(),
    getCostPerYear(),
    getCostPerLocation(2023),
  ]);
  return (
    <div class="w-screen h-screen items-center overflow-y-auto p-4">
      <div class="max-w-screen-md mx-auto space-y-4">
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
        <ul class="list-disc pl-4">
          <li>
            There are <b>{numberFormatter.format(costPerLocation.length)}</b>
            {" "}
            locations tracked by the UC system in 2023. Here is the cost
            breakdown for each one in 2023:
          </li>
        </ul>
        <Chart
          type="pie"
          data={{
            labels: costPerLocation.map((location) => location.location),
            datasets: [{
              label: "UC Salary Spending",
              data: costPerLocation.map((location) => location.cost),
              borderWidth: 1,
            }],
          }}
        />
        <p>
          Ok, that's all the fun facts for now.{" "}
          <a class="text-blue-500 hover:underline" href="/title">Click here</a>
          {" "}
          to see data split by role.
        </p>
      </div>
    </div>
  );
}
