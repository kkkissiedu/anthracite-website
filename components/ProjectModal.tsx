"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  startTransition,
  Suspense,
  Component,
  type ReactNode,
} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { urlFor, type SanityImageSource } from "@/lib/sanity";
import {
  useProjectModal,
  type SanityProject,
} from "@/context/ProjectModalContext";
import ToolIcon from "./ToolIcon";
import { useSwipe } from "@/app/hooks/useSwipe";

// ─── Lazy-load 3D viewer (avoids SSR issues with WebGL) ───────────────────────

const Model3DViewer = dynamic(() => import("@/components/Model3DViewer"), {
  ssr: false,
  loading: () => <GoldSpinner />,
});

// ─── Error boundary for 3D content ───────────────────────────────────────────

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "images" | "video" | "panorama" | "3d";

const TAB_LABELS: Record<TabId, string> = {
  images: "Images",
  video: "Video",
  panorama: "360°",
  "3d": "3D Model",
};

const CATEGORY_LABELS: Record<string, string> = {
  "architectural-structural": "Architectural & Structural",
  "3d-design": "3D Design",
  "real-estate-construction": "Real Estate & Construction",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTabs(project: SanityProject): TabId[] {
  const tabs: TabId[] = [];
  if (project.gallery && project.gallery.length > 0) tabs.push("images");
  if (project.videoUrl || project.videoFile?.asset?.url) tabs.push("video");
  if (project.panorama && project.panorama.length > 0) tabs.push("panorama");
  if (project.model3d?.asset?.url) tabs.push("3d");
  return tabs;
}

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function extractText(blocks: unknown[]): string {
  type Block = { _type: string; children?: { text: string }[] };
  return (blocks as Block[])
    .filter((b) => b._type === "block")
    .map((b) => b.children?.map((c) => c.text).join("") ?? "")
    .join("\n\n");
}

function sanityImageSrc(img: SanityImageSource, width: number): string {
  return urlFor(img).width(width).url();
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function GoldSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full" style={{ minHeight: 200 }}>
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{ border: "2px solid rgba(201,149,42,0.2)", borderTopColor: "#C9952A" }}
      />
    </div>
  );
}

// ─── Images tab ───────────────────────────────────────────────────────────────

function ImagesTab({ gallery }: { gallery: SanityImageSource[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const total = gallery.length;

  const goToNext = () => {
    setDirection('next');
    setCurrent(c => Math.min(total - 1, c + 1));
  };
  const goToPrev = () => {
    setDirection('prev');
    setCurrent(c => Math.max(0, c - 1));
  };

  const { onTouchStart, onTouchEnd } = useSwipe(
    () => goToNext(),
    () => goToPrev(),
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <div className="flex flex-col h-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Main image */}
      <div
        key={current}
        className={`relative flex-1 min-h-0 bg-black ${prefersReducedMotion ? '' : direction === 'next' ? 'slide-enter-left' : 'slide-enter-right'}`}
      >
        <Image
          src={sanityImageSrc(gallery[current], 1600)}
          alt={`Image ${current + 1} of ${total}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
        {/* Counter */}
        <div
          className="absolute top-4 right-4 bg-black/60 text-cream text-xs px-3 py-1.5 tracking-[0.15em]"
        >
          {current + 1} / {total}
        </div>
        {/* Prev arrow */}
        {current > 0 && (
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-cream w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
        )}
        {/* Next arrow */}
        {current < total - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-cream w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            →
          </button>
        )}
      </div>
      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex gap-2 p-3 bg-[#111] overflow-x-auto shrink-0">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 'next' : 'prev');
                setCurrent(i);
              }}
              className={`relative w-16 h-12 shrink-0 overflow-hidden transition-opacity ${
                i === current
                  ? "opacity-100 ring-1 ring-gold"
                  : "opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={sanityImageSrc(img, 200)}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Video tab ────────────────────────────────────────────────────────────────

function VideoTab({ project }: { project: SanityProject }) {
  const fileUrl = project.videoFile?.asset?.url;
  const embedUrl = project.videoUrl ? getEmbedUrl(project.videoUrl) : null;

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      {/* File upload takes priority */}
      {fileUrl && (
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black">
          <video
            controls
            className="max-w-full max-h-full"
            src={fileUrl}
          />
        </div>
      )}
      {/* Link below file if both exist */}
      {fileUrl && project.videoUrl && (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold text-xs tracking-[0.15em] uppercase hover:underline shrink-0"
        >
          Watch on external platform →
        </a>
      )}
      {/* Embed if no file */}
      {!fileUrl && embedUrl && (
        <div className="relative flex-1 min-h-0">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {/* Fallback link if URL isn't embeddable */}
      {!fileUrl && !embedUrl && project.videoUrl && (
        <div className="flex items-center justify-center flex-1">
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold text-gold px-8 py-4 text-sm tracking-[0.2em] uppercase hover:bg-gold/10 transition-colors"
          >
            Watch Video →
          </a>
        </div>
      )}
    </div>
  );
}

// ─── 360° Panorama tab ────────────────────────────────────────────────────────

declare global {
  interface Window {
    pannellum?: {
      viewer(
        el: HTMLElement,
        opts: Record<string, unknown>
      ): { destroy(): void };
    };
  }
}

function PanoramaTab({ panorama }: { panorama: SanityImageSource[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy(): void } | null>(null);
  const [currentPano, setCurrentPano] = useState(0);

  useEffect(() => {
    const imageUrl = sanityImageSrc(panorama[currentPano], 4096);

    const initViewer = () => {
      if (!containerRef.current || !window.pannellum) return;
      viewerRef.current?.destroy();
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: true,
        showControls: false,
        mouseZoom: true,
      });
    };

    if (window.pannellum) {
      initViewer();
    } else {
      if (!document.getElementById("pannellum-css")) {
        const link = document.createElement("link");
        link.id = "pannellum-css";
        link.rel = "stylesheet";
        link.href = "/pannellum/pannellum.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("pannellum-js")) {
        const script = document.createElement("script");
        script.id = "pannellum-js";
        script.src = "/pannellum/pannellum.js";
        script.onload = initViewer;
        document.head.appendChild(script);
      } else {
        // Script tag exists but may still be loading
        const existing = document.getElementById("pannellum-js") as HTMLScriptElement;
        existing.addEventListener("load", initViewer, { once: true });
      }
    }

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [panorama, currentPano]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="w-full h-full" />
      {panorama.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {panorama.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPano(i)}
              className={`w-2.5 h-2.5 rounded-full border border-gold transition-colors ${
                i === currentPano ? "bg-gold" : "bg-transparent hover:bg-gold/40"
              }`}
              aria-label={`Panorama ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function ProjectModal() {
  const { activeProject, closeModal } = useProjectModal();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const [activeTab, setActiveTab] = useState<TabId>("images");

  // Reset to first available tab when project changes
  useEffect(() => {
    if (!activeProject) return;
    const first = getTabs(activeProject)[0];
    if (first) startTransition(() => setActiveTab(first));
  }, [activeProject]);

  // GSAP open animation + body scroll lock
  useEffect(() => {
    if (!activeProject) return;
    isClosingRef.current = false;
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { y: 60, opacity: 0 });
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(panelRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
      delay: 0.05,
    });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    const tl = gsap.timeline({ onComplete: closeModal });
    tl.to(panelRef.current, { y: 40, opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.15");
  }, [closeModal]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Tab switch with GSAP fade
  const switchTab = useCallback((tab: TabId) => {
    if (!contentRef.current) {
      setActiveTab(tab);
      return;
    }
    gsap.to(contentRef.current, {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        setActiveTab(tab);
        gsap.to(contentRef.current, { opacity: 1, duration: 0.15 });
      },
    });
  }, []);

  if (!activeProject) return null;

  const tabs = getTabs(activeProject);
  const overviewText =
    activeProject.overview && activeProject.overview.length > 0
      ? extractText(activeProject.overview)
      : (activeProject.description ?? null);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-none"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel wrapper — centered */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 pointer-events-none"
        aria-modal="true"
        role="dialog"
        aria-label={activeProject.title}
      >
        <div
          ref={panelRef}
          className="relative w-full h-full sm:max-w-6xl sm:max-h-[92vh] flex flex-col bg-[#0D0D0D] sm:bg-[#0D0D0D]/95 sm:backdrop-blur-sm pointer-events-auto overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="shrink-0 border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream leading-tight">
                {activeProject.title}
              </h2>
              <button
                onClick={handleClose}
                className="shrink-0 w-9 h-9 flex items-center justify-center text-cream/50 hover:text-cream transition-colors border border-white/10 hover:border-white/30 text-sm"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[10px] tracking-[0.18em] uppercase">
              {activeProject.client && (
                <span className="text-cream/40">
                  Client:{" "}
                  <span className="text-cream/75">{activeProject.client}</span>
                </span>
              )}
              {activeProject.location && (
                <span className="text-cream/40">
                  Location:{" "}
                  <span className="text-cream/75">{activeProject.location}</span>
                </span>
              )}
              {activeProject.year && (
                <span className="text-cream/40">
                  Year:{" "}
                  <span className="text-cream/75">{activeProject.year}</span>
                </span>
              )}
              {activeProject.category && (
                <span className="text-gold">
                  {CATEGORY_LABELS[activeProject.category] ??
                    activeProject.category}
                </span>
              )}
              {activeProject.subcategory && (
                <span className="border border-gold/40 text-gold/60 px-2 py-px">
                  {activeProject.subcategory}
                </span>
              )}
              {activeProject.tools && activeProject.tools.length > 0 && activeProject.category !== 'real-estate-construction' && (
                <>
                  <span className="hidden md:block w-px h-4 bg-white/20 mx-3" />
                  <div className="flex flex-wrap items-center gap-2">
                    {activeProject.tools.map((tool: string) => (
                      <ToolIcon key={tool} tool={tool} size={24} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Overview ── */}
          {overviewText && (
            <div className="shrink-0 px-6 py-5 border-b border-white/10 max-h-40 overflow-y-auto">
              <p className="text-cream/60 text-sm leading-relaxed whitespace-pre-line">
                {overviewText}
              </p>
            </div>
          )}

          {/* ── Tab bar (only if 2+ tabs) ── */}
          {tabs.length > 1 && (
            <div className="shrink-0 flex border-b border-white/10 bg-[#080808]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`px-5 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    activeTab === tab
                      ? "text-gold border-b-2 border-gold -mb-px"
                      : "text-cream/40 hover:text-cream/70"
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
          )}

          {/* ── Tab content ── */}
          {tabs.length > 0 && (
            <div
              ref={contentRef}
              className="flex-1 min-h-0 relative overflow-hidden"
              style={{ minHeight: 380 }}
            >
              {activeTab === "images" &&
                activeProject.gallery &&
                activeProject.gallery.length > 0 && (
                  <ImagesTab gallery={activeProject.gallery} />
                )}

              {activeTab === "video" &&
                (activeProject.videoUrl ||
                  activeProject.videoFile?.asset?.url) && (
                  <VideoTab project={activeProject} />
                )}

              {activeTab === "panorama" &&
                activeProject.panorama &&
                activeProject.panorama.length > 0 && (
                  <PanoramaTab panorama={activeProject.panorama} />
                )}

              {activeTab === "3d" && activeProject.model3d?.asset?.url && (
                <ErrorBoundary
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <p className="text-cream/40 text-sm">
                        Failed to load 3D model
                      </p>
                    </div>
                  }
                >
                  <Suspense fallback={<GoldSpinner />}>
                    <Model3DViewer url={activeProject.model3d.asset.url} />
                  </Suspense>
                </ErrorBoundary>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
