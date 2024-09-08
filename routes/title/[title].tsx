import ArrowLeft from "icons/arrow-left.tsx";
import { getPeopleByTitle, getYears } from "lib/db.ts";
import { TitlesTable } from "islands/TitlesTable.tsx";
import { FreshContext } from "$fresh/server.ts";
import { SortableTable } from "islands/SortableTable.tsx";

export default async function Home(_: Request, ctx: FreshContext) {
  const title = decodeURI(ctx.params["title"]);
  const people = await getPeopleByTitle(title);
  return (
    <div class="w-screen h-screen items-center overflow-y-auto p-4">
      <div class="max-w-screen-md mx-auto space-y-4">
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
        <SortableTable
          initialData={people}
          columns={[
            { key: "first_name", name: "First Name" },
            { key: "last_name", name: "Last Name" },
            { key: "gross_pay", name: "Gross Pay", formatter: "currency" },
            { key: "year", name: "Year" },
          ]}
        />
      </div>
    </div>
  );
}
