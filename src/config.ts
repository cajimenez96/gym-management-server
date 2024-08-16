import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  port: process.env.PORT || 3002,
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'STRIPE_SECRET_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
