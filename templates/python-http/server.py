"""{{projectName}} - an MCP server (Python, streamable HTTP transport).

Scaffolded with mcp-forge. Runs as an HTTP service on /mcp and ships with one
of each MCP primitive as a working reference.
"""

from __future__ import annotations

import os

from mcp.server.fastmcp import FastMCP

import tools

mcp = FastMCP(
    "{{projectName}}",
    host=os.environ.get("HOST", "127.0.0.1"),
    port=int(os.environ.get("PORT", "8000")),
)


@mcp.tool()
def ping() -> dict[str, str]:
    """Health check. Returns 'pong' and the server timestamp."""
    return tools.ping()


@mcp.tool()
def text_stats(text: str) -> dict[str, int]:
    """Count characters, words, lines and sentences in a piece of text."""
    return tools.text_stats(text)


@mcp.resource("greeting://{name}")
def greeting(name: str) -> str:
    """A personalized greeting served as an MCP resource."""
    return tools.greeting(name)


@mcp.prompt()
def summarize(text: str) -> str:
    """Build a prompt that asks the model to summarize some text."""
    return f"Summarize the following text in 3 concise bullet points:\n\n{text}"


def main() -> None:
    # Serves the streamable HTTP app at /mcp.
    mcp.run(transport="streamable-http")


if __name__ == "__main__":
    main()
