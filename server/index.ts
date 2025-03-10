import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import { RPC_URL } from './constants.js';  // Import the RPC_URL
import { callRPC } from "./utils.js";
import { JSON_RPC_DESCRIPTIONS } from "./descriptions.js";

const server = new McpServer({
  name: "ethereum-rpc-mpc",
  version: "1.0.0"
});

console.log(`Using Ethereum RPC URL: ${RPC_URL}`);

server.tool(
  'eth_getBalance',
  JSON_RPC_DESCRIPTIONS["eth_getBalance"],
  { address: z.string() },
  async ({ address }) => {
    const balance = await callRPC('eth_getBalance', [address, 'latest']);
    return {
      content: [{ type: "text", text: String(balance) }]
    };
  }
);


const transport = new StdioServerTransport();
await server.connect(transport);
