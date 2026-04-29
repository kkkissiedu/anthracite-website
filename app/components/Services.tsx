"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ServiceId } from "@/context/ServiceModalContext";

gsap.registerPlugin(ScrollTrigger);

type ServicesProps = {
  servicesLabel?: string;
  servicesHeading?: string;
  servicesHeadingGoldWord?: string;
  serviceOneTitle?: string;
  serviceOneSubtitle?: string | null;
  serviceOneDescription?: string;
  serviceTwoTitle?: string;
  serviceTwoSubtitle?: string | null;
  serviceTwoDescription?: string;
  serviceThreeTitle?: string;
  serviceThreeSubtitle?: string | null;
  serviceThreeDescription?: string;
};

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

const SERVICE_HREFS: Record<ServiceId, string> = {
  "architectural-structural": "/work/architectural-structural",
  "sculptor": "/work/sculptor",
  "real-estate": "/services/real-estate",
};

export default function Services({
  servicesLabel = "What We Do",
  servicesHeading = "Our Services",
  servicesHeadingGoldWord = "Services",
  serviceOneTitle = "Architectural & Structural Design",
  serviceOneSubtitle = null,
  serviceOneDescription = "From concept to construction documentation — precision-engineered designs informed by physics-based simulations, computational methods, and real-world performance targets.",
  serviceTwoTitle = "3D Design Services",
  serviceTwoSubtitle = "via The Sculptor",
  serviceTwoDescription = "High-fidelity 3D modelling, digital twins, and parametric design through our sister studio, enabling seamless transitions from virtual model to physical printed structure.",
  serviceThreeTitle = "Real Estate & Construction",
  serviceThreeSubtitle = null,
  serviceThreeDescription = "End-to-end real estate development and construction management, anchored by our flagship 3D-printed Green Building estate — built for durability, sustainability, and scale.",
}: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2LineRef = useRef<HTMLDivElement>(null);
  const exploreButtonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const services = [
    {
      id: "architectural-structural" as ServiceId,
      Icon: ArchitectureIcon,
      title: serviceOneTitle,
      subtitle: serviceOneSubtitle ?? null,
      description: serviceOneDescription,
    },
    {
      id: "sculptor" as ServiceId,
      Icon: SculptorIcon,
      title: serviceTwoTitle,
      subtitle: serviceTwoSubtitle ?? null,
      description: serviceTwoDescription,
    },
    {
      id: "real-estate" as ServiceId,
      Icon: RealEstateIcon,
      title: serviceThreeTitle,
      subtitle: serviceThreeSubtitle ?? null,
      description: serviceThreeDescription,
    },
  ];

  // Split heading at gold word
  const goldIdx = servicesHeading.indexOf(servicesHeadingGoldWord);

  useEffect(() => {
    if (!h2LineRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(h2LineRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: h2LineRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

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

      // Pulse animation on explore buttons when section enters viewport
      gsap.fromTo(
        exploreButtonRefs.current.filter(Boolean),
        { scale: 1 },
        {
          scale: 1.08,
          duration: 0.4,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 2,
          delay: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingNode =
    goldIdx !== -1 ? (
      <>
        {servicesHeading.slice(0, goldIdx)}
        <span className="text-gold">{servicesHeadingGoldWord}</span>
        {servicesHeading.slice(goldIdx + servicesHeadingGoldWord.length)}
      </>
    ) : (
      servicesHeading
    );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-anthracite text-cream py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="section-number" data-number="02" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">

        {/* Section header */}
        <div className="mb-12">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
            {servicesLabel}
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              data-gsap="true"
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream max-w-xl"
            >
              {headingNode}
            </h2>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              href={SERVICE_HREFS[service.id]}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              buttonRef={(el) => {
                exploreButtonRefs.current[i] = el;
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

type ServiceItem = {
  id: ServiceId;
  Icon: () => React.ReactElement;
  title: string;
  subtitle: string | null;
  description: string;
};

const ServiceCard = forwardRef<
  HTMLDivElement,
  { service: ServiceItem; href: string; buttonRef?: (el: HTMLAnchorElement | null) => void }
>(({ service, href, buttonRef }, ref) => {
  const { Icon, title, subtitle, description } = service;
  const router = useRouter();

  return (
    <div
      ref={ref}
      data-gsap="true"
      onClick={() => router.push(href)}
      className="
        group relative flex flex-col gap-6 p-8 md:p-10
        border border-cream/10
        transition-all duration-500 ease-out
        hover:border-gold
        before:absolute before:inset-0
        before:border before:border-gold before:opacity-0
        before:scale-[0.97] before:transition-all before:duration-500
        hover:before:opacity-100 hover:before:scale-100
        before:pointer-events-none
        cursor-pointer
      "
    >
      {/* Icon */}
      <div className="transition-transform duration-300 group-hover:scale-110 w-fit">
        <Icon />
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-cream leading-snug mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gold text-xs tracking-widest uppercase">
            {subtitle}
          </p>
        )}
      </div>

      {/* Description */}
      <p className="text-cream/55 text-sm leading-relaxed flex-1">
        {description}
      </p>

      {/* CTA — Link navigates to sub-page */}
      <Link
        ref={buttonRef}
        href={href}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all duration-300 w-fit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm min-h-[48px] px-6 text-sm"
        aria-label={`Explore ${title}`}
      >
        EXPLORE PROJECTS →
      </Link>

      {/* Bottom gold accent line */}
      <div
        className="h-px bg-gold scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </div>
  );
});
ServiceCard.displayName = "ServiceCard";
