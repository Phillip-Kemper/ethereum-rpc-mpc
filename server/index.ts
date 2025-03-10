import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import { RPC_URL } from './constants.js';  // Import the RPC_URL
import { callRPC } from "./utils.js";

const server = new McpServer({
  name: "ethereum-rpc-mpc",
  version: "1.0.0"
});

console.log(`Using Ethereum RPC URL: ${RPC_URL}`);

server.tool(
  'generic_eth_json_rpc',
  `Parameters:
- method (string, REQUIRED): The JSON-RPC method to execute.
- params (array, REQUIRED): The parameters for the JSON-RPC method.`,
  {
    method: z.string(),
    params: z.array(z.string())
  },
  async ({ method, params }) => {
    try {
      const result = await callRPC(method, params);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error: any) {
      return {
        content: [{
          type: "text",
          text: `Error executing RPC call: ${error.message || 'Unknown error'}`
        }]
      };
    }
  }
);


const transport = new StdioServerTransport();
await server.connect(transport);
