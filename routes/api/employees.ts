import { Handlers } from "$fresh/server.ts";
import { getPeopleByName } from "lib/db.ts";

export const handler: Handlers = {
  async GET(req) {
    const name = new URL(req.url).searchParams.get("name") ?? "";
    return Response.json(await getPeopleByName(name));
  },
};
