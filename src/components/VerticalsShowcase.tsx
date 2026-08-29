"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Leaf,
  Monitor,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

const verticals: {
  key: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  lines: [string, string];
}[] = [
  {
    key: "green",
    title: "GREEN",
    icon: Leaf,
    color: "#1f7a45",
    lines: ["Sustainability | Renewable Energy", "Landscaping | ESG | Green Infrastructure"],
  },
  {
    key: "build",
    title: "BUILD",
    icon: Building2,
    color: "#c9711f",
    lines: ["Real Estate | Construction", "Development | Interiors | Infrastructure"],
  },
  {
    key: "learn",
    title: "LEARN",
    icon: GraduationCap,
    color: "#2b6fb8",
    lines: ["Education | Skill Development", "Training | Leadership"],
  },
  {
    key: "advise",
    title: "ADVISE",
    icon: Briefcase,
    color: "#7a4bbd",
    lines: ["Business Advisory | Financial Advisory", "Property Advisory | Strategy"],
  },
  {
    key: "digital",
    title: "DIGITAL",
    icon: Monitor,
    color: "#1a9aa0",
    lines: ["Technology | IT Solutions", "Digital Platforms | Automation"],
  },
];

const STEPS = verticals.length;

// How many viewport-heights of scroll distance drive the step-through,
// on top of the one viewport-height the pinned panel itself occupies —
// 3 more, matching the original 400vh (100 pinned + 300 scroll span).
const SCROLL_SPAN_MULTIPLIER = 3;

// The most accurate live viewport height available: visualViewport
// tracks a mobile browser's collapsible address bar in real time,
// which plain window.innerHeight doesn't always do promptly.
const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

// Base layout for the three ambient blobs each vertical's background
// uses. Each vertical rotates through these positions (offset by its
// own index) so the compositions differ, not just the color.
const BLOB_SLOTS = [
  { top: "6%", left: "8%", size: 460, duration: 16 },
  { top: "52%", left: "66%", size: 420, duration: 20 },
  { top: "70%", left: "14%", size: 340, duration: 24 },
];

export default function VerticalsShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    // Cached rather than re-read on every scroll tick — see syncHeights.
    let viewportHeight = getViewportHeight();

    // Writes the wrapper/pinned-panel heights from a live viewport
    // measurement, so the pinned panel never falls short of the real
    // viewport once the address bar collapses (see updateProgress's
    // comment for why svh/vh alone can't do this). Deliberately only
    // called on actual resize events (plus once at mount) — NOT on
    // every scroll tick. Writing an ancestor's height while a touch
    // scroll gesture is in progress fights the browser's own handling
    // of that gesture and is what was making the page jump/stutter
    // while scrolling on a real phone.
    const syncHeights = () => {
      const wrapper = wrapperRef.current;
      const sticky = stickyRef.current;
      if (!wrapper || !sticky) return;
      viewportHeight = getViewportHeight();
      wrapper.style.height = `${viewportHeight * (1 + SCROLL_SPAN_MULTIPLIER)}px`;
      sticky.style.height = `${viewportHeight}px`;
    };

    // GREEN (index 0) is what's on screen the moment this section is
    // reached — progress is 0 there, so no extra "default" state is
    // needed. Each further step of scroll steps the active card
    // forward in sequence, ending on DIGITAL. Only reads layout
    // (getBoundingClientRect) and a cached viewport height — no writes
    // to element height — so it stays cheap enough to run on every
    // scroll frame without jank.
    const updateProgress = () => {
      ticking = false;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - viewportHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      const index = Math.min(STEPS - 1, Math.floor(progress * STEPS));
      setActiveIndex((prev) => (prev === index ? prev : index));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    const onResize = () => {
      syncHeights();
      onScroll();
    };

    syncHeights();
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    // Fallback height for the instant before JS has run — syncHeights()
    // immediately overrides both this and the sticky panel below with
    // a live-measured pixel height once mounted.
    <div ref={wrapperRef} className="relative h-[400svh] bg-white">
      <div ref={stickyRef} className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Ambient, per-vertical background — a separate fixed layer
            (never slides with the cards) so each vertical's color wash
            crossfades smoothly in place as the active step changes. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {verticals.map((v, i) => (
            <div
              key={v.key}
              className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            >
              {BLOB_SLOTS.map((slot, j) => {
                const rotated = BLOB_SLOTS[(j + i) % BLOB_SLOTS.length];
                return (
                  <div
                    key={j}
                    className="absolute rounded-full"
                    style={{
                      top: rotated.top,
                      left: rotated.left,
                      width: slot.size,
                      height: slot.size,
                      backgroundColor: v.color,
                      opacity: 0.22,
                      filter: "blur(90px)",
                      animation: `blob-float ${slot.duration}s ease-in-out infinite`,
                      animationDelay: `${j * 1.4}s`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 py-8 sm:py-12 lg:px-10 lg:py-0">
          <div className="mb-6 flex items-center justify-center gap-3 sm:mb-10">
            <span className="h-px w-10 bg-brand-gold/60" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-brand-gold">
              OUR VERTICALS
            </span>
            <span className="h-px w-10 bg-brand-gold/60" />
          </div>

          <div className="relative h-[300px] sm:h-[360px]">
            {verticals.map((v, i) => {
              const Icon = v.icon;
              const offset = (i - activeIndex) * 100;
              return (
                <div
                  key={v.key}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `translate3d(${offset}%, 0, 0)` }}
                  aria-hidden={i !== activeIndex}
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white lg:h-20 lg:w-20"
                    style={{ borderColor: v.color, color: v.color }}
                  >
                    <Icon className="h-7 w-7 lg:h-9 lg:w-9" />
                  </span>
                  <h3 className="text-[20px] font-extrabold tracking-wide text-black/85 lg:text-[26px]">
                    {v.title}
                  </h3>
                  <p className="max-w-md text-[13px] leading-relaxed text-black/50 lg:text-[14px]">
                    {v.lines[0]}
                    <br />
                    {v.lines[1]}
                  </p>
                  <a
                    href="#"
                    className="mt-1 flex items-center gap-1 text-[11px] font-bold tracking-wide text-brand-green-dark hover:text-brand-green lg:text-[12px]"
                  >
                    LEARN MORE
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
            {verticals.map((v, i) => (
              <span
                key={v.key}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? "28px" : "8px",
                  backgroundColor: i === activeIndex ? v.color : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
