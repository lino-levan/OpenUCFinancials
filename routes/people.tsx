import ArrowLeft from "icons/arrow-left.tsx";
import { EmployeeTable } from "islands/EmployeeTable.tsx";

export default async function Home() {
  return (
    <div class="w-screen h-screen items-center overflow-y-auto p-4">
      <div class="max-w-screen-lg mx-auto space-y-4">
        <a
          href="/"
          class="flex items-center gap-1 text-gray-700 hover:text-black hover:underline"
        >
          <ArrowLeft class="w-6 h-6" /> Back to the homepage
        </a>
        <h1 class="text-2xl">Search for people.</h1>
        <p>
          The salaries for many public employees are available online. Search
          for a person by name to see their salary history.
        </p>
        <EmployeeTable />
      </div>
    </div>
  );
}
