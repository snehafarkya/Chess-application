# Chess API

## Submission

If you use GitLab, link to the tag `submission-portfolio-01` in your repository:
- Gitlab Repo link: https://gitlab.com/student-group320748/Chess-application/-/tree/be7f944e6b813a6c7c5a39e18cab98b3ea4b46cc/
- Github Repo link: https://github.com/snehafarkya/Chess-application

## Requirements

- [Bun](https://bun.com)
- [Caddy](https://caddyserver.com)
- [xh](https://github.com/ducaale/xh) or curl for testing

## Running

Start the web application server in the folder `web-application-server`:

```sh
cd web-application-server
bun install
bun run dev
```

It listens on `127.0.0.1:3000` and restarts whenever a file changes.
It starts once `src/controller/api.js` and `src/server-view/serialize.js` exist, which `src/app.js` imports.

Start the web server in a second terminal, from this folder:

```sh
caddy run --config web-server/Caddyfile
```

Caddy serves `https://localhost:8443` with its own certificate, which your browser and your HTTP client flag as untrusted.
It forwards every request under `/api/` to the web application server.
Stop either server with `Ctrl+C`.

## Testing

```sh
xh get --verify=no https://localhost:8443/api/board/square square==e1
curl -k "https://localhost:8443/api/board/square?square=e1"
```
