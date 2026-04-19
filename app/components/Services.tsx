"use client";

import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

function ArchitectureIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4" y="20" width="28" height="12" rx="1" stroke="#C9952A" strokeWidth="1.5" />
      <rect x="10" y="12" width="16" height="8" stroke="#C9952A" strokeWidth="1.5" />
      <path d="M18 4L28 12H8L18 4Z" stroke="#C9952A" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="15" y="24" width="6" height="8" stroke="#C9952A" strokeWidth="1.5" />
    </svg>
  );
}

function SculptorIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 4L32 12V24L18 32L4 24V12L18 4Z"
        stroke="#C9952A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M18 4V32" stroke="#C9952A" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M4 12L18 20L32 12" stroke="#C9952A" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="18" cy="18" r="3" stroke="#C9952A" strokeWidth="1.5" />
    </svg>
  );
}

function RealEstateIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="15" r="6" stroke="#C9952A" strokeWidth="1.5" />
      <circle cx="16" cy="15" r="2" stroke="#C9952A" strokeWidth="1.5" />
      <path
        d="M16 21C16 21 8 27 8 33H24C24 27 16 21 16 21Z"
        stroke="#C9952A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M24 10L28 8V26" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 12H30" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 16H30" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 20H30" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const SERVICES = [
  {
    Icon: ArchitectureIcon,
    title: "Architectural & Structural Design",
    subtitle: null,
    description:
      "From concept to construction documentation — precision-engineered designs informed by physics-based simulations, computational methods, and real-world performance targets.",
    href: "/work/architectural-structural",
  },
  {
    Icon: SculptorIcon,
    title: "3D Design Services",
    subtitle: "via The Sculptor",
    description:
      "High-fidelity 3D modelling, digital twins, and parametric design through our sister studio, enabling seamless transitions from virtual model to physical printed structure.",
    href: "/work/sculptor",
  },
  {
    Icon: RealEstateIcon,
    title: "Real Estate & Construction",
    subtitle: null,
    description:
      "End-to-end real estate development and construction management, anchored by our flagship 3D-printed Green Building estate — built for durability, sustainability, and scale.",
    href: "/services/real-estate",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2LineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // h2 reveal
      gsap.fromTo(
        h2LineRef.current,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-anthracite text-cream py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
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
        02
      </span>

      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="mb-12">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            What We Do
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream max-w-xl"
              style={{ fontFamily: "var(--font-heading)", transform: "translateY(110%)" }}
            >
              Our <span className="text-gold">Services</span>
            </h2>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

type ServiceItem = (typeof SERVICES)[number];

const ServiceCard = forwardRef<HTMLDivElement, { service: ServiceItem }>(
  ({ service }, ref) => {
    const { Icon, title, subtitle, description, href } = service;

    return (
      <div
        ref={ref}
        style={{ opacity: 0 }}
        className="
          group relative flex flex-col gap-6 p-8 md:p-10
          border border-cream/10
          transition-all duration-500 ease-out
          hover:border-gold
          before:absolute before:inset-0
          before:border before:border-gold before:opacity-0
          before:scale-[0.97] before:transition-all before:duration-500
          hover:before:opacity-100 hover:before:scale-100
        "
      >
        {/* Icon */}
        <div className="transition-transform duration-300 group-hover:scale-110 w-fit">
          <Icon />
        </div>

        {/* Title */}
        <div>
          <h3
            className="text-xl md:text-2xl font-semibold text-cream leading-snug mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className="text-gold text-xs tracking-widest uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p
          className="text-cream/55 text-sm leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>

        {/* CTA */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all duration-300 w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Explore →
        </Link>

        {/* Bottom gold accent line */}
        <div
          className="h-px bg-gold scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
          aria-hidden
        />
      </div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";
