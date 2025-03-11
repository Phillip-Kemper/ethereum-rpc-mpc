import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import { callRPC, validateRpcUrl } from "./utils.js";

export const RPC_URL = process.argv[2];
const CHAIN_NAME = process.argv[3];

await validateRpcUrl(RPC_URL);

const server = new McpServer({
  name: "ethereum-rpc-mpc",
  version: "1.0.0"
});

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

// Add a dynamic greeting resource
server.resource(
  "rpc_info",
  "text://rpc_info",
  async (uri: URL, extra: any) => {
    return {
      contents: [{
        uri: uri.href,
        text: `Current RPC URL: ${RPC_URL} for ${CHAIN_NAME}`
      }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
