"use client";

import { useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RawTeamMember } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedinUrl: string | null;
};

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e]">
      <span className="text-lg font-bold text-gold/50 font-heading">
        {initials}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="border border-gold px-12 py-8 text-center">
        <p className="text-gold-dark text-sm tracking-[0.2em] uppercase">
          Content coming soon
        </p>
      </div>
    </div>
  );
}

export default function Team({ members: rawMembers }: { members: RawTeamMember[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2LineRef = useRef<HTMLDivElement>(null);

  const members = useMemo<TeamMember[]>(
    () =>
      rawMembers.map((m) => ({
        id: m._id,
        name: m.name,
        role: m.role,
        bio: m.bio,
        photo: m.photo?.asset?.url ?? null,
        linkedinUrl: m.linkedinUrl,
      })),
    [rawMembers]
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        h2LineRef.current,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!members.length) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const rows = rowRefs.current.filter(Boolean);
      if (!rows.length) return;
      gsap.fromTo(
        rows,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [members]);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative bg-cream text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="section-number" data-number="04" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold-dark mb-4">
            The People
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text"
            >
              Meet the <span className="text-gold-heading">Team</span>
            </h2>
          </div>
        </div>

        {/* Team list */}
        {members.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="border-b border-gold/20">
            {members.map((member, i) => (
              <div
                key={member.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="flex items-center gap-6 py-5 border-t border-gold/20 hover:bg-dark-text/[0.02] transition-colors duration-300 cursor-default"
              >
                {/* Photo */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden bg-[#1a1a1a]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <AvatarPlaceholder name={member.name} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-[Cormorant_Garamond] text-2xl md:text-3xl font-bold text-dark-text leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold-dark mt-1">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-sm text-dark-text/60 mt-1 line-clamp-1">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* LinkedIn arrow */}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-gold-dark/40 hover:text-gold-dark transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
