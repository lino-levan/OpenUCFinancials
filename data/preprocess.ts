type Cell = [
  number,
  string,
  string,
  string,
  string,
  number,
  number,
  number,
  number,
];
let data: Cell[] = [];

for (let year = 2010; year <= 2023; year++) {
  const raw = JSON.parse(await Deno.readTextFile(`./data/${year}.json`));
  const mapped = raw.map(({ cell }: { cell: string[] }) => [
    parseInt(cell[1]),
    cell[2],
    cell[3],
    cell[4],
    cell[5],
    parseFloat(cell[6]),
    parseFloat(cell[7]),
    parseFloat(cell[8]),
    parseFloat(cell[9]),
  ]);
  data = [...data, ...mapped];
}

function createReadableStreamFromString(string: string) {
  return new ReadableStream({
    start(controller) {
      // Convert the string to a Uint8Array
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(string);

      // Enqueue the Uint8Array into the stream
      controller.enqueue(uint8Array);

      // Close the stream
      controller.close();
    },
  });
}

// Compress data using web standard stream compression
const streamData = createReadableStreamFromString(JSON.stringify(data))
  .pipeThrough(new CompressionStream("gzip"));

// Write compressed data to file
const file = Deno.createSync("./data/data.json.gz");
const writerClosed = streamData.pipeTo(file.writable);
await writerClosed;
