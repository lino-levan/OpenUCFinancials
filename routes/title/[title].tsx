import ArrowLeft from "icons/arrow-left.tsx";
import { ChartColors, transparentize } from "fresh-charts/utils.ts";
import Chart from "islands/Chart.tsx";
import { getAveragePayByTitle, getPeopleByTitle } from "lib/db.ts";
import { FreshContext } from "$fresh/server.ts";
import { SortableTable } from "islands/SortableTable.tsx";

export default async function Home(_: Request, ctx: FreshContext) {
  const title = decodeURI(ctx.params["title"]);
  const [people, payPerYear] = await Promise.all([
    getPeopleByTitle(title),
    getAveragePayByTitle(title),
  ]);
  return (
    <div class="w-screen h-screen items-center overflow-y-auto p-4">
      <div class="max-w-screen-lg mx-auto space-y-4">
        <a
          href="/title"
          class="flex items-center gap-1 text-gray-700 hover:text-black hover:underline"
        >
          <ArrowLeft class="w-6 h-6" /> Back to titles
        </a>
        <h1 class="text-2xl">{title}</h1>
        <p>
          Now we're looking at specific information about the title{" "}
          <strong>{title}</strong>.
        </p>
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
            labels: payPerYear.map((year) => year.year),
            datasets: [{
              label: "Average UC Salary",
              data: payPerYear.map((year) => year.average_pay),
              borderColor: ChartColors.Red,
              backgroundColor: transparentize(ChartColors.Red, 0.5),
              borderWidth: 1,
            }, {
              label: "Minimum UC Salary",
              data: payPerYear.map((year) => year.min_pay),
              borderColor: ChartColors.Blue,
              backgroundColor: transparentize(ChartColors.Blue, 0.5),
              borderWidth: 1,
            }, {
              label: "Maximum UC Salary",
              data: payPerYear.map((year) => year.max_pay),
              borderColor: ChartColors.Green,
              backgroundColor: transparentize(ChartColors.Green, 0.5),
              borderWidth: 1,
            }],
          }}
        />
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
            labels: payPerYear.map((year) => year.year),
            datasets: [{
              label: "# of People",
              data: payPerYear.map((year) => year.count),
              borderColor: ChartColors.Red,
              backgroundColor: transparentize(ChartColors.Red, 0.5),
              borderWidth: 1,
            }],
          }}
        />
        <SortableTable
          initialData={people}
          columns={[
            { key: "first_name", name: "First Name" },
            { key: "last_name", name: "Last Name" },
            { key: "location", name: "Location" },
            { key: "gross_pay", name: "Gross Pay", formatter: "currency" },
            { key: "year", name: "Year" },
          ]}
        />
      </div>
    </div>
  );
}
