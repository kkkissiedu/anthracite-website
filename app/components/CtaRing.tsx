/**
 * Decorative scroll-triggered ring: a gradient gold line draws around the
 * parent button while a glowing bright head leads the stroke, then fades.
 * Parent must be `relative`; animation is driven externally via GSAP,
 * targeting `.cta-ring` and `.cta-ring-head`.
 */
export default function CtaRing() {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cta-ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9952A" />
          <stop offset="50%" stopColor="#F0D98C" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <filter id="cta-ring-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Trail: gradient gold line that draws around the perimeter */}
      <rect
        className="cta-ring"
        x="0"
        y="0"
        width="100%"
        height="100%"
        pathLength={1}
        fill="none"
        stroke="url(#cta-ring-gold)"
        strokeWidth={4}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      {/* Head: short glowing segment leading the draw */}
      <rect
        className="cta-ring-head"
        x="0"
        y="0"
        width="100%"
        height="100%"
        pathLength={1}
        fill="none"
        stroke="#F7E7B4"
        strokeWidth={6}
        strokeLinecap="round"
        filter="url(#cta-ring-glow)"
        style={{ strokeDasharray: "0.07 0.93", strokeDashoffset: 1, opacity: 0 }}
      />
    </svg>
  );
}
