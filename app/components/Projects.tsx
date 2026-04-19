"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client, urlFor } from "@/lib/sanity";
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

const FEATURED_QUERY = `*[_type == "project" && featured == true] | order(_createdAt desc) {
  _id, title, category, subcategory, description, overview,
  mainImage, gallery, videoUrl, videoFile, panorama, model3d,
  client, location, year
}`;

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

export default function Projects() {
  const [featured, setFeatured] = useState<SanityProject[] | null>(null);
  const { openModal } = useProjectModal();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const h2LineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client
      .fetch<SanityProject[]>(FEATURED_QUERY)
      .then((data) => {
        if (data?.length) {
          const seen = new Set<string>();
          const deduped: SanityProject[] = [];
          for (const p of data) {
            if (!seen.has(p.category)) {
              seen.add(p.category);
              deduped.push(p);
            }
          }
          setFeatured(deduped);
        } else {
          setFeatured([]);
        }
      })
      .catch(() => setFeatured([]));
  }, []);

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
            start: "top 78%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!featured?.length) return;
    const ctx = gsap.context(() => {
      const cardEls = gridRef.current?.querySelectorAll<HTMLElement>(".fw-card");
      if (!cardEls?.length) return;
      gsap.fromTo(
        Array.from(cardEls),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
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
      <span
        aria-hidden
        className="absolute top-0 right-0 leading-none font-bold text-gold select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "180px",
          opacity: 0.04,
        }}
      >
        03
      </span>

      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Work
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream"
              style={{ fontFamily: "var(--font-heading)", transform: "translateY(110%)" }}
            >
              Featured <span className="text-gold">Work</span>
            </h2>
          </div>
        </div>

        {/* Content */}
        {featured === null ? null : featured.length === 0 ? (
          <EmptyState />
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="fw-card group relative overflow-hidden cursor-pointer"
                  style={{ opacity: 0 }}
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
                          className="mt-1 inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm w-fit"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          View All
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
