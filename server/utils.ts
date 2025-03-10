import axios from "axios";
import { RPC_URL } from "./constants.js";

/**
 * Makes a JSON-RPC call to the Ethereum endpoint
 * @param {string} method - The RPC method to call
 * @param {Array} params - The parameters to pass to the method
 * @returns {Promise<any>} - The result of the RPC call
 * @throws {Error} - If the RPC call fails or returns an error
 */
export async function callRPC(method: string, params: any[]) {
    if (!method) {
      throw new Error('RPC method is required');
    }
  
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params
    };
  
    try {
      const response = await axios.post(RPC_URL, payload);
      if (response.data.error) {
        const errorMessage = response.data.error.message || 'Unknown RPC error';
        throw new Error(`RPC Error: ${errorMessage}`);
      }
      
      return response.data.result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error(`Failed RPC call to "${method}":`, errorMessage);
      
      error.rpcMethod = method;
      error.rpcParams = params;
      
      throw error;
    }
  }
