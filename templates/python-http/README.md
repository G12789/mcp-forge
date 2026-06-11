# {{projectName}}

An [MCP](https://modelcontextprotocol.io) server (Python, **streamable HTTP** transport), scaffolded with [mcp-forge](https://github.com/G12789/mcp-forge).

Runs as an HTTP service (great for remote / hosted deployments) and ships with one of each MCP primitive:

- **Tool** `ping` — health check
- **Tool** `text_stats` — count characters / words / lines / sentences (offline)
- **Resource** `greeting://{name}` — dynamic read-only data
- **Prompt** `summarize` — a reusable prompt template

## Quick start

```bash
# with uv (recommended)
uv sync
uv run python server.py      # serves http://127.0.0.1:8000/mcp
uv run pytest

# or with pip
pip install -e ".[dev]"
python server.py
pytest
```

Configure host/port via env vars (`HOST`, `PORT`) or a `.env` file.

## Test it

Point the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) at `http://127.0.0.1:8000/mcp`, or initialize a session with curl:

```bash
curl -s http://127.0.0.1:8000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'
```

## Use it in Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "{{projectName}}": {
      "url": "http://127.0.0.1:8000/mcp"
    }
  }
}
```

## Add your own tool

Open `server.py` and decorate a function with `@mcp.tool()`. Keep heavy logic in `tools.py` (pure functions) so it stays easy to test.

## License

MIT
