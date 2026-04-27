"use client";

import Image from "next/image";

interface MediaCardProps {
  image: string | null;
  title: string;
  subcategory?: string;
  metadata?: (string | number | undefined)[];
  onClick: () => void;
  aspectRatio?: string;
  cardClassName?: string;
  wrapperStyle?: React.CSSProperties;
  showAccent?: boolean;
  sizes?: string;
}

export default function MediaCard({
  image,
  title,
  subcategory,
  metadata = [],
  onClick,
  aspectRatio = "4/3",
  cardClassName = "media-card",
  wrapperStyle,
  showAccent = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: MediaCardProps) {
  const filteredMeta = metadata.filter(Boolean) as (string | number)[];

  return (
    <div
      className={`${cardClassName} group relative overflow-hidden cursor-pointer`}
      style={wrapperStyle}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${title}`}
    >
      <div className="relative w-full" style={{ aspectRatio }}>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-105"
            sizes={sizes}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Optional gold diagonal accent (Sculptor variant) */}
        {showAccent && (
          <div
            className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-60"
            style={{
              background:
                "linear-gradient(135deg, transparent 50%, rgba(201,149,42,0.15) 50%)",
            }}
          />
        )}

        {/* ADM-style slide-up overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms] ease-out bg-black/85">
          <div className="p-5 flex flex-col gap-2">
            {subcategory && (
              <span
                className="text-gold text-[10px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {subcategory}
              </span>
            )}
            <h3
              className="text-xl md:text-2xl font-bold text-cream leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h3>
            {filteredMeta.length > 0 && (
              <div
                className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-cream/50 tracking-[0.12em] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {filteredMeta.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 text-gold text-xs tracking-[0.2em] uppercase mt-1">
              View Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="#C9952A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
