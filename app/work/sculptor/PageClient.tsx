"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor, type FeaturedProject } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MediaCard from "@/app/components/MediaCard";
import { useSwipe } from "@/app/hooks/useSwipe";

gsap.registerPlugin(ScrollTrigger);

type Filter = "All" | "vr-xr" | "visualization";
const FILTERS: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "vr-xr", label: "VR/XR" },
  { value: "visualization", label: "Visualization" },
];

const DEFAULT_HEADING = "The Sculptor";
const DEFAULT_SUBTITLE = "3D Design & Visualization";

export default function SculptorPage({
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const { openModal } = useProjectModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
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
      : projects.filter((p) => p.subcategory === filter);

  useEffect(() => {
    if (!gridRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    ctxRef.current?.revert();

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".sculpt-card");
    if (!cards.length) return;

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        Array.from(cards),
        { y: 60, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
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

  // Reset carousel index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  const handleOpen = useCallback(
    (p: FeaturedProject) => openModal(p as unknown as SanityProject),
    [openModal]
  );

  const goToNext = () => {
    setDirection('next');
    setCurrentIndex(i => (i + 1) % filtered.length);
  };
  const goToPrev = () => {
    setDirection('prev');
    setCurrentIndex(i => (i - 1 + filtered.length) % filtered.length);
  };
  const { onTouchStart, onTouchEnd } = useSwipe(goToNext, goToPrev);

  return (
    <>
      <Navbar />

      <main id="main-content">
      {/* Hero — dramatic dark */}
      <section className="relative bg-anthracite text-cream pt-36 pb-24 px-6 md:px-8 lg:px-16 overflow-hidden">
        {/* Background grid decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#C9952A 1px, transparent 1px), linear-gradient(90deg, #C9952A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div ref={heroRef} className="relative max-w-[1280px] mx-auto">
          <p
            data-hero
            className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
          >
            3D Design Studio
          </p>

          <h1
            data-hero
            className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[8.5rem] font-bold leading-none tracking-tight text-cream text-balance"
          >
            {heroHeading ?? DEFAULT_HEADING}
          </h1>

          <div data-hero className="mt-10 max-w-xl">
            <p className="text-cream/55 text-base leading-relaxed">
              {heroSubtitle ?? DEFAULT_SUBTITLE}
            </p>
          </div>

          {/* Decorative element */}
          <div data-hero className="mt-14 flex items-center gap-4">
            <div className="h-px w-12 bg-gold/60" />
            <span
              className="text-gold/60 text-[10px] tracking-[0.3em] uppercase"
            >
              A sister studio of The Anthracite Limited
            </span>
          </div>
        </div>
      </section>

      {/* Filters + Masonry grid */}
      <section className="bg-anthracite pb-28 px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-12">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={`px-5 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  filter === value
                    ? "bg-gold text-anthracite border-gold font-semibold"
                    : "border-cream/20 text-cream/50 hover:border-gold/60 hover:text-cream"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile: single-item slideshow */}
          <div className="md:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <div className="border border-gold px-12 py-8 text-center">
                  <p className="text-gold text-sm tracking-[0.2em] uppercase">
                    {projects.length === 0 ? "Projects coming soon" : "No projects in this category"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {(() => {
                  const project = filtered[currentIndex] ?? filtered[0];
                  const tall = currentIndex % 3 === 1;
                  const imgSrc = project.mainImage
                    ? urlFor(project.mainImage).width(900).url()
                    : null;
                  return (
                    <div
                      key={currentIndex}
                      className={prefersReducedMotion ? '' : direction === 'next' ? 'slide-enter-left' : 'slide-enter-right'}
                    >
                      <MediaCard
                        image={imgSrc}
                        title={project.title}
                        subcategory={project.subcategory}
                        metadata={[project.client, project.year]}
                        onClick={() => handleOpen(project)}
                        aspectRatio={tall ? "3/4" : "4/3"}
                        cardClassName="sculpt-card w-full"
                        showAccent
                        sizes="100vw"
                      />
                    </div>
                  );
                })()}
                {filtered.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={goToPrev}
                      className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-anthracite transition-colors flex items-center justify-center"
                      aria-label="Previous project"
                    >
                      ←
                    </button>
                    <div className="flex gap-2">
                      {filtered.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-gold" : "bg-gold/30"}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={goToNext}
                      className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-anthracite transition-colors flex items-center justify-center"
                      aria-label="Next project"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Desktop: masonry grid — unchanged */}
          <div className="hidden md:block">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <div className="border border-gold px-12 py-8 text-center">
                  <p className="text-gold text-sm tracking-[0.2em] uppercase">
                    {projects.length === 0
                      ? "Projects coming soon"
                      : "No projects in this category"}
                  </p>
                </div>
              </div>
            ) : (
              <div
                ref={gridRef}
                style={{
                  columns: "300px",
                  columnGap: "24px",
                  minHeight: "400px",
                }}
              >
                {filtered.map((project, i) => {
                  const tall = i % 3 === 1;
                  const imgSrc = project.mainImage
                    ? urlFor(project.mainImage).width(900).url()
                    : null;
                  return (
                    <MediaCard
                      key={project._id}
                      image={imgSrc}
                      title={project.title}
                      subcategory={project.subcategory}
                      metadata={[project.client, project.year]}
                      onClick={() => handleOpen(project)}
                      aspectRatio={tall ? "3/4" : "4/3"}
                      cardClassName="sculpt-card mb-6"
                      wrapperStyle={{ breakInside: "avoid" }}
                      showAccent
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

