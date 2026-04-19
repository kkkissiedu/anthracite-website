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

const QUERY = `*[_type == "project" && category == "architectural-structural"] | order(_createdAt desc) {
  _id, title, category, subcategory, description, overview,
  mainImage, gallery, videoUrl, videoFile, panorama, model3d,
  client, location, year
}`;

export default function ArchitecturalStructuralPage() {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const { openModal } = useProjectModal();
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    client
      .fetch<SanityProject[]>(QUERY)
      .then((data) => setProjects(data ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
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

    gsap.set(Array.from(cards), { y: 50, opacity: 0 });

    ctxRef.current = gsap.context(() => {
      gsap.to(Array.from(cards), {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      });
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

      {/* Hero */}
      <section className="bg-anthracite text-cream pt-36 pb-20 px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Work
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold leading-none tracking-tight text-cream"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Architectural &amp; <br />
            <span className="text-gold">Structural</span> Work
          </h1>
          <p
            className="mt-8 text-cream/55 max-w-2xl text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Precision-engineered structures informed by physics-based
            simulations, BIM workflows, and real-world performance targets —
            from concept to construction documentation.
          </p>

          {/* Gold accent line */}
          <div className="mt-12 h-px w-24 bg-gold/50" />
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
      style={{ opacity: 0 }}
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
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          {project.subcategory && (
            <span
              className="border border-gold/60 text-gold px-2 py-0.5 text-[10px] tracking-[0.2em] uppercase w-fit"
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
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
