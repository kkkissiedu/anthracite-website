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

type Filter = "All" | "Residential" | "Commercial" | "Mixed-Use";
const FILTERS: Filter[] = ["All", "Residential", "Commercial", "Mixed-Use"];

const QUERY = `*[_type == "project" && category == "real-estate-construction"] | order(_createdAt desc) {
  _id, title, category, subcategory, description, overview,
  mainImage, gallery, videoUrl, videoFile, panorama, model3d,
  client, location, year
}`;

const SERVICE_BULLETS = [
  "End-to-end real estate development and construction management",
  "3D-printed green building construction using sustainable materials",
  "Structural assessment, retrofitting, and renovation works",
  "Master planning for mixed-use residential and commercial estates",
  "Project feasibility studies and investment analysis",
  "Site supervision and quality assurance throughout construction",
];

export default function RealEstatePage() {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const { openModal } = useProjectModal();
  const gridRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Real Estate Inquiry",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

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

    const cards = gridRef.current.querySelectorAll<HTMLElement>(".re-card");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus("success");
        setForm({ name: "", email: "", subject: "Real Estate Inquiry", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero — light background */}
      <section className="bg-cream text-dark-text pt-36 pb-24 px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: description */}
            <div>
              <p
                className="text-gold tracking-[0.3em] uppercase text-xs mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Services
              </p>

              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight text-dark-text"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Real Estate &amp; <span className="text-gold">Construction</span>
              </h1>

              <p
                className="mt-6 text-dark-text/60 text-base leading-relaxed max-w-lg"
                style={{ fontFamily: "var(--font-body)" }}
              >
                We deliver full-cycle real estate development and construction
                management across Ghana and West Africa — anchored by our
                flagship 3D-printed Green Building estate, built for
                durability, sustainability, and scale.
              </p>

              <div className="mt-10 h-px w-20 bg-gold/40" />

              <ul className="mt-8 flex flex-col gap-3">
                {SERVICE_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm text-dark-text/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-gold" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: inquiry form */}
            <div>
              <div className="border border-dark-text/10 p-8 md:p-10">
                <h2
                  className="text-2xl font-bold text-dark-text mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Get in Touch
                </h2>
                <p
                  className="text-dark-text/50 text-sm mb-8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Tell us about your project and we&apos;ll be in touch shortly.
                </p>

                {formStatus === "success" ? (
                  <div className="py-12 text-center">
                    <p
                      className="text-gold text-sm tracking-[0.15em] uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Message Sent
                    </p>
                    <p
                      className="text-dark-text/50 text-sm"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      We&apos;ll get back to you within 1–2 business days.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="re-name"
                          className="text-[10px] tracking-[0.2em] uppercase text-dark-text/50"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Name
                        </label>
                        <input
                          id="re-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          className="bg-transparent border border-dark-text/20 px-4 py-3 text-sm text-dark-text placeholder-dark-text/30 focus:outline-none focus:border-gold transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="re-email"
                          className="text-[10px] tracking-[0.2em] uppercase text-dark-text/50"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Email
                        </label>
                        <input
                          id="re-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          className="bg-transparent border border-dark-text/20 px-4 py-3 text-sm text-dark-text placeholder-dark-text/30 focus:outline-none focus:border-gold transition-colors"
                          style={{ fontFamily: "var(--font-body)" }}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="re-subject"
                        className="text-[10px] tracking-[0.2em] uppercase text-dark-text/50"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Subject
                      </label>
                      <input
                        id="re-subject"
                        type="text"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subject: e.target.value }))
                        }
                        className="bg-transparent border border-dark-text/20 px-4 py-3 text-sm text-dark-text placeholder-dark-text/30 focus:outline-none focus:border-gold transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="re-message"
                        className="text-[10px] tracking-[0.2em] uppercase text-dark-text/50"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Message
                      </label>
                      <textarea
                        id="re-message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="bg-transparent border border-dark-text/20 px-4 py-3 text-sm text-dark-text placeholder-dark-text/30 focus:outline-none focus:border-gold transition-colors resize-none"
                        style={{ fontFamily: "var(--font-body)" }}
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {formStatus === "error" && (
                      <p
                        className="text-red-500 text-xs"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="bg-gold text-anthracite px-8 py-4 text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-highlight transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2 w-full sm:w-auto self-start"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {formStatus === "sending" ? "Sending…" : "Send Inquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project showcase */}
      <section className="bg-anthracite text-cream py-24 px-6 md:px-8 lg:px-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <p
              className="text-gold tracking-[0.3em] uppercase text-xs mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Portfolio
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-cream"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our <span className="text-gold">Projects</span>
            </h2>
          </div>

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
                <RECard
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

function RECard({
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
      className="re-card group relative overflow-hidden cursor-pointer"
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
              className="text-xl font-bold text-cream leading-tight"
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
