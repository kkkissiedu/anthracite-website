"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client, urlFor } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

type Category =
  | "architectural-structural"
  | "3d-design"
  | "real-estate-construction";

type FeaturedCard = {
  category: Category;
  title: string;
  description: string;
  image: string | null;
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
  const [cards, setCards] = useState<FeaturedCard[] | null>(null);
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
          const seen = new Set<Category>();
          const featured: FeaturedCard[] = [];
          for (const p of data) {
            if (!seen.has(p.category)) {
              seen.add(p.category);
              featured.push({
                category: p.category,
                title: p.title,
                description: p.description,
                image: p.mainImage
                  ? urlFor(p.mainImage as Parameters<typeof urlFor>[0])
                      .width(1200)
                      .url()
                  : null,
                href: CATEGORY_HREFS[p.category] ?? "/",
              });
            }
          }
          setCards(featured);
        } else {
          setCards([]);
        }
      })
      .catch(() => {
        setCards([]);
      });
  }, []);

  useEffect(() => {
    if (!cards?.length) return;
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
      className="bg-anthracite text-cream py-20 lg:py-28 px-6 md:px-8 lg:px-16"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-3"
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

        {/* Content */}
        {cards === null ? null : cards.length === 0 ? (
          <EmptyState />
        ) : (
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
                <div className="relative w-full aspect-[3/4]">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a]" />
                  )}
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
        )}
      </div>
    </section>
  );
}
