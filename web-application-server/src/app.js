import { Hono } from "hono";
import api from "./controller/api.js";
import { FenError } from "./errors.js";
import { serializeError, serializeFenError } from "./server-view/serialize.js";

export const app = new Hono();

app.route("/api", api);

app.onError((error, c) => {
  if (error instanceof FenError) return Response.json(serializeFenError(error), { status: 400 });
  console.error(error);
  return Response.json(serializeError(error), { status: 500 });
});
