export const config = {
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
	},
	port: process.env.PORT || 4000,
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`);
	}
}
