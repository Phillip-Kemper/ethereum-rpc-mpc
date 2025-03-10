import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import { RPC_URL } from './constants.js';  // Import the RPC_URL

const server = new McpServer({
  name: "ethereum-rpc-mpc",
  version: "1.0.0"
});

console.log(`Using Ethereum RPC URL: ${RPC_URL}`);

server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [{
      uri: uri.href,
      text: `Hello, ${name}!`
    }]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
