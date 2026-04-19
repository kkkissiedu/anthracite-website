"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 12, suffix: "+", label: "Projects" },
  { value: 3, suffix: "", label: "Services" },
  { value: 2, suffix: "", label: "Engineers" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const h2Line1Ref = useRef<HTMLDivElement>(null);
  const h2Line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // h2 line-by-line reveal
      gsap.fromTo(
        [h2Line1Ref.current, h2Line2Ref.current],
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Right column fades up
      gsap.fromTo(
        rightRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Gold divider scales in
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 88%",
          },
        }
      );

      // Stats row fades up
      gsap.fromTo(
        statsRowRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: "top 88%",
          },
        }
      );

      // Counter animations
      STATS.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: "top 85%",
          },
          onUpdate() {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-cream text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
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
        01
      </span>

      <div className="max-w-[1280px] mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-12">

          {/* Left — large bold statement */}
          <div>
            <p
              className="text-gold tracking-[0.3em] uppercase text-xs mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              About Us
            </p>
            <h2
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-dark-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <div className="overflow-hidden">
                <div ref={h2Line1Ref} style={{ transform: "translateY(110%)" }}>
                  Ghana&apos;s First{" "}
                  <span className="text-gold">3D-Printed</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <div ref={h2Line2Ref} style={{ transform: "translateY(110%)" }}>
                  Green Estate
                </div>
              </div>
            </h2>
          </div>

          {/* Right — mission paragraph */}
          <div ref={rightRef} style={{ opacity: 0 }}>
            <p
              className="text-dark-text/75 text-base md:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The Anthracite Limited is pioneering Ghana&apos;s first
              3D-printed Green Building estate, fusing Physics-Informed AI,
              computational design, and sustainable construction into a
              complete workflow from digital twin to physical structure.
            </p>
          </div>
        </div>

        {/* Gold horizontal divider */}
        <div
          ref={dividerRef}
          className="h-px gold-gradient-line mb-12 origin-left"
          style={{ opacity: 0 }}
          aria-hidden
        />

        {/* Counters */}
        <div
          ref={statsRowRef}
          className="grid grid-cols-3 gap-6 md:gap-12"
          style={{ opacity: 0 }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span
                  ref={(el) => {
                    counterRefs.current[i] = el;
                  }}
                >
                  0{stat.suffix}
                </span>
              </p>
              <p
                className="mt-3 text-xs uppercase tracking-[0.2em] text-dark-text/55"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
