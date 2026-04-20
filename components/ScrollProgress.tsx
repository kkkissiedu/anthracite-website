"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed right-0 top-0 z-50 pointer-events-none"
      style={{ width: "2px", height: "100vh", backgroundColor: "rgba(201,149,42,0.2)" }}
      aria-hidden
    >
      <div ref={barRef} className="w-full bg-gold" style={{ height: "0%" }} />
    </div>
  );
}
