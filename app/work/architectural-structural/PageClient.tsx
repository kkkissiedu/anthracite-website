"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor, type FeaturedProject } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MediaCard from "@/app/components/MediaCard";

gsap.registerPlugin(ScrollTrigger);

type Filter = "All" | "Residential" | "Commercial" | "Industrial";
const FILTERS: Filter[] = ["All", "Residential", "Commercial", "Industrial"];

const DEFAULT_HEADING = "Architectural & Structural Design";
const DEFAULT_SUBTITLE =
  "Precision-engineered designs from concept to construction documentation.";

export default function ArchitecturalStructuralPage({
  heroHeading,
  heroSubtitle,
  projects: initialProjects,
}: {
  heroHeading?: string;
  heroSubtitle?: string;
  projects: FeaturedProject[];
}) {
  const [projects] = useState<FeaturedProject[]>(initialProjects);
  const [filter, setFilter] = useState<Filter>("All");
  const { openModal } = useProjectModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const els = heroRef.current!.querySelectorAll<HTMLElement>("[data-hero]");
      gsap.fromTo(
        Array.from(els),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.15,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter(
          (p) => p.subcategory?.toLowerCase() === filter.toLowerCase()
        );

  useEffect(() => {
    if (!gridRef.current) return;
    ctxRef.current?.revert();

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".proj-card");
    if (!cards.length) return;

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        Array.from(cards),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, gridRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [filtered.length, filter]);

  const handleOpen = useCallback(
    (p: FeaturedProject) => openModal(p as unknown as SanityProject),
    [openModal]
  );

  return (
    <>
      <Navbar />

      <main>
      {/* Hero */}
      <section className="bg-anthracite text-cream pt-36 pb-20 px-6 md:px-8 lg:px-16">
        <div ref={heroRef} className="max-w-[1280px] mx-auto">
          <p
            data-hero
            className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Work
          </p>
          <h1
            data-hero
            className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold leading-none tracking-tight text-cream"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {heroHeading ?? DEFAULT_HEADING}
          </h1>
          <p
            data-hero
            className="mt-8 text-cream/55 max-w-2xl text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {heroSubtitle ?? DEFAULT_SUBTITLE}
          </p>

          {/* Gold accent line */}
          <div data-hero className="mt-12 h-px w-24 bg-gold/50" />
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="bg-anthracite pb-28 px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-12">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  filter === f
                    ? "bg-gold text-anthracite border-gold font-semibold"
                    : "border-cream/20 text-cream/50 hover:border-gold/60 hover:text-cream"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="border border-gold px-12 py-8 text-center">
                <p
                  className="text-gold text-sm tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {projects.length === 0
                    ? "Projects coming soon"
                    : "No projects in this category"}
                </p>
              </div>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
            >
              {filtered.map((project) => {
                const imgSrc = project.mainImage
                  ? urlFor(project.mainImage as Parameters<typeof urlFor>[0]).width(800).url()
                  : null;
                return (
                  <MediaCard
                    key={project._id}
                    image={imgSrc}
                    title={project.title}
                    subcategory={project.subcategory}
                    metadata={[project.client, project.location, project.year]}
                    onClick={() => handleOpen(project)}
                    aspectRatio="4/3"
                    cardClassName="proj-card"
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

