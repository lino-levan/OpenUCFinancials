import { Handlers } from "$fresh/server.ts";
import { getAveragePayByTitle } from "lib/db.ts";

export const handler: Handlers = {
  async GET(req) {
    const year = new URL(req.url).searchParams.get("year");
    const rows = await getAveragePayByTitle(year ? parseInt(year) : 2023);
    return Response.json(rows);
  },
};
