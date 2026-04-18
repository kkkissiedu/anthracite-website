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
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column slides in from left
      gsap.fromTo(
        leftRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Right column slides in from right
      gsap.fromTo(
        rightRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
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
      className="bg-cream text-dark-text py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-20">

          {/* Left — large bold statement */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <p
              className="text-gold tracking-[0.3em] uppercase text-xs mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              About Us
            </p>
            <h2
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-dark-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ghana&apos;s First{" "}
              <span className="text-gold">3D-Printed</span>
              <br />
              Green Estate
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
          className="h-px gold-gradient-line mb-16 md:mb-20 origin-left"
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
