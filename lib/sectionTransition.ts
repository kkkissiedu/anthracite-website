import gsap from "gsap";

export function triggerSectionTransition() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("section-transition-overlay");
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.set(el, { scaleX: 0, opacity: 1 });
  gsap.to(el, {
    scaleX: 1,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to(el, { opacity: 0, duration: 0.3 });
    },
  });
}
