"use client";

export default function SectionTransitionOverlay() {
  return (
    <div
      id="section-transition-overlay"
      aria-hidden
      style={{
        position: "fixed",
        top: "50%",
        left: 0,
        width: "100%",
        height: "1px",
        backgroundColor: "#C9952A",
        zIndex: 100,
        opacity: 0,
        transform: "scaleX(0)",
        transformOrigin: "left center",
        pointerEvents: "none",
      }}
    />
  );
}
