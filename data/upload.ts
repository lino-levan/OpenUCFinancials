// The one file in the codebase that uses bun for the lulz
const file = Bun.file("./data/data.csv");
const writer = file.writer();

let i = 1;

for (let year = 2010; year <= 2023; year++) {
  const raw = await Bun.file(`./data/${year}.json`).json();
  for (const { cell } of raw) {
    writer.write(`${i++},${cell[1]},"${cell[2]}","${cell[3]}","${cell[4]}","${cell[5]}",${cell[6]},${cell[7]},${cell[8]},${cell[9]}\n`);
  }
}

writer.end();

// Now you, as the user needs to run psql -h DATABASE_URL -p 5432 -d postgres -U postgres -c "\COPY employee_salaries FROM './data/data.csv';"
