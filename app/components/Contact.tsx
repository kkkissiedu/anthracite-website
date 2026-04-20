"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { triggerSectionTransition } from "@/lib/sectionTransition";

gsap.registerPlugin(ScrollTrigger);

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

type ContactProps = {
  contactLabel?: string;
  contactHeading?: string;
  contactHeadingGoldWord?: string;
  contactSubtext?: string;
  contactEmail?: string;
  contactLocation?: string;
};

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/theanthracite",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/theanthracite",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/theanthracite",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

const INPUT_CLASS =
  "w-full bg-[#141414] border border-gold/30 focus:border-gold text-cream placeholder:text-cream/30 px-4 py-3 outline-none transition-colors duration-300 font-body text-sm";

export default function Contact({
  contactLabel = "Get In Touch",
  contactHeading = "Let's Build Together",
  contactHeadingGoldWord = "Together",
  contactSubtext = "We're pioneering the future of construction in Ghana. Reach out to discuss your project, partnership, or investment opportunities.",
  contactEmail = "hello@theanthracite.com",
  contactLocation = "Kumasi, Ghana",
}: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Split heading at gold word
  const goldIdx = contactHeading.indexOf(contactHeadingGoldWord);
  let headingLine1 = contactHeading;
  let headingLine2 = "";
  if (goldIdx !== -1) {
    headingLine1 = contactHeading.slice(0, goldIdx).trim();
    headingLine2 = contactHeading.slice(goldIdx).trim();
  }
  const goldInLine2 = headingLine2.indexOf(contactHeadingGoldWord) !== -1;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left col (heading + info) slides in from left
      gsap.fromTo(
        leftColRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
            onEnter: () => triggerSectionTransition(),
          },
        }
      );

      // Right col (form) slides in from right — simultaneously
      gsap.fromTo(
        rightColRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-anthracite py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <span
        aria-hidden
        className="absolute top-0 right-0 leading-none font-bold text-gold select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "180px",
          opacity: 0.04,
        }}
      >
        05
      </span>

      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — heading + company info */}
          <div ref={leftColRef} className="flex flex-col gap-10" style={{ opacity: 0 }}>
            <div>
              <p
                className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {contactLabel}
              </p>
              <h2
                className="text-cream text-4xl md:text-5xl lg:text-6xl leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {headingLine1 && (
                  <div className="overflow-hidden">
                    <div>{headingLine1}</div>
                  </div>
                )}
                {headingLine2 && (
                  <div className="overflow-hidden">
                    <div>
                      {goldInLine2 ? (
                        <>
                          {headingLine2.slice(0, headingLine2.indexOf(contactHeadingGoldWord))}
                          <span className="text-gold">{contactHeadingGoldWord}</span>
                          {headingLine2.slice(headingLine2.indexOf(contactHeadingGoldWord) + contactHeadingGoldWord.length)}
                        </>
                      ) : (
                        headingLine2
                      )}
                    </div>
                  </div>
                )}
              </h2>
            </div>

            <div>
              <p
                className="text-cream/50 text-sm leading-relaxed max-w-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {contactSubtext}
              </p>
            </div>

            {/* Info items */}
            <div className="flex flex-col gap-6">
              <div>
                <p
                  className="text-gold text-xs tracking-widest uppercase mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Email
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-cream/80 hover:text-gold transition-colors duration-300 text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {contactEmail}
                </a>
              </div>

              <div>
                <p
                  className="text-gold text-xs tracking-widest uppercase mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Location
                </p>
                <p
                  className="text-cream/80 text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {contactLocation}
                </p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="w-12 h-px bg-gold" />

            {/* Social links */}
            <div>
              <p
                className="text-gold text-xs tracking-widest uppercase mb-4"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-cream/40 hover:text-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div ref={rightColRef} style={{ opacity: 0 }}>
            {status === "success" ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <div className="w-12 h-px bg-gold" />
                <h3
                  className="text-cream text-2xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Message Received
                </h3>
                <p
                  className="text-cream/50 text-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Thank you for reaching out. We&apos;ll be in touch shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-gold text-sm tracking-widest uppercase border-b border-gold/40 hover:border-gold transition-colors duration-300 pb-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-cream/50 text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={INPUT_CLASS}
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-cream/50 text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={INPUT_CLASS}
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-cream/50 text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={INPUT_CLASS}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-cream/50 text-xs tracking-widest uppercase mb-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className={`${INPUT_CLASS} resize-none`}
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                {status === "error" && (
                  <p
                    className="text-red-400 text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gold text-anthracite hover:bg-gold-highlight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 px-8 py-4 text-sm tracking-widest uppercase font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
