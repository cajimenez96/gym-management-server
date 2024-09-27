import { config } from '@/config';
import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import type { Database } from './supabase';

export class SupabaseService {
	private readonly supabase: SupabaseClient<Database>;

	constructor() {
		this.supabase = createClient<Database>(
			config.supabase.url,
			config.supabase.key,
		);
	}

	getClient(): SupabaseClient<Database> {
		return this.supabase;
	}
}
