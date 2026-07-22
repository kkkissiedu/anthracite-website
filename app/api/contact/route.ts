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

/**
 * Branded notification email. Table-based with inline styles — the only
 * layout approach every mail client (Outlook included) renders reliably.
 * Fonts are web-safe stacks: web fonts do not load in most clients.
 */
function renderContactEmail({
  safeName,
  safeEmail,
  safeSubject,
  safeMessage,
  replyHref,
  receivedAt,
}: {
  safeName: string;
  safeEmail: string;
  safeSubject: string;
  safeMessage: string;
  replyHref: string;
  receivedAt: string;
}): string {
  const GOLD = "#c9952a";
  const CREAM = "#f5f0e8";
  const serif = "Georgia,'Times New Roman',Times,serif";
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";

  const field = (label: string, value: string) => `
    <tr>
      <td style="padding:0 0 14px;">
        <p style="margin:0 0 3px;font-family:${sans};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,240,232,0.40);">${label}</p>
        <p style="margin:0;font-family:${sans};font-size:15px;line-height:1.5;color:${CREAM};">${value}</p>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">New enquiry from ${safeName} — ${safeSubject}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#141414;border:1px solid rgba(201,149,42,0.28);">

        <tr>
          <td style="padding:26px 32px 22px;border-bottom:1px solid rgba(201,149,42,0.20);">
            <p style="margin:0;font-family:${serif};font-size:14px;letter-spacing:0.26em;text-transform:uppercase;color:${GOLD};">The Anthracite Limited</p>
            <p style="margin:7px 0 0;font-family:${sans};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,240,232,0.42);">New website enquiry</p>
          </td>
        </tr>

        <tr>
          <td style="padding:30px 32px 22px;">
            <h1 style="margin:0;font-family:${serif};font-weight:normal;font-size:27px;line-height:1.25;color:${CREAM};">${safeName}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${field("Email", `<a href="mailto:${safeEmail}" style="color:${GOLD};text-decoration:none;">${safeEmail}</a>`)}
              ${field("Subject", safeSubject)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:8px 32px 0;">
            <p style="margin:0 0 10px;font-family:${sans};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,240,232,0.40);">Message</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-left:2px solid ${GOLD};padding:2px 0 2px 16px;">
                  <p style="margin:0;font-family:${sans};font-size:15px;line-height:1.65;color:rgba(245,240,232,0.86);white-space:pre-wrap;">${safeMessage}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:30px 32px 32px;">
            <a href="${replyHref}" style="display:inline-block;background-color:${GOLD};color:#0d0d0d;text-decoration:none;padding:14px 28px;font-family:${sans};font-size:11px;font-weight:bold;letter-spacing:0.20em;text-transform:uppercase;">Reply to ${safeName}</a>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px 20px;border-top:1px solid rgba(201,149,42,0.16);">
            <p style="margin:0;font-family:${sans};font-size:11px;line-height:1.6;color:rgba(245,240,232,0.32);">Sent from the contact form at theanthracite.com<br>${receivedAt} · Accra</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
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

    const receivedAt = new Date().toLocaleString("en-GB", {
      timeZone: "Africa/Accra",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const { error } = await resend.emails.send({
      from: "Contact Form <hello@theanthracite.com>",
      to: [process.env.RESEND_TO_EMAIL ?? "hello@theanthracite.com"],
      replyTo: email,
      // Raw (unescaped) subject — HTML entities would render literally in a header
      subject: `[Contact] ${subject}`,
      html: renderContactEmail({
        safeName,
        safeEmail,
        safeSubject,
        safeMessage,
        replyHref: `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
          `Re: ${subject}`
        )}`,
        receivedAt,
      }),
      text: `New enquiry via theanthracite.com\n\nFrom:    ${name}\nEmail:   ${email}\nSubject: ${subject}\nTime:    ${receivedAt} (Accra)\n\n${"-".repeat(48)}\n\n${message}\n`,
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
