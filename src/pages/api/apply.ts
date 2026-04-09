import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getServiceRoleClient, getUserIdFromRequest } from '../../lib/supabaseServer';

export const prerender = false;

const ADMIN_EMAIL = 'admin@paramountworldrecords.com';
const MAX_LEN = 12000;

function trim(s: unknown, max: number): string {
	const t = String(s ?? '').trim();
	return t.length > max ? t.slice(0, max) : t;
}

export const POST: APIRoute = async ({ request }) => {
	if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid content type' }), {
			status: 415,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Honeypot — bots often fill hidden fields
	if (trim(body.website, 200)) {
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const fullName = trim(body.fullName, 200);
	const email = trim(body.email, 320);
	const phone = trim(body.phone, 80);
	const city = trim(body.city, 200);
	const attemptType = trim(body.attemptType, 120);
	const overview = trim(body.overview, MAX_LEN);
	const recordDetails = trim(body.recordDetails, MAX_LEN);
	const consent = body.consent === true || body.consent === 'true' || body.consent === 'on';

	if (!fullName || !email || !phone || !city || !attemptType || !overview || !recordDetails) {
		return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
	if (!consent) {
		return new Response(JSON.stringify({ ok: false, error: 'Consent is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const userId = await getUserIdFromRequest(request);

	const resendKey = import.meta.env.RESEND_API_KEY as string | undefined;
	const from =
		(import.meta.env.RESEND_FROM as string | undefined)?.trim() || 'Paramount World Records <onboarding@resend.dev>';

	if (!resendKey) {
		return new Response(
			JSON.stringify({
				ok: false,
				error: 'Email delivery is not configured. Add RESEND_API_KEY (and RESEND_FROM) in Vercel environment variables.',
			}),
			{ status: 503, headers: { 'Content-Type': 'application/json' } }
		);
	}

	const resend = new Resend(resendKey);

	const text = [
		`New record application — Paramount World Records`,
		``,
		userId ? `Account-linked user id: ${userId}` : `Guest application (not logged in)`,
		``,
		`Full Name: ${fullName}`,
		`Email: ${email}`,
		`Phone / WhatsApp: ${phone}`,
		`City: ${city}`,
		`Attempt Type: ${attemptType}`,
		``,
		`Applicant Overview:`,
		overview,
		``,
		`Record Attempt Details:`,
		recordDetails,
	].join('\n');

	const { error: sendErr } = await resend.emails.send({
		from,
		to: [ADMIN_EMAIL],
		replyTo: email,
		subject: `PWR — New application from ${fullName}`,
		text,
	});

	if (sendErr) {
		console.error('[apply] Resend error:', sendErr);
		return new Response(JSON.stringify({ ok: false, error: 'Could not send email. Try again shortly.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const service = getServiceRoleClient();
	if (service) {
		const { error: dbErr } = await service.from('applications').insert({
			user_id: userId,
			full_name: fullName,
			email,
			phone,
			city,
			attempt_type: attemptType,
			overview,
			record_details: recordDetails,
			consent: true,
		});
		if (dbErr) {
			console.error('[apply] DB insert failed (email was sent):', dbErr.message);
		}
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
