import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [process.env.RESEND_TO_EMAIL ?? "hello@theanthracite.com"],
      subject: `[Contact] ${subject}`,
      html: `
        <h2 style="font-family:sans-serif">New message from ${name}</h2>
        <p style="font-family:sans-serif"><strong>Email:</strong> ${email}</p>
        <p style="font-family:sans-serif"><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p style="font-family:sans-serif;white-space:pre-wrap">${message}</p>
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
