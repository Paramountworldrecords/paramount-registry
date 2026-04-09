import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Server-only: service role client for trusted inserts (never import in client code). */
export function getServiceRoleClient(): SupabaseClient | null {
	const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
	const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Resolve Supabase user id from Authorization: Bearer <access_token>. */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
	const auth = request.headers.get('authorization');
	if (!auth?.startsWith('Bearer ')) return null;
	const token = auth.slice(7).trim();
	if (!token) return null;
	const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
	const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
	if (!url || !anon) return null;
	const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser(token);
	if (error || !user) return null;
	return user.id;
}
