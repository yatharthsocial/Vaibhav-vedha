"use client";

import { useEffect, useRef, useState } from "react";
import GrowthModelHub from "./GrowthModelHub";

const themes: { title: string; text: string; image: string }[] = [
  {
    title: "Green Economy",
    text: "Building opportunities around renewable energy, sustainability, green skills and emerging green-sector markets.",
    image: "/verticals/green.jpg",
  },
  {
    title: "Infrastructure & Projects",
    text: "Developing project-management and execution capabilities for real estate, infrastructure and allied projects.",
    image: "/verticals/build.jpg",
  },
  {
    title: "Skills & Employability",
    text: "Connecting students and professionals to industry-specific programmes and employment-oriented skills.",
    image: "/verticals/learn.jpg",
  },
  {
    title: "Institutional Partnerships",
    text: "Creating structured collaborations involving government institutions, universities, industry and enterprises.",
    image: "/verticals/advise.jpg",
  },
  {
    title: "Strategic Growth",
    text: "Using partnerships, joint ventures, SPVs and sector-focused platforms to create scalable business opportunities.",
    image: "/video/hero-last-frame.jpg",
  },
];

// Same one-shot, low-threshold reveal used across the rest of the site
// (see LeadershipSection, FAQSection).
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible] as const;
}

const riseClass =
  "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
const rise = (visible: boolean, delayMs: number) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transitionDelay: visible ? `${delayMs}ms` : "0ms",
});

// Scroll distance (in lvh) each theme holds the pinned block for.
const THEME_SCROLL_VH = 60;

// Same before/active/after states the Verticals section uses, so the
// photo card reuses its .vertical-bg / .vertical-swap transitions.
const stateFor = (i: number, active: number) =>
  i === active ? "active" : i < active ? "before" : "after";

export default function BusinessPlatformSection() {
  const [headRef, headVisible] = useReveal<HTMLDivElement>();
  const [themesRef, themesVisible] = useReveal<HTMLDivElement>();
  const [activeTheme, setActiveTheme] = useState(0);
  const themesWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll position through the pinned themes block → active theme.
  // Only state changes when the slice changes; the visual switch is
  // all CSS transitions.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const wrapper = themesWrapperRef.current;
      if (!wrapper) return;
      const span = wrapper.offsetHeight - window.innerHeight;
      const scrolled = -wrapper.getBoundingClientRect().top;
      const progress =
        span > 0 ? Math.min(0.9999, Math.max(0, scrolled / span)) : 0;
      const next = Math.floor(progress * themes.length);
      setActiveTheme((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Clicking a theme scrolls to the middle of its slice.
  const goToTheme = (i: number) => {
    const wrapper = themesWrapperRef.current;
    if (!wrapper) return;
    const span = wrapper.offsetHeight - window.innerHeight;
    const top = wrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((i + 0.5) / themes.length) * span,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="platform"
      className="relative w-full bg-[#f5f4f1] px-6 py-24 lg:px-16 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1300px]">
        {/* Header — one big editorial statement, not a label + title. */}
        <div ref={headRef}>
          <div
            className={`flex items-center justify-between border-b border-brand-green-dark/15 pb-4 ${riseClass}`}
            style={rise(headVisible, 0)}
          >
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold">
              Business Platform
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-green-dark/45">
              Develop · Advise · Execute · Scale
            </span>
          </div>

          <h2
            className={`mt-10 max-w-5xl font-sans font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-green-dark ${riseClass}`}
            style={{
              ...rise(headVisible, 120),
              fontSize: "clamp(34px, 5vw, 76px)",
            }}
          >
            One enterprise. Five verticals that{" "}
            <span className="text-brand-green-light">
              make each other stronger.
            </span>
          </h2>

          <p
            className={`mt-8 max-w-xl text-[15px] leading-relaxed text-black/55 sm:text-[16px] lg:ml-auto lg:mr-[8%] ${riseClass}`}
            style={rise(headVisible, 240)}
          >
            The corporate platform is envisioned as a multi-vertical enterprise
            with the ability to develop, advise, execute and scale projects —
            designed to be mutually reinforcing rather than operating as
            isolated businesses.
          </p>
        </div>

        {/* Themes explorer — pinned while the user scrolls through it:
            each theme owns an equal slice of the scroll range, and the
            list and photo card switch to it as that slice is reached
            (the switch itself is a CSS transition, so it's smooth no
            matter how the scroll arrives). The wrapper is one screen of
            pinned panel plus THEME_SCROLL_VH per theme. */}
        <div
          ref={themesWrapperRef}
          className="relative mt-16 lg:mt-24"
          style={{
            height: `calc(100lvh + ${themes.length * THEME_SCROLL_VH}lvh)`,
          }}
        >
          <div
            ref={themesRef}
            className="sticky top-0 flex h-[100lvh] flex-col justify-center py-10"
          >
            <div
              className={`flex items-baseline justify-between border-b border-brand-green-dark/15 pb-4 ${riseClass}`}
              style={rise(themesVisible, 0)}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-green-dark/50">
                Strategic Business Themes
              </span>
              <span className="text-[12px] font-bold tabular-nums text-brand-green-dark/40">
                0{activeTheme + 1} / 0{themes.length}
              </span>
            </div>

            <div className="mt-6 grid min-h-0 grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-14">
              {/* List — fills the card's height, rows spread evenly so
                  the first sits level with the card's top edge and the
                  last with its bottom. */}
              <ul className="order-2 flex flex-col justify-between lg:order-1">
                {themes.map((t, i) => {
                  const isActive = i === activeTheme;
                  return (
                    <li
                      key={t.title}
                      className={`border-t border-brand-green-dark/10 first:border-t-0 ${riseClass}`}
                      style={rise(themesVisible, 100 + i * 90)}
                    >
                      <button
                        type="button"
                        onClick={() => goToTheme(i)}
                        aria-pressed={isActive}
                        className="group grid w-full grid-cols-[28px_36px_minmax(0,1fr)] items-center py-2.5 text-left sm:grid-cols-[36px_56px_minmax(0,1fr)] lg:py-4"
                      >
                        <span
                          className={`text-[12px] font-bold tabular-nums transition-colors duration-500 ${
                            isActive
                              ? "text-brand-gold"
                              : "text-brand-green-dark/30"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        {/* Fixed slot, so every title starts at the
                            same x — the line grows within it. */}
                        <span
                          className={`h-[2px] w-6 origin-left bg-brand-green-light transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-10 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                        <span
                          className={`font-sans font-extrabold leading-[1.1] tracking-[-0.025em] transition-colors duration-500 ${
                            isActive
                              ? "text-brand-green-dark"
                              : "text-brand-green-dark/20 group-hover:text-brand-green-dark/40"
                          }`}
                          style={{ fontSize: "clamp(18px, 2.6vw, 40px)" }}
                        >
                          {t.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div
                className={`order-1 h-[38lvh] lg:order-2 lg:h-[min(66lvh,620px)] ${riseClass}`}
                style={rise(themesVisible, 200)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-brand-green-dark">
                  {themes.map((t, i) => (
                    <div
                      key={t.title}
                      data-state={stateFor(i, activeTheme)}
                      className="vertical-bg absolute inset-0"
                      aria-hidden={i !== activeTheme}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-brand-green-dark/45 to-brand-green-dark/5" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                    <div className="relative h-[6em] overflow-hidden text-[14px] leading-[1.5] text-white/85 sm:h-[4.5em] sm:text-[17px]">
                      {themes.map((t, i) => (
                        <p
                          key={t.title}
                          data-state={stateFor(i, activeTheme)}
                          className="vertical-swap absolute inset-x-0 top-0"
                          style={{ transitionDelay: "60ms" }}
                        >
                          {t.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GrowthModelHub />
      </div>
    </section>
  );
}
