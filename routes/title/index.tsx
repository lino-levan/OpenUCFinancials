import { getYears } from "lib/db.ts";
import { TitlesTable } from "islands/TitlesTable.tsx";

export default async function Home() {
  const [
    years,
  ] = await Promise.all([
    getYears(),
  ]);
  return (
    <div class="w-screen h-screen items-center overflow-y-auto p-4">
      <div class="max-w-screen-md mx-auto space-y-4">
        <h1 class="text-2xl">Let's split the data by titles.</h1>
        <p>
          Here are every title tracked by the UC system, along with the average
          pay for each one.
        </p>
        <TitlesTable years={years} />
      </div>
    </div>
  );
}
