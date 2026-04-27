"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";

gsap.registerPlugin(ScrollTrigger);

type Category =
  | "architectural-structural"
  | "3d-design"
  | "real-estate-construction";

const CATEGORY_LABELS: Record<Category, string> = {
  "architectural-structural": "Architectural & Structural",
  "3d-design": "3D Design",
  "real-estate-construction": "Real Estate & Construction",
};

const CATEGORY_HREFS: Record<Category, string> = {
  "architectural-structural": "/work/architectural-structural",
  "3d-design": "/work/sculptor",
  "real-estate-construction": "/services/real-estate",
};

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="border border-gold px-12 py-8 text-center">
        <p
          className="text-gold text-sm tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Content coming soon
        </p>
      </div>
    </div>
  );
}

export default function Projects({ projects }: { projects: SanityProject[] }) {
  const { openModal } = useProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const h2LineRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = useMemo(() => {
    const seen = new Set<string>();
    const deduped: SanityProject[] = [];
    for (const p of projects) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        deduped.push(p);
      }
    }
    return deduped;
  }, [projects]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
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
            start: "top 78%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!featured.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const cardEls = gridRef.current?.querySelectorAll<HTMLElement>(".fw-card");
      if (!cardEls?.length) return;
      gsap.fromTo(
        Array.from(cardEls),
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
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
  }, [featured]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-anthracite text-cream py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="section-number" data-number="03" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Featured Projects
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              All Featured <span className="text-gold">Projects</span>
            </h2>
          </div>
        </div>

        {/* Content */}
        {featured.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile: carousel — one card at a time */}
            <div className="md:hidden">
              {(() => {
                const project = featured[currentIndex];
                const cat = project.category as Category;
                const imgSrc = project.mainImage
                  ? urlFor(project.mainImage as Parameters<typeof urlFor>[0]).width(800).url()
                  : null;
                return (
                  <div
                    data-gsap="true"
                    className="fw-card group relative overflow-hidden cursor-pointer w-full"
                    onClick={() => openModal(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openModal(project)}
                    aria-label={`Open ${project.title}`}
                  >
                    <div className="relative w-full aspect-[3/4]">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
                          sizes="100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#1a1a1a]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      {/* Mobile overlay: always visible at reduced opacity so image shows through */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/50">
                        <div className="p-6 flex flex-col gap-3">
                          <span className="text-gold text-[10px] tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
                            {CATEGORY_LABELS[cat] ?? cat}
                          </span>
                          <h3 className="text-2xl font-bold text-cream leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            {project.title}
                          </h3>
                          <Link
                            href={CATEGORY_HREFS[cat] ?? "/"}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-flex items-center justify-center min-h-[44px] border border-gold text-gold px-4 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-anthracite focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            VIEW ALL PROJECTS →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              {featured.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentIndex(i => (i - 1 + featured.length) % featured.length)}
                    className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-anthracite transition-colors flex items-center justify-center"
                    aria-label="Previous project"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    {featured.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-gold" : "bg-gold/30"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentIndex(i => (i + 1) % featured.length)}
                    className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-anthracite transition-colors flex items-center justify-center"
                    aria-label="Next project"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* Desktop: existing grid layout — completely unchanged */}
            <div ref={gridRef} className="hidden md:grid md:grid-cols-3 gap-6">
              {featured.map((project) => {
                const cat = project.category as Category;
                const imgSrc = project.mainImage
                  ? urlFor(
                      project.mainImage as Parameters<typeof urlFor>[0]
                    )
                      .width(1200)
                      .url()
                  : null;

                return (
                  <div
                    key={project._id}
                    data-gsap="true"
                    className="fw-card group relative overflow-hidden cursor-pointer"
                    onClick={() => openModal(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openModal(project)}
                    aria-label={`Open ${project.title}`}
                  >
                    <div className="relative w-full aspect-[3/4]">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#1a1a1a]" />
                      )}

                      {/* Subtle permanent vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                      {/* ADM-style slide-up overlay */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-out bg-black/85">
                        <div className="p-6 flex flex-col gap-3">
                          <span
                            className="text-gold text-[10px] tracking-[0.25em] uppercase"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {CATEGORY_LABELS[cat] ?? cat}
                          </span>
                          <h3
                            className="text-2xl md:text-3xl font-bold text-cream leading-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {project.title}
                          </h3>
                          <Link
                            href={CATEGORY_HREFS[cat] ?? "/"}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-block border border-gold text-gold px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-anthracite focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            VIEW ALL PROJECTS →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
