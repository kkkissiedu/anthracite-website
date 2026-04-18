"use client";

import { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client, urlFor } from "@/lib/sanity";

import spectraImg from "@/assets/projects/spectra.webp";
import phMainImg from "@/assets/projects/ph_main.webp";
import wdMainImg from "@/assets/projects/wd_main.webp";

gsap.registerPlugin(ScrollTrigger);

type Category =
  | "architectural-structural"
  | "3d-design"
  | "real-estate-construction";

type FeaturedCard = {
  category: Category;
  title: string;
  description: string;
  image: string | StaticImageData;
  href: string;
};

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

const STATIC_FEATURED: FeaturedCard[] = [
  {
    category: "architectural-structural",
    title: "Spectra Tower",
    description:
      "A landmark mixed-use high-rise featuring parametric façade engineering and computational structural analysis, designed for LEED Platinum certification.",
    image: spectraImg,
    href: "/work/architectural-structural",
  },
  {
    category: "3d-design",
    title: "Project Horizon",
    description:
      "Comprehensive 3D digital twin for a 45-unit residential complex, enabling real-time clash detection and phased construction simulation.",
    image: phMainImg,
    href: "/work/sculptor",
  },
  {
    category: "real-estate-construction",
    title: "Westdale Estate",
    description:
      "End-to-end development management for a 12-acre master-planned estate — Ghana's first 3D-printed Green Building units.",
    image: wdMainImg,
    href: "/services/real-estate",
  },
];

export default function Projects() {
  const [cards, setCards] = useState<FeaturedCard[]>(STATIC_FEATURED);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client
      .fetch<
        Array<{
          _id: string;
          title: string;
          category: Category;
          description: string;
          mainImage: unknown;
        }>
      >(
        `*[_type == "project" && featured == true] | order(_createdAt desc) {
          _id, title, category, description, mainImage
        }`
      )
      .then((data) => {
        if (data?.length) {
          // One card per category — first featured project wins
          const seen = new Set<Category>();
          const featured: FeaturedCard[] = [];
          for (const p of data) {
            if (!seen.has(p.category)) {
              seen.add(p.category);
              featured.push({
                category: p.category,
                title: p.title,
                description: p.description,
                image: urlFor(p.mainImage as Parameters<typeof urlFor>[0])
                  .width(1200)
                  .url(),
                href: CATEGORY_HREFS[p.category],
              });
            }
            if (featured.length === 3) break;
          }
          if (featured.length === 3) setCards(featured);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
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
  }, [cards]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-anthracite text-cream py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14 md:mb-16">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Work
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-cream"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Featured <span className="text-gold">Work</span>
          </h2>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card) => (
            <div
              key={card.category}
              className="fw-card group relative overflow-hidden"
              style={{ opacity: 0 }}
            >
              {/* Full-bleed image */}
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                  <span
                    className="border border-gold/60 text-gold px-3 py-1 text-[10px] tracking-[0.25em] uppercase w-fit"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {CATEGORY_LABELS[card.category]}
                  </span>

                  <h3
                    className="text-2xl md:text-3xl font-bold text-cream leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {card.title}
                  </h3>

                  <p
                    className="text-cream/65 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {card.description}
                  </p>

                  <Link
                    href={card.href}
                    className="mt-1 inline-flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase hover:gap-3 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    View All →
                  </Link>
                </div>

                {/* Gold border on hover */}
                <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
