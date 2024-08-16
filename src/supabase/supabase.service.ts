import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './supabase';
import { config } from '@/config';

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
