import { ChartColors, transparentize } from "fresh-charts/utils.ts";
import Chart from "islands/Chart.tsx";
import { data, dataByYear } from "lib/data.ts";

const years = Object.keys(dataByYear);
const roles = Array.from(new Set(data.map((row) => row[4])));
const subjects = Array.from(new Set(data.map((row) => row[1])));

const numberFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
});

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Home() {
  return (
    <div class="flex flex-col w-screen h-screen items-center px-4">
      <div class="max-w-screen-md space-y-4 overflow-y-auto px-4">
        <h1 class="text-2xl">Welcome to OpenUCFinancials.</h1>
        <p>
          We have collected {numberFormatter.format(data.length)}{" "}
          bits of financial records and made them available for you to
          explore.<br />Here are some fun pieces of data:
        </p>
        <ul class="list-disc pl-4">
          <li>
            The UC system has spent a total of{" "}
            <b>
              {moneyFormatter.format(
                data.reduce((acc, row) => acc + row[6], 0),
              )}
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
            labels: years,
            datasets: [{
              label: "UC Salary Spending",
              data: Object.keys(dataByYear).map((year) =>
                dataByYear[year].reduce((acc, row) => acc + row[6], 0)
              ),
              borderColor: ChartColors.Red,
              backgroundColor: transparentize(ChartColors.Red, 0.5),
              borderWidth: 1,
            }],
          }}
        />
        <ul class="list-disc pl-4">
          <li>
            There are <b>{numberFormatter.format(subjects.length)}</b>{" "}
            campuses/subjects tracked by the UC system. Here is the cost
            breakdown for each one in {years[years.length - 1]}:
          </li>
        </ul>
        <Chart
          type="pie"
          data={{
            labels: subjects,
            datasets: [{
              label: "UC Salary Spending",
              data: subjects.map((subject) =>
                data.filter((row) =>
                  row[1] === subject &&
                  row[0] === parseInt(years[years.length - 1])
                ).reduce((acc, row) => acc + row[6], 0)
              ),
              borderWidth: 1,
            }],
          }}
        />
        <ul class="list-disc pl-4">
          <li>
            There are <b>{numberFormatter.format(roles.length)}</b>{" "}
            roles tracked by the UC system. [NOT IMPLEMENTED] Click here to see
            data split by role.
          </li>
        </ul>
      </div>
    </div>
  );
}
