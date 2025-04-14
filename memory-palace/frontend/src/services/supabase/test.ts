import 'dotenv/config';
import { testSupabaseConnection } from './testConnection';

// Make environment variables available globally
(global as any).import = { meta: { env: process.env } };

async function runTest() {
  const isConnected = await testSupabaseConnection();
  if (isConnected) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTest();
