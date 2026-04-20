"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AboutProps = {
  aboutLabel?: string;
  aboutHeading?: string;
  aboutHeadingGoldWords?: string;
  aboutBody?: string;
  statOneValue?: string;
  statOneLabel?: string;
  statTwoValue?: string;
  statTwoLabel?: string;
  statThreeValue?: string;
  statThreeLabel?: string;
};

function parseStatValue(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  return match
    ? { value: parseInt(match[1], 10), suffix: match[2] }
    : { value: 0, suffix: "" };
}

export default function About({
  aboutLabel = "About Us",
  aboutHeading = "Ghana's First 3D-Printed Green Estate",
  aboutHeadingGoldWords = "3D-Printed",
  aboutBody = "The Anthracite Limited is pioneering Ghana's first 3D-printed Green Building estate, fusing Physics-Informed AI, computational design, and sustainable construction into a complete workflow from digital twin to physical structure.",
  statOneValue = "12+",
  statOneLabel = "Projects",
  statTwoValue = "3",
  statTwoLabel = "Services",
  statThreeValue = "2",
  statThreeLabel = "Engineers",
}: AboutProps) {
  const stats = [
    { ...parseStatValue(statOneValue), label: statOneLabel },
    { ...parseStatValue(statTwoValue), label: statTwoLabel },
    { ...parseStatValue(statThreeValue), label: statThreeLabel },
  ];

  // Split heading at gold word: everything before+including gold = line 1, after = line 2
  const goldWord = aboutHeadingGoldWords;
  const goldIdx = aboutHeading.indexOf(goldWord);
  let line1Before = aboutHeading;
  let line1Gold = "";
  let line2 = "";
  if (goldIdx !== -1) {
    line1Before = aboutHeading.slice(0, goldIdx);
    line1Gold = goldWord;
    line2 = aboutHeading.slice(goldIdx + goldWord.length).trim();
  }

  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const h2Line1Ref = useRef<HTMLDivElement>(null);
  const h2Line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      stats.forEach((stat, i) => {
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
      setTimeout(() => { ScrollTrigger.refresh(); }, 200);
    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {aboutLabel}
            </p>
            <h2
              className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-dark-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <div className="overflow-hidden">
                <div ref={h2Line1Ref}>
                  {line1Before}
                  {line1Gold && <span className="text-gold">{line1Gold}</span>}
                </div>
              </div>
              {line2 && (
                <div className="overflow-hidden">
                  <div ref={h2Line2Ref}>
                    {line2}
                  </div>
                </div>
              )}
            </h2>
          </div>

          {/* Right — mission paragraph */}
          <div ref={rightRef}>
            <p
              className="text-dark-text/75 text-base md:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {aboutBody}
            </p>
          </div>
        </div>

        {/* Gold horizontal divider */}
        <div
          ref={dividerRef}
          className="h-px gold-gradient-line mb-12 origin-left"
          aria-hidden
        />

        {/* Counters */}
        <div
          ref={statsRowRef}
          className="grid grid-cols-3 gap-6 md:gap-12"
        >
          {stats.map((stat, i) => (
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
