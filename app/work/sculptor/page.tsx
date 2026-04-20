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

type Filter = "All" | "Digital Twins" | "Parametric Design" | "Visualisation";
const FILTERS: Filter[] = [
  "All",
  "Digital Twins",
  "Parametric Design",
  "Visualisation",
];

const QUERY = `*[_type == "project" && category == "3d-design"] | order(order asc) {
  _id, title, category, subcategory, description, overview,
  mainImage, gallery, videoUrl, videoFile, panorama, model3d,
  client, location, year
}`;

export default function SculptorPage() {
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
      setTimeout(() => { ScrollTrigger.refresh(); }, 200);
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

        <div className="relative max-w-[1280px] mx-auto">
          <p
            className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            3D Design Studio
          </p>

          <h1
            className="text-6xl sm:text-7xl md:text-[6rem] lg:text-[8.5rem] font-bold leading-none tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-gold">The</span>
            <br />
            <span className="text-cream">Sculptor</span>
          </h1>

          <div className="mt-10 max-w-xl">
            <p
              className="text-cream/55 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              High-fidelity 3D design, digital twins, and additive
              manufacturing workflows — bridging the virtual and physical with
              parametric precision.
            </p>
          </div>

          {/* Decorative element */}
          <div className="mt-14 flex items-center gap-4">
            <div className="h-px w-12 bg-gold/60" />
            <span
              className="text-gold/60 text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
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

          {/* Masonry grid */}
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
              style={{
                columns: "300px",
                columnGap: "24px",
              }}
            >
              {filtered.map((project, i) => (
                <SculptorCard
                  key={project._id}
                  project={project}
                  onOpen={handleOpen}
                  tall={i % 3 === 1}
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

function SculptorCard({
  project,
  onOpen,
  tall,
}: {
  project: SanityProject;
  onOpen: (p: SanityProject) => void;
  tall?: boolean;
}) {
  const imgSrc = project.mainImage
    ? urlFor(project.mainImage as Parameters<typeof urlFor>[0])
        .width(900)
        .url()
    : null;

  return (
    <div
      className="sculpt-card group relative overflow-hidden cursor-pointer mb-6"
      style={{
        breakInside: "avoid",
      }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      aria-label={`View ${project.title}`}
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: tall ? "3/4" : "4/3" }}
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#111]" />
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Gold diagonal accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-60"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(201,149,42,0.15) 50%)",
          }}
        />

        {/* ADM-style slide-up overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-out bg-black/85">
          <div className="p-5 flex flex-col gap-2">
            {project.subcategory && (
              <span
                className="text-gold text-[10px] tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.subcategory}
              </span>
            )}
            <h3
              className="text-lg md:text-xl font-bold text-cream leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {project.title}
            </h3>
            <div
              className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-cream/45 tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.client && <span>{project.client}</span>}
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
