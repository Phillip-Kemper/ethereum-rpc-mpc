import dotenv from 'dotenv';

dotenv.config();
export const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
console.log(`Loaded RPC_URL: ${RPC_URL}`);
