"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBodyScrollLock } from "@/app/hooks/useBodyScrollLock";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/lib/sanity";
import type { SanityProperty } from "@/lib/sanity";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

gsap.registerPlugin(ScrollTrigger);

// ── Page ─────────────────────────────────────────────────────────────────────

const DEFAULT_HEADING = "Luxury Rentals";
const DEFAULT_SUBTITLE = "Curated living spaces in Kumasi.";

export default function RealEstatePage({
  heroHeading,
  heroSubtitle,
  properties: initialProperties,
}: {
  heroHeading?: string;
  heroSubtitle?: string;
  properties: SanityProperty[];
}) {
  const [properties] = useState<SanityProperty[]>(initialProperties);
  const [activeProperty, setActiveProperty] = useState<SanityProperty | null>(null);

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

  // Grid cards scroll animation
  useEffect(() => {
    if (!gridRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    ctxRef.current?.revert();
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".prop-card");
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
    return () => ctxRef.current?.revert();
  }, [properties.length]);

  const openProperty = useCallback((p: SanityProperty) => setActiveProperty(p), []);
  const closeProperty = useCallback(() => setActiveProperty(null), []);

  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-anthracite text-cream pt-36 pb-20 px-6 md:px-8 lg:px-16">
          <div ref={heroRef} className="max-w-[1280px] mx-auto">
            <p
              data-hero
              className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
            >
              Curated Rentals
            </p>

            <h1
              data-hero
              className="text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold leading-none tracking-tight text-cream text-balance"
            >
              {heroHeading ?? DEFAULT_HEADING}
            </h1>

            <p
              data-hero
              className="mt-8 text-cream/55 max-w-2xl text-base leading-relaxed"
            >
              {heroSubtitle ?? DEFAULT_SUBTITLE}
            </p>

            <div data-hero className="mt-12 h-px w-24 bg-gold/50" />
          </div>
        </section>

        {/* Listings grid */}
        <section className="bg-anthracite pb-28 px-6 md:px-8 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            {properties.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <div className="border border-gold px-12 py-8 text-center">
                  <p className="text-gold text-sm tracking-[0.2em] uppercase">
                    Listings coming soon
                  </p>
                </div>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
              >
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} onOpen={openProperty} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {activeProperty && (
        <PropertyModal property={activeProperty} onClose={closeProperty} />
      )}
    </>
  );
}

// ── PropertyCard ──────────────────────────────────────────────────────────────

function PropertyCard({
  property,
  onOpen,
}: {
  property: SanityProperty;
  onOpen: (p: SanityProperty) => void;
}) {
  const primaryImage = property.images?.[0];
  const imgSrc = primaryImage
    ? urlFor(primaryImage)
        .width(800)
        .height(600)
        .url()
    : null;

  return (
    <div className="prop-card group flex flex-col bg-[#111] border border-white/5 hover:border-gold/30 transition-colors duration-300">
      {/* Cover image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-gold/20 text-xs tracking-widest uppercase">
              No image
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-gold px-2 py-1">
          <span className="text-anthracite text-[9px] font-bold tracking-widest uppercase">
            Available
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div>
          <h3 className="text-lg font-bold text-cream leading-tight">
            {property.title}
          </h3>
          {property.location && (
            <p className="text-cream/40 text-xs tracking-wider uppercase mt-1 flex items-center gap-1.5">
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden>
                <path
                  d="M4.5 0C2.29 0 .5 1.79.5 4c0 2.75 4 7 4 7s4-4.25 4-7c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                  fill="#C9952A"
                />
              </svg>
              {property.location}
            </p>
          )}
        </div>

        {/* Bed / Bath counts */}
        <div className="flex items-center gap-5">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <BedIcon />
              <span className="text-cream/60 text-xs">
                {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
              </span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <BathIcon />
              <span className="text-cream/60 text-xs">
                {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
              </span>
            </div>
          )}
        </div>

        {/* Short description */}
        {property.shortDescription && (
          <p className="text-cream/45 text-sm leading-relaxed line-clamp-2 flex-1">
            {property.shortDescription}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          {property.pricePerNight != null ? (
            <div>
              <span className="text-gold text-base font-semibold font-heading">
                GHS {property.pricePerNight.toLocaleString()}
              </span>
              <span className="text-cream/30 text-xs ml-1">
                /night
              </span>
            </div>
          ) : (
            <span className="text-cream/30 text-xs italic">
              Price on enquiry
            </span>
          )}
          <button
            onClick={() => onOpen(property)}
            className="flex items-center gap-1.5 text-gold text-xs tracking-[0.15em] uppercase hover:gap-2.5 transition-all duration-200"
          >
            View Details
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
                stroke="#C9952A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function BedIcon() {
  return (
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" aria-hidden>
      <path
        d="M1 12V7a2 2 0 012-2h9a2 2 0 012 2v5"
        stroke="#C9952A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect x="1" y="9" width="13" height="3" rx="0.5" stroke="#C9952A" strokeWidth="1.2" />
      <path
        d="M1 5V2.5a1 1 0 011-1h11a1 1 0 011 1V5"
        stroke="#C9952A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect x="3.5" y="5.5" width="3" height="2.5" rx="0.5" stroke="#C9952A" strokeWidth="1.2" />
      <rect x="8.5" y="5.5" width="3" height="2.5" rx="0.5" stroke="#C9952A" strokeWidth="1.2" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" aria-hidden>
      <path
        d="M2 7h11a1 1 0 011 1v1a3.5 3.5 0 01-3.5 3.5h-6A3.5 3.5 0 011 9V8a1 1 0 011-1z"
        stroke="#C9952A"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 7V4a2 2 0 014 0"
        stroke="#C9952A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M5 12l-.5 1.5M10 12l.5 1.5"
        stroke="#C9952A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── PropertyModal ─────────────────────────────────────────────────────────────

type ModalTab = "images" | "video" | "panorama";

function PropertyModal({
  property,
  onClose,
}: {
  property: SanityProperty;
  onClose: () => void;
}) {
  const images = property.images ?? [];
  const hasImages = images.length > 0;
  const hasVideo = !!property.videoUrl;
  const hasPanorama = !!property.panoramaUrl;

  const tabs: ModalTab[] = [
    ...(hasImages ? (["images"] as const) : []),
    ...(hasVideo ? (["video"] as const) : []),
    ...(hasPanorama ? (["panorama"] as const) : []),
  ];
  const defaultTab: ModalTab = tabs[0] ?? "images";

  const [activeTab, setActiveTab] = useState<ModalTab>(defaultTab);
  const [activeImg, setActiveImg] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pannellumRef = useRef<HTMLDivElement>(null);
  const panoramaViewerRef = useRef<{ destroy?: () => void } | null>(null);

  // GSAP entrance
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    tl.fromTo(
      panelRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, []);

  // Body scroll lock
  useBodyScrollLock(true);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && activeTab === "images")
        setActiveImg((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight" && activeTab === "images")
        setActiveImg((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, images.length]);

  // Pannellum panorama
  useEffect(() => {
    if (activeTab !== "panorama" || !property.panoramaUrl || !pannellumRef.current)
      return;

    function init() {
      const W = window as unknown as Record<string, unknown>;
      if (!W.pannellum) return;
      const pan = W.pannellum as {
        viewer: (
          el: HTMLDivElement,
          cfg: object
        ) => { destroy: () => void };
      };
      panoramaViewerRef.current = pan.viewer(pannellumRef.current!, {
        type: "equirectangular",
        panorama: property.panoramaUrl,
        autoLoad: true,
        mouseZoom: true,
        showControls: false,
      });
    }

    const W = window as unknown as Record<string, unknown>;
    if (W.pannellum) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "/pannellum/pannellum.js";
      script.onload = init;
      document.head.appendChild(script);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/pannellum/pannellum.css";
      document.head.appendChild(link);
    }

    return () => {
      panoramaViewerRef.current?.destroy?.();
      panoramaViewerRef.current = null;
    };
  }, [activeTab, property.panoramaUrl]);

  function handleClose() {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
    });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  }

  // Build image display URLs
  const imageUrls = images.map((img) =>
    urlFor(img).width(1200).url()
  );
  const thumbUrls = images.map((img) =>
    urlFor(img).width(120).height(80).url()
  );

  // Parse YouTube / Vimeo embed URL
  function getEmbedUrl(url: string): string | null {
    const yt = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/
    );
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
    const vi = url.match(/vimeo\.com\/(\d+)/);
    if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
    return null;
  }

  const tabLabel: Record<ModalTab, string> = {
    images: "Photos",
    video: "Video",
    panorama: "360°",
  };

  // Pre-filled mailto body
  const mailtoHref = `mailto:hello@theanthracite.com?subject=${encodeURIComponent(
    `Enquiry: ${property.title}`
  )}&body=${encodeURIComponent(
    `Hello,\n\nI am interested in "${property.title}" and would like to enquire about availability.\n\nGuest Name: \nDates of Interest: [Check-in] to [Check-out]\nNumber of Guests: \n\nAny questions or requests:\n`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-white/10 sm:rounded-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
        aria-label={property.title}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-5 bg-[#0D0D0D] border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream leading-tight">
              {property.title}
            </h2>
            {property.location && (
              <p className="text-cream/40 text-xs mt-1 tracking-wider">
                {property.location}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 mt-1 w-8 h-8 flex items-center justify-center text-cream/50 hover:text-cream transition-colors duration-200 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab bar — only if multiple media types */}
        {tabs.length > 1 && (
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-gold border-b-2 border-gold -mb-px"
                    : "text-cream/40 hover:text-cream"
                }`}
              >
                {tabLabel[tab]}
              </button>
            ))}
          </div>
        )}

        {/* ── Images tab ── */}
        {activeTab === "images" && hasImages && (
          <div>
            <div className="relative w-full aspect-video bg-[#111]">
              <Image
                src={imageUrls[activeImg]}
                alt={`${property.title} — photo ${activeImg + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                    disabled={activeImg === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-cream text-2xl disabled:opacity-25 hover:bg-black/80 transition-colors flex items-center justify-center"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImg((i) => Math.min(images.length - 1, i + 1))
                    }
                    disabled={activeImg === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 text-cream text-2xl disabled:opacity-25 hover:bg-black/80 transition-colors flex items-center justify-center"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-cream/70 text-xs">
                    {activeImg + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-[#0a0a0a]">
                {thumbUrls.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 relative w-[80px] h-[54px] overflow-hidden transition-all duration-200 ${
                      i === activeImg
                        ? "ring-1 ring-gold opacity-100"
                        : "opacity-40 hover:opacity-70"
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Video tab ── */}
        {activeTab === "video" && hasVideo && (
          <div className="aspect-video bg-[#111]">
            {getEmbedUrl(property.videoUrl!) ? (
              <iframe
                src={getEmbedUrl(property.videoUrl!)!}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`${property.title} walkthrough`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <a
                  href={property.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline text-sm"
                >
                  Watch video →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── Panorama tab ── */}
        {activeTab === "panorama" && hasPanorama && (
          <div ref={pannellumRef} className="w-full aspect-video bg-[#111]" />
        )}

        {/* ── Details + Enquiry ── */}
        <div className="p-6 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Left: stats + description + amenities */}
            <div className="flex flex-col gap-5">
              {/* Bed / Bath */}
              <div className="flex items-center gap-6">
                {property.bedrooms != null && (
                  <div className="flex items-center gap-2">
                    <BedIcon />
                    <span className="text-cream text-sm">
                      {property.bedrooms} Bedroom
                      {property.bedrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-2">
                    <BathIcon />
                    <span className="text-cream text-sm">
                      {property.bathrooms} Bathroom
                      {property.bathrooms !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <p className="text-cream/55 text-sm leading-relaxed">
                  {property.description}
                </p>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-3">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span
                        key={a}
                        className="text-cream/60 text-xs border border-white/10 px-3 py-1"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: price + enquiry buttons */}
            <div className="flex flex-col gap-4">
              {property.pricePerNight != null && (
                <div className="mb-1">
                  <span className="text-gold text-2xl font-bold font-heading">
                    GHS {property.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-cream/30 text-sm ml-1">
                    /night
                  </span>
                </div>
              )}

              <p className="text-[10px] tracking-[0.25em] uppercase text-cream/40">
                Make an Enquiry
              </p>

              {/* Email — gold */}
              <a
                href={mailtoHref}
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gold text-anthracite text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4AF37] transition-colors duration-200"
              >
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  aria-hidden
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="14"
                    height="11"
                    rx="1.5"
                    stroke="#0D0D0D"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M0.5 2L7.5 7l7-5"
                    stroke="#0D0D0D"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                Email Enquiry
              </a>

              {/* WhatsApp — green */}
              {property.whatsappNumber && (
                <a
                  href={`https://wa.me/${property.whatsappNumber}?text=${encodeURIComponent(
                    `Hi, I'm interested in ${property.title}. I'd like to enquire about availability.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-90 transition-opacity duration-200"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              )}

              {/* Call — neutral outlined */}
              {property.phoneNumber && (
                <a
                  href={`tel:${property.phoneNumber}`}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 border border-white/20 text-cream text-xs tracking-[0.2em] uppercase font-semibold hover:border-white/40 transition-colors duration-200"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                  </svg>
                  {/* Show number as text on desktop, just "Call" on mobile */}
                  <span className="hidden sm:inline">{property.phoneNumber} · </span>
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
