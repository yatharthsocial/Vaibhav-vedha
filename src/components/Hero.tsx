"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import HeroVideo from "./HeroVideo";

const navLinks = [
  { label: "HOME", href: "#" },
  { label: "ABOUT US", href: "#" },
  { label: "OUR VERTICALS", href: "#", dropdown: true },
  { label: "PROPERTY & ASSET MANAGEMENT", href: "#" },
  { label: "PROJECTS", href: "#" },
  { label: "LEADERSHIP", href: "#" },
  { label: "INSIGHTS", href: "#" },
];

export default function Hero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // A gentle scale+fade "pop in" rather than a positional slide — no
  // upward travel, just a soft grow from slightly smaller to full size
  // while fading in. Driven via inline style (not Tailwind's scale-*
  // utilities) because those route through an untyped CSS custom
  // property that most browsers can't smoothly transition — it just
  // snaps instantly instead of easing. A long duration and a gentle
  // ease-out curve (slow all the way to a soft landing, rather than
  // Tailwind's steeper default ease-out) keep it reading as smooth
  // rather than quick. The logo, nav/hamburger, and heading all share
  // this exact transition so they appear together as one moment.
  const popInClass = `transition-[opacity,transform] delay-500 duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
    videoEnded ? "opacity-100" : "opacity-0"
  }`;
  const popInStyle = { transform: videoEnded ? "scale(1)" : "scale(0.96)" };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <HeroVideo
        className="h-full w-full object-cover"
        onEnded={() => setVideoEnded(true)}
      />

      {/* The footage isn't reliably dark behind the logo/nav/heading — a
          bright sky can wash out white text and make a white-badge logo
          disappear entirely. This permanent scrim guarantees contrast
          on the left side (where they sit) regardless of what the
          frozen frame looks like, while leaving the right side of the
          video untouched. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      {/* Top row: logo (left), primary nav (centered, desktop), and a
          hamburger toggle (mobile) — all one row. A 3-column grid keeps
          the desktop nav visually centered regardless of logo width;
          on mobile that third column becomes the menu button instead
          of sitting empty. */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto grid max-w-[1500px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 lg:px-10 lg:py-5">
          <div className={popInClass} style={popInStyle}>
            <Image
              src="/logo.png"
              alt="Vaibhav Veda Green Ventures"
              width={480}
              height={480}
              priority
              className="h-14 w-14 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:h-16 sm:w-16 lg:h-20 lg:w-20"
            />
          </div>

          <nav
            className={`hidden justify-self-center lg:flex lg:items-center lg:gap-6 ${popInClass}`}
            style={popInStyle}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold uppercase tracking-wide text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition-colors hover:text-brand-neon-green"
              >
                {link.label}
                {link.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </a>
            ))}
          </nav>

          {/* Desktop: hidden, leaving an empty spacer that balances the
              grid so the nav above stays centered (unchanged from
              before). Mobile: the hamburger toggle. */}
          <div className={`justify-self-end ${popInClass}`} style={popInStyle}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] lg:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — a full-screen panel with the same nav links, only
          ever mounted on small screens (lg:hidden), shown on tap. */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-7 bg-brand-green-dark/97 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1.5 text-[16px] font-semibold uppercase tracking-wide text-white transition-colors hover:text-brand-neon-green"
          >
            {link.label}
            {link.dropdown && <ChevronDown className="h-4 w-4" />}
          </a>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[50%] -translate-y-1/2">
        <div className="max-w-2xl px-4 lg:px-10">
          <h1
            className={`font-display text-[28px] uppercase leading-[1.2] tracking-[0.04em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[36px] lg:text-[46px] ${popInClass}`}
            style={{
              ...popInStyle,
              // A crisp black outline on the letterforms themselves,
              // independent of the drop-shadow (which just lifts the
              // whole glyph off the background rather than tracing it).
              WebkitTextStroke: "1.5px black",
              paintOrder: "stroke fill",
            }}
          >
            Building businesses.
            <br />
            Creating value.
            <br />
            Shaping a <span className="text-brand-neon-green">sustainable</span> future.
          </h1>
        </div>
      </div>
    </section>
  );
}
