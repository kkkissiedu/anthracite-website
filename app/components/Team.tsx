"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { client, urlFor } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkedinUrl: string | null;
};

const STATIC_TEAM: TeamMember[] = [
  {
    id: "static-1",
    name: "Kwame Asante",
    role: "Founder & Principal Architect",
    bio: "With over 15 years across structural design and computational engineering, Kwame leads the firm's vision of merging precision technology with bold architectural expression across West Africa.",
    photo: null,
    linkedinUrl: null,
  },
  {
    id: "static-2",
    name: "Amara Osei",
    role: "Head of 3D Design & Digital Fabrication",
    bio: "Amara directs The Sculptor studio, specialising in parametric design, digital twins, and additive manufacturing workflows that bridge concept and construction.",
    photo: null,
    linkedinUrl: null,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e]">
      <span
        className="text-5xl font-bold text-gold/50"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {initials}
      </span>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const MemberCard = forwardRef<HTMLDivElement, { member: TeamMember }>(
  ({ member }, ref) => (
    <div
      ref={ref}
      style={{ opacity: 0 }}
      className="group flex flex-col border border-dark-text/10 overflow-hidden"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#1c1c1c]">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <AvatarPlaceholder name={member.name} />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4 p-8">
        <div>
          <h3
            className="text-2xl md:text-3xl font-bold text-dark-text leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {member.name}
          </h3>
          <p
            className="text-gold text-[10px] tracking-[0.25em] uppercase mt-1.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {member.role}
          </p>
        </div>

        <div className="h-px bg-dark-text/10" />

        <p
          className="text-dark-text/60 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {member.bio}
        </p>

        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gold hover:text-gold-highlight transition-colors text-[10px] tracking-[0.2em] uppercase w-fit mt-auto pt-2"
            style={{ fontFamily: "var(--font-body)" }}
            aria-label={`${member.name} on LinkedIn`}
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
);
MemberCard.displayName = "MemberCard";

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(STATIC_TEAM);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    client
      .fetch<
        Array<{
          _id: string;
          name: string;
          role: string;
          bio: string;
          photo: unknown;
          linkedinUrl: string | null;
        }>
      >(
        `*[_type == "teamMember"] | order(_createdAt asc) {
          _id, name, role, bio, photo, linkedinUrl
        }`
      )
      .then((data) => {
        if (data?.length) {
          setMembers(
            data.map((m) => ({
              id: m._id,
              name: m.name,
              role: m.role,
              bio: m.bio,
              photo: m.photo
                ? urlFor(m.photo as Parameters<typeof urlFor>[0])
                    .width(700)
                    .url()
                : null,
              linkedinUrl: m.linkedinUrl,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
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
      className="bg-cream text-dark-text py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p
            className="text-gold tracking-[0.3em] uppercase text-xs mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            The People
          </p>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet the <span className="text-gold">Team</span>
          </h2>
        </div>

        {/* Cards grid — responsive, accommodates more members later */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {members.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
