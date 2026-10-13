"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import HeroVideo from "./HeroVideo";

const navLinks = [
  { label: "HOME", href: "#" },
  { label: "ABOUT US", href: "#" },
  { label: "PROPERTY & ASSET MANAGEMENT", href: "#" },
  { label: "PROJECTS", href: "#" },
  { label: "LEADERSHIP", href: "#" },
  { label: "INSIGHTS", href: "/insights" },
];

// How long one character's roll takes, and how far apart (per
// character index) each one's roll starts — slow enough to read as an
// unhurried mechanical roll rather than a snap, and staggered so the
// word rolls across left to right instead of moving as one flat block.
const ROLL_DURATION_MS = 650;
const ROLL_CHAR_STEP_MS = 26;

// A rolling letter-reel hover effect, like an odometer/flip-counter
// digit. Each character sits in its own one-line-tall clipped box
// holding two stacked copies of that same character; on hover the
// inner pair slides up by exactly one character's height, so the top
// copy scrolls out and the bottom copy scrolls in to take its place.
// The transition is declared only on the `group-hover` rule, not the
// base state — a one-way-transition trick, so rolling in on hover is
// animated but reverting on hover-out snaps back instantly rather
// than rolling in reverse.
function RollingLabel({ text }: { text: string }) {
  return (
    <>
      {/* The real, single copy of the label — visually hidden but
          what screen readers, find-in-page and copy/paste actually
          see. Without this, the two stacked letter-copies below
          (aria-hidden only removes them from the accessibility tree,
          not from raw text content) would read back as "HHOOMMEE"
          instead of "HOME". */}
      <span className="sr-only">{text}</span>
      <span className="inline-flex" aria-hidden="true">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="relative inline-block h-[1em] overflow-hidden align-top leading-none"
          >
            <span
              className="flex flex-col leading-none group-hover:-translate-y-1/2 group-hover:transition-transform"
              style={{
                transitionDuration: `${ROLL_DURATION_MS}ms`,
                transitionDelay: `${i * ROLL_CHAR_STEP_MS}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="block h-[1em] leading-none">{char === " " ? " " : char}</span>
              <span className="block h-[1em] leading-none">{char === " " ? " " : char}</span>
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

export default function Hero() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Locks the page in place while the mobile menu is open — without
  // this, the menu sits on top of the Hero/About pinned-scroll
  // transition, but the page underneath keeps scrolling right along
  // with it, so a swipe on the open menu could carry the user straight
  // into About behind it. Pinning the body via `position: fixed`
  // (rather than just `overflow: hidden`, which mobile Safari can
  // still rubber-band past) freezes scroll at the exact position it
  // was at, then restores that same position the instant the menu
  // closes so nothing visibly jumps.
  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  // A gentle rise+fade "pop in" — content starts a little below its
  // final position and eases straight up into place while fading in,
  // then sits fully still once settled. Driven via inline style (not
  // Tailwind's translate-y-* utilities) because those route through an
  // untyped CSS custom property that most browsers can't smoothly
  // transition — it just snaps instantly instead of easing. A long
  // duration and a gentle ease-out curve (slow all the way to a soft
  // landing, rather than Tailwind's steeper default ease-out) keep it
  // reading as smooth and unhurried rather than quick. The logo,
  // nav/hamburger, and heading all share this exact transition so they
  // rise together as one moment.
  const popInClass = `transition-[opacity,transform] delay-500 duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
    videoEnded ? "opacity-100" : "opacity-0"
  }`;
  const popInStyle = { transform: videoEnded ? "translateY(0)" : "translateY(28px)" };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
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
      {/* Bottom scrim for the headline block — fades in with it, so the
          video plays untouched until then. */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent transition-opacity duration-[1800ms] ease-out ${
          videoEnded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Top row: logo (left), primary nav (centered, desktop), and a
          hamburger toggle (mobile) — all one row. A 3-column grid keeps
          the desktop nav visually centered regardless of logo width;
          on mobile that third column becomes the menu button instead
          of sitting empty. */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto grid max-w-[1500px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 [@media(max-height:500px)]:py-2 lg:px-10 lg:py-5">
          <div className={popInClass} style={popInStyle}>
            <Image
              src="/logo.png"
              alt="Vaibhav Veda Green Ventures"
              width={480}
              height={480}
              priority
              className="h-14 w-14 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] [@media(max-height:500px)]:h-10 [@media(max-height:500px)]:w-10 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
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
                className="group flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold uppercase tracking-wide text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition-colors hover:text-brand-neon-green"
              >
                <RollingLabel text={link.label} />
              </a>
            ))}
          </nav>

          {/* Desktop: hidden, leaving an empty spacer that balances the
              grid so the nav above stays centered (unchanged from
              before). Mobile: the hamburger toggle. */}
          <div className={`col-start-3 justify-self-end ${popInClass}`} style={popInStyle}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 lg:hidden"
            >
              {/* A proper animated hamburger — three bars that morph
                  into an X — rather than an instant icon swap. Top and
                  bottom bars slide to the vertical center and rotate
                  into the two strokes of the X; the middle bar just
                  fades out. All three share the same easing as the
                  rest of this site's motion for consistency. */}
              <span className="relative flex h-[18px] w-6 flex-col justify-between [@media(max-height:500px)]:h-[14px] [@media(max-height:500px)]:w-5">
                <span
                  className={`h-[2px] w-full origin-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? "translate-y-[8px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[2px] w-full rounded-full bg-white transition-opacity duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-[2px] w-full origin-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? "-translate-y-[8px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — a full-screen panel with the same nav links, only
          ever mounted on small screens (lg:hidden), shown on tap. The
          panel itself fades and scales in rather than just fading, and
          each link rises in with its own slight delay after that —
          opening feels like one continuous, smooth motion instead of a
          flat on/off toggle. Closing reverses instantly (no stagger),
          which reads as decisive rather than sluggish. */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-brand-green-dark/97 backdrop-blur-sm transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          menuOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.98] opacity-0"
        }`}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-1.5 text-[16px] font-semibold uppercase tracking-wide text-white transition-[color,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-brand-neon-green"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              transitionDelay: menuOpen ? `${100 + i * 60}ms` : "0ms",
            }}
          >
            <RollingLabel text={link.label} />
          </a>
        ))}
      </div>

      {/* The headline block — anchored low in the frame (bottom-left)
          so the footage above it stays the subject, and revealed as a
          single unit once the video ends: one container fading, rising
          and un-blurring together, rather than each line arriving on
          its own. */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 pb-14 transition-[opacity,transform,filter] duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] [@media(max-height:500px)]:pb-5 sm:pb-16 lg:pb-20 ${
          videoEnded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: videoEnded ? "translateY(0)" : "translateY(32px)",
          filter: videoEnded ? "blur(0px)" : "blur(8px)",
          transitionDelay: videoEnded ? "250ms" : "0ms",
        }}
      >
        <div className="mx-auto max-w-[1500px] px-4 lg:px-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 [@media(max-height:500px)]:hidden">
             
              <span className="text-[11px] font-bold tracking-[0.3em] text-brand-gold-light sm:text-[12px]">
                VAIBHAV VEDA GREEN VENTURES
              </span>
            </div>

            <h1 className="mt-4 font-sans text-[36px] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] [@media(max-height:500px)]:mt-0 [@media(max-height:500px)]:text-[24px] sm:text-[52px] lg:text-[64px]">
              <span className="text-brand-neon-green">Sustainable</span> Today.
              <br />
              Stronger Tomorrow.
            </h1>

            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-[12px] sm:text-[17px]">
              Progress becomes meaningful when people, ideas and purpose come together.
            </p>

            <div className="pointer-events-auto mt-7 flex flex-wrap items-center gap-3 [@media(max-height:500px)]:mt-2.5">
              <a
                href="#about"
                onClick={(e) => {
                  // About lives inside the pinned Hero→About transition,
                  // not at its own scroll offset — it's fully in view one
                  // viewport-height of scroll into the page (see
                  // HeroAboutTransition's SCROLL_SPAN_MULTIPLIER), so jump
                  // a little past that, into the hold zone.
                  e.preventDefault();
                  const vh = window.visualViewport?.height ?? window.innerHeight;
                  window.scrollTo({ top: vh * 1.3, behavior: "smooth" });
                }}
                className="rounded-full bg-brand-neon-green px-6 py-3 text-[12px] font-bold uppercase tracking-wide text-brand-green-dark shadow-[0_8px_24px_-8px_rgba(57,255,20,0.6)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white [@media(max-height:500px)]:px-4 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[10px] sm:text-[13px]"
              >
                Discover Vaibhav Veda
              </a>
              <a
                href="#verticals"
                className="rounded-full border border-white/60 bg-white/10 px-6 py-3 text-[12px] font-bold uppercase tracking-wide text-white backdrop-blur-md transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-neon-green hover:text-brand-neon-green [@media(max-height:500px)]:px-4 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[10px] sm:text-[13px]"
              >
                Explore Our Verticals
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
