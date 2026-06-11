import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { textStats, ping, greeting } from "./tools.js";

/**
 * Build a fresh McpServer with all tools/resources/prompts registered.
 * In stateless HTTP mode we create one per request, so this is a factory.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "{{projectName}}",
    version: "0.1.0",
  });

  server.registerTool(
    "ping",
    {
      title: "Ping",
      description: "Health check. Returns 'pong' and the server timestamp.",
      inputSchema: {},
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(ping(), null, 2) }],
    })
  );

  server.registerTool(
    "text_stats",
    {
      title: "Text statistics",
      description: "Count characters, words, lines and sentences in a piece of text.",
      inputSchema: { text: z.string().describe("The text to analyze") },
    },
    async ({ text }) => ({
      content: [{ type: "text", text: JSON.stringify(textStats(text), null, 2) }],
    })
  );

  server.registerResource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    {
      title: "Greeting",
      description: "A personalized greeting served as an MCP resource.",
    },
    async (uri, { name }) => ({
      contents: [
        {
          uri: uri.href,
          text: greeting(Array.isArray(name) ? name[0] : name),
        },
      ],
    })
  );

  server.registerPrompt(
    "summarize",
    {
      title: "Summarize text",
      description: "Build a prompt that asks the model to summarize some text.",
      argsSchema: { text: z.string().describe("The text to summarize") },
    },
    ({ text }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Summarize the following text in 3 concise bullet points:\n\n${text}`,
          },
        },
      ],
    })
  );

  return server;
}
