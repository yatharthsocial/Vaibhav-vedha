"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const verticals: {
  slug: string;
  title: string;
  color: string;
  tags: string;
  image: string;
}[] = [
  {
    slug: "real-estate",
    title: "Real Estate",
    color: "#e0be4a",
    tags: "Residential & Commercial | Farm Plots | Sustainable Design",
    image: "/verticals/build.jpg",
  },
  {
    slug: "infrastructure",
    title: "Infrastructure",
    color: "#39ff14",
    tags: "Transportation | Utilities | Urban Development",
    image: "/verticals/green.jpg",
  },
  {
    slug: "legal",
    title: "Legal Consulting",
    color: "#c19bff",
    tags: "Regulatory Compliance | Risk Advisory | Corporate Law",
    image: "/verticals/advise.jpg",
  },
  {
    slug: "interiors",
    title: "Interiors & Design",
    color: "#6fb8ff",
    tags: "Residential & Commercial | Space Planning | Design",
    image: "/verticals/learn.jpg",
  },
  {
    slug: "media",
    title: "Media & Branding",
    color: "#4ee2e8",
    tags: "Branding | Advertising | Media Strategy",
    image: "/verticals/digital.jpg",
  },
];

const STEPS = verticals.length;

// How many viewport-heights of scroll distance drive the step-through,
// on top of the one viewport-height the pinned panel itself occupies —
// matches the rest of this site's pinned-scroll sections (see
// HeroAboutTransition), just scaled up for 5 steps instead of 2.
const SCROLL_SPAN_MULTIPLIER = 3;

const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

export default function BusinessSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    let viewportHeight = getViewportHeight();

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
    // needed. Each further step of scroll steps the active vertical
    // forward, ending on DIGITAL.
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

  // Lets the index list below double as real navigation, not just a
  // readout — jumps to the middle of whichever step's slice of the
  // scroll range, computed the same way updateProgress reads it back.
  const goToStep = (index: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const viewportHeight = getViewportHeight();
    const total = viewportHeight * SCROLL_SPAN_MULTIPLIER;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: wrapperTop + ((index + 0.5) / STEPS) * total, behavior: "smooth" });
  };

  return (
    <div id="verticals" ref={wrapperRef} className="relative h-[400svh] bg-black">
      <div ref={stickyRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Each vertical's own photo as a full-bleed background,
            crossfading to the next as the active step changes. */}
        <div className="absolute inset-0">
          {verticals.map((v, i) => (
            <div
              key={v.slug}
              className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
              aria-hidden={i !== activeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          ))}
        </div>

        {/* Centered, like the content itself actually deserves the
            middle of the frame — but now paired with a real index
            row underneath, so there's an actual sense of "step 2 of
            5" instead of verticals just silently replacing each
            other with no record of where you are or where else you
            could go. Each list entry is real navigation (goToStep),
            not just a readout. */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-brand-gold-light/60" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-brand-gold-light">
              OUR VERTICALS
            </span>
            <span className="h-px w-10 bg-brand-gold-light/60" />
          </div>

          <div className="relative h-[190px] w-full max-w-lg sm:h-[220px]">
            {verticals.map((v, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={v.slug}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 20}px)`,
                  }}
                  aria-hidden={!isActive}
                >
                  <h3 className="font-sans text-[36px] font-extrabold uppercase leading-[1.05] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[52px]">
                    {v.title}
                  </h3>
                  <p className="max-w-md text-[13px] leading-relaxed text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-[14px]">
                    {v.tags}
                  </p>
                  <a
                    href="/#contact"
                    tabIndex={isActive ? 0 : -1}
                    className="group mt-1 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors duration-300 sm:text-[13px]"
                    style={{ color: v.color }}
                  >
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:mt-10">
            {verticals.map((v, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => goToStep(i)}
                  className="group flex items-center gap-2"
                >
                  <span
                    className="font-sans text-[11px] font-bold tabular-nums transition-colors duration-300"
                    style={{ color: isActive ? v.color : "rgba(255,255,255,0.35)" }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-wide transition-colors duration-300 sm:text-[12px] ${
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    {v.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
