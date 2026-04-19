"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";

const STRIP_QUERY = `*[_type == "project" && featured == true] | order(_createdAt desc) {
  _id, title, category, mainImage
}`;

export default function ProjectStrip() {
  const [projects, setProjects] = useState<SanityProject[] | null>(null);
  const { openModal } = useProjectModal();

  useEffect(() => {
    client
      .fetch<SanityProject[]>(STRIP_QUERY)
      .then((data) => setProjects(data ?? []))
      .catch(() => setProjects([]));
  }, []);

  if (!projects?.length) return null;

  return (
    <section className="bg-anthracite py-16 px-6 md:px-8 lg:px-16">
      <div className="max-w-[1280px] mx-auto">
        <p
          className="text-gold tracking-[0.3em] uppercase text-xs mb-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          All Featured Projects
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        className="
          flex flex-col gap-4
          md:flex-row md:gap-0
          md:overflow-x-auto md:pl-6 lg:pl-16
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          md:snap-x md:snap-mandatory
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project) => {
          const imgSrc = project.mainImage
            ? urlFor(project.mainImage as Parameters<typeof urlFor>[0])
                .width(800)
                .url()
            : null;

          return (
            <div
              key={project._id}
              className="
                group relative flex-shrink-0 cursor-pointer overflow-hidden
                w-full aspect-[4/3]
                md:w-[400px] md:h-[500px] md:aspect-auto md:mr-4
                md:snap-start
              "
              onClick={() => openModal(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openModal(project)}
              aria-label={`View ${project.title}`}
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1a1a1a]" />
              )}

              {/* Permanent bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Project name — always visible at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-lg font-bold text-cream leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {project.title}
                </h3>
              </div>

              {/* Thin gold bottom border on hover */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-[400ms] ease-out pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
