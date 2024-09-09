import { Handlers } from "$fresh/server.ts";
import { getAveragePayByYear } from "lib/db.ts";
import { currentYear } from "lib/constants.ts";

export const handler: Handlers = {
  async GET(req) {
    const year = new URL(req.url).searchParams.get("year");
    const rows = await getAveragePayByYear(year ? parseInt(year) : currentYear);
    return Response.json(rows.filter((row) => row.title));
  },
};
