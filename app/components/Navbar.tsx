"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-anthracite/80 backdrop-blur-md border-b border-gold/10 py-3"
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
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="relative text-cream/80 hover:text-cream text-sm tracking-widest uppercase transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite rounded-sm pb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </a>
              </li>
            ))}
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
        className={`fixed inset-0 z-40 bg-anthracite/95 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center gap-10">
          {NAV_LINKS.map((link, i) => (
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
                className="text-4xl font-heading text-cream hover:text-gold transition-colors duration-300 tracking-widest uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
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
