"use client";

import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@/app/hooks/useBodyScrollLock";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "About", href: "/#about", section: "about" },
  { label: "Services", href: "/#services", section: "services" },
  { label: "Projects", href: "/#projects", section: "projects" },
  { label: "Team", href: "/#team", section: "team" },
  { label: "Contact", href: "/#contact", section: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const sectionIds = NAV_LINKS.map((l) => l.section);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname]);

  useBodyScrollLock(menuOpen);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-anthracite/80 backdrop-blur-sm border-b border-gold/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
            aria-label="The Anthracite Limited"
          >
            <Image
              src="/logo-icon.svg"
              alt="The Anthracite Limited"
              width={160}
              height={44}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-12 ml-auto">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`relative text-sm tracking-widest uppercase transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite rounded-sm pb-1 ${
                      isActive ? "text-gold" : "text-cream/80 hover:text-cream"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-gold origin-left transition-transform duration-300 ease-out ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm z-60"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-cream transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-anthracite/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center gap-10">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.section;
            return (
              <li
                key={link.label}
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                }}
                className={`transition-all duration-400 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  tabIndex={menuOpen ? 0 : -1}
                  className={`text-4xl font-heading transition-colors duration-300 tracking-widest uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm ${
                    isActive ? "text-gold" : "text-cream hover:text-gold"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div
          className={`mt-16 h-px w-16 bg-gold transition-all duration-700 delay-300 ${
            menuOpen ? "opacity-100 w-16" : "opacity-0 w-0"
          }`}
        />
      </div>
    </>
  );
}
