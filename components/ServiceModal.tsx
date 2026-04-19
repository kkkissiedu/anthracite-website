"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useServiceModal, type ServiceId } from "@/context/ServiceModalContext";

type ServiceData = {
  heading: string;
  description: string;
  services: string[];
  ctaLabel: string;
  ctaHref: string;
};

const SERVICE_CONTENT: Record<ServiceId, ServiceData> = {
  "architectural-structural": {
    heading: "Architectural & Structural Design",
    description:
      "From concept to construction documentation, we deliver precision-engineered designs informed by physics-based simulations, computational methods, and real-world performance targets. Our workflow integrates structural analysis in ABAQUS and ProtaStructure with BIM documentation in Autodesk Revit and AutoCAD.",
    services: [
      "Structural Analysis & Design",
      "BIM Documentation",
      "Construction Drawings",
      "Seismic & Load Analysis",
      "Foundation Design",
      "Structural Detailing",
    ],
    ctaLabel: "View Our Structural Projects →",
    ctaHref: "/work/architectural-structural",
  },
  sculptor: {
    heading: "The Sculptor — 3D Design Services",
    description:
      "High-fidelity 3D modelling, digital twins, and parametric design through our sister studio. We bridge the gap between virtual model and physical structure, producing assets for visualisation, construction simulation, and additive manufacturing workflows.",
    services: [
      "3D Modelling & Visualisation",
      "Digital Twins",
      "Parametric Design",
      "Synthetic Data Generation",
      "VR/AR Experiences",
      "3D Printing Preparation",
    ],
    ctaLabel: "View 3D Design Work →",
    ctaHref: "/work/sculptor",
  },
  "real-estate": {
    heading: "Real Estate & Construction",
    description:
      "End-to-end real estate development and construction management, anchored by our flagship 3D-printed Green Building estate. We manage projects from site acquisition through to handover, built for durability, sustainability, and scale across Ghana and West Africa.",
    services: [
      "Real Estate Development",
      "Construction Management",
      "Green Building Design",
      "3D-Printed Construction",
      "Project Management",
      "Sustainability Consulting",
    ],
    ctaLabel: "Explore Real Estate Services →",
    ctaHref: "/services/real-estate",
  },
};

export default function ServiceModal() {
  const { activeServiceId, closeServiceModal } = useServiceModal();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const animateOpen = useCallback(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    ).fromTo(
      panelRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      "-=0.15"
    );
  }, []);

  const animateClose = useCallback(
    (onComplete: () => void) => {
      const tl = gsap.timeline({ onComplete });
      tl.to(panelRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }).to(
        backdropRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.15"
      );
    },
    []
  );

  const handleClose = useCallback(() => {
    animateClose(closeServiceModal);
  }, [animateClose, closeServiceModal]);

  // Open animation
  useEffect(() => {
    if (!activeServiceId) return;
    document.body.style.overflow = "hidden";
    animateOpen();
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeServiceId, animateOpen]);

  // Escape key
  useEffect(() => {
    if (!activeServiceId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeServiceId, handleClose]);

  if (!activeServiceId) return null;

  const content = SERVICE_CONTENT[activeServiceId];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ opacity: 0 }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={content.heading}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl bg-anthracite/95 backdrop-blur-md border border-cream/10 p-8 md:p-10 max-h-[90vh] overflow-y-auto"
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-cream/40 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm p-1"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Heading */}
        <h2
          className="text-2xl sm:text-3xl font-bold text-cream mb-6 leading-tight pr-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {content.heading}
        </h2>

        {/* Gold divider */}
        <div className="h-px w-12 bg-gold mb-6" />

        {/* Description */}
        <p
          className="text-cream/70 text-sm leading-relaxed mb-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {content.description}
        </p>

        {/* Services list */}
        <div className="mb-8">
          <p
            className="text-gold text-xs tracking-[0.25em] uppercase mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Services
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.services.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-cream/60 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={content.ctaHref}
          onClick={handleClose}
          className="inline-block border border-gold text-gold px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-anthracite focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {content.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
