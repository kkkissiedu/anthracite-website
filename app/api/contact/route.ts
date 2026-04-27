import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, subject, message, website } = body ?? {};

    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const { error } = await resend.emails.send({
      // Update DNS records in Resend dashboard before going live with custom domain
      from: "Contact Form <hello@theanthracite.com>",
      to: [process.env.RESEND_TO_EMAIL ?? "hello@theanthracite.com"],
      subject: `[Contact] ${safeSubject}`,
      html: `
        <h2 style="font-family:sans-serif">New message from ${safeName}</h2>
        <p style="font-family:sans-serif"><strong>Email:</strong> ${safeEmail}</p>
        <p style="font-family:sans-serif"><strong>Subject:</strong> ${safeSubject}</p>
        <hr />
        <p style="font-family:sans-serif;white-space:pre-wrap">${safeMessage}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
