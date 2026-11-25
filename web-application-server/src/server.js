import { app } from "./app.js";

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
});

console.log(`Web application server listening on ${server.url}`);
