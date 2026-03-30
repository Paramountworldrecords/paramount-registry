import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let singleton: SupabaseClient | null = null;

/** Browser-only Supabase client (singleton). Returns null if env vars are missing. */
export function getSupabase(): SupabaseClient | null {
	if (typeof window === 'undefined') return null;
	const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
	const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
	if (!url || !key) return null;
	if (!singleton) {
		singleton = createClient(url, key);
	}
	return singleton;
}
