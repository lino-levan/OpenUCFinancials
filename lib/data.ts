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

const file = Deno.openSync("./data/data.json.gz", { read: true });
const stream = file.readable.pipeThrough(new DecompressionStream("gzip"))
  .pipeThrough(new TextDecoderStream());
const reader = stream.getReader();
let rawData = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  rawData += value;
}

export const data: Cell[] = JSON.parse(rawData);

export const dataByYear = Object.groupBy(data, (cell) => cell[0]);
