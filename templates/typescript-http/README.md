# {{projectName}}

An [MCP](https://modelcontextprotocol.io) server (TypeScript, **streamable HTTP** transport), scaffolded with [mcp-forge](https://github.com/G12789/mcp-forge).

Runs as a normal HTTP service (great for remote / hosted deployments) and ships with one of each MCP primitive:

- **Tool** `ping` — health check
- **Tool** `text_stats` — count characters / words / lines / sentences (offline)
- **Resource** `greeting://{name}` — dynamic read-only data
- **Prompt** `summarize` — a reusable prompt template

## Quick start

```bash
npm install
npm run dev          # start on http://localhost:3000/mcp
npm test             # run unit tests
npm run build        # compile to dist/
```

## Test it

Confirm it's alive:

```bash
curl http://localhost:3000/health
```

Initialize an MCP session (stateless):

```bash
curl -s http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'
```

Or point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `http://localhost:3000/mcp`:

```bash
npm run inspect
```

## Use it in Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "{{projectName}}": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Stateless vs stateful

This template uses **stateless** mode: a fresh server + transport per request, which is the simplest to deploy and scales horizontally. If you need resumable streams / sessions, give the transport a `sessionIdGenerator` and keep transports in a map keyed by the `mcp-session-id` header — see the [SDK docs](https://github.com/modelcontextprotocol/typescript-sdk#streamable-http).

## Add your own tool

Open `src/server.ts` and register another tool inside `createServer()`. Keep heavy logic in `src/tools.ts` (pure functions) so it stays easy to test.

## License

MIT
