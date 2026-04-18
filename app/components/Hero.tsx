"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const HeroBackground3D = dynamic(() => import("./HeroBackground3D"), {
  ssr: false,
});

const HEADING_WORDS = ["Building", "Ghana's", "Future"];
const GOLD_WORD_INDEX = 2; // "Future"

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Words fade + slide in
      tl.fromTo(
        wordRefs.current.filter(Boolean),
        { opacity: 0, y: 60, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.15 }
      );

      // Subheading
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3"
      );

      // CTAs
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      );

      // Gold line
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: "power2.inOut" },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-anthracite overflow-hidden"
    >
      {/* 3D wireframe building — behind all content */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ opacity: 0.18 }}
        aria-hidden
      >
        <HeroBackground3D />
      </div>

      {/* Dark overlay for legibility (future video support) */}
      <div className="absolute inset-0 bg-anthracite/60 z-[2]" aria-hidden />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,149,42,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-16 text-center">
        {/* Overline */}
        <p
          className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 md:mb-8 font-body"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The Anthracite Limited
        </p>

        {/* Heading */}
        <h1
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[1.05] tracking-tight mb-6 md:mb-8 flex flex-wrap justify-center gap-x-[0.3em]"
          style={{ fontFamily: "var(--font-heading)" }}
          aria-label="Building Ghana's Future"
        >
          {HEADING_WORDS.map((word, i) => (
            <span key={word} className="inline-block">
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className={`inline-block ${
                  i === GOLD_WORD_INDEX
                    ? "text-gold"
                    : "text-cream"
                }`}
                style={{ willChange: "transform, opacity" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="text-cream/60 text-base md:text-lg lg:text-xl max-w-[600px] mx-auto text-center leading-relaxed mt-6 mb-10 font-body"
          style={{ fontFamily: "var(--font-body)", opacity: 0 }}
        >
          Pioneering AI-driven construction and 3D-printed green buildings to
          shape a sustainable, modern Ghana.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          style={{ opacity: 0 }}
        >
          <a
            href="#services"
            className="relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-body font-medium bg-gold text-anthracite hover:bg-gold-highlight transition-colors duration-300 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Services
          </a>
          <a
            href="#projects"
            className="relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-body font-medium border border-gold text-gold hover:bg-gold hover:text-anthracite transition-colors duration-300 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
            style={{ fontFamily: "var(--font-body)" }}
          >
            View Projects
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-cream text-xs tracking-widest uppercase font-body"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-cream to-transparent animate-pulse" />
      </div>

      {/* Looping animated gold gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        aria-hidden
      >
        <div
          ref={lineRef}
          className="h-px w-full gold-gradient-line origin-left"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
