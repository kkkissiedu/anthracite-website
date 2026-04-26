"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client, urlFor } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

gsap.registerPlugin(ScrollTrigger);

type Filter = "All" | "Residential" | "Commercial" | "Industrial";
const FILTERS: Filter[] = ["All", "Residential", "Commercial", "Industrial"];

const QUERY = `*[_type == "project" && category == "architectural-structural"] | order(order asc) {
  _id, title, category, subcategory, description, overview,
  mainImage, gallery, videoUrl, videoFile, panorama, model3d,
  client, location, year, tools
}`;

const DEFAULT_HEADING = "Architectural & Structural Design";
const DEFAULT_SUBTITLE =
  "Precision-engineered designs from concept to construction documentation.";

export default function ArchitecturalStructuralPage({
  heroHeading,
  heroSubtitle,
}: {
  heroHeading?: string;
  heroSubtitle?: string;
}) {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const { openModal } = useProjectModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    client
      .fetch<SanityProject[]>(QUERY)
      .then((data) => setProjects(data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

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
    (p: SanityProject) => openModal(p),
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
          {loading ? null : filtered.length === 0 ? (
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: SanityProject;
  onOpen: (p: SanityProject) => void;
}) {
  const imgSrc = project.mainImage
    ? urlFor(project.mainImage as Parameters<typeof urlFor>[0])
        .width(800)
        .url()
    : null;

  return (
    <div
      className="proj-card group relative overflow-hidden cursor-pointer"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      aria-label={`View ${project.title}`}
    >
      <div className="relative w-full aspect-[4/3]">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* ADM-style slide-up overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-out bg-black/85">
          <div className="p-5 flex flex-col gap-2">
            {project.subcategory && (
              <span
                className="text-gold text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.subcategory}
              </span>
            )}
            <h3
              className="text-xl md:text-2xl font-bold text-cream leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h3>
            <div
              className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-cream/50 tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.client && <span>{project.client}</span>}
              {project.location && <span>{project.location}</span>}
              {project.year && <span>{project.year}</span>}
            </div>
            <div className="flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase mt-1">
              View Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
