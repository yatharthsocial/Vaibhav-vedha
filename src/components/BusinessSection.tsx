"use client";

import { ArrowRight, Briefcase, Building2, GraduationCap, Leaf, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

const verticals: {
  key: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  tags: string;
  image: string;
}[] = [
  {
    key: "green",
    title: "Green",
    icon: Leaf,
    color: "#39ff14",
    tags: "Sustainability | Renewable Energy | Green Infrastructure",
    image: "/verticals/green.jpg",
  },
  {
    key: "build",
    title: "Build",
    icon: Building2,
    color: "#e0be4a",
    tags: "Real Estate | Construction | Interiors",
    image: "/verticals/build.jpg",
  },
  {
    key: "learn",
    title: "Learn",
    icon: GraduationCap,
    color: "#6fb8ff",
    tags: "Education | Skill Development | Training",
    image: "/verticals/learn.jpg",
  },
  {
    key: "advise",
    title: "Advise",
    icon: Briefcase,
    color: "#c19bff",
    tags: "Business Advisory | Financial Advisory | Strategy",
    image: "/verticals/advise.jpg",
  },
  {
    key: "digital",
    title: "Digital",
    icon: Monitor,
    color: "#4ee2e8",
    tags: "Technology | IT Solutions | Automation",
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

  return (
    <div ref={wrapperRef} className="relative h-[400svh] bg-black">
      <div ref={stickyRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Each vertical's own photo as a full-bleed background,
            crossfading to the next as the active step changes. */}
        <div className="absolute inset-0">
          {verticals.map((v, i) => (
            <div
              key={v.key}
              className="absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
              aria-hidden={i !== activeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-brand-gold-light/60" />
            <span className="text-[11px] font-bold tracking-[0.3em] text-brand-gold-light">
              OUR VERTICALS
            </span>
            <span className="h-px w-10 bg-brand-gold-light/60" />
          </div>

          <div className="relative h-[280px] w-full max-w-lg sm:h-[320px]">
            {verticals.map((v, i) => {
              const Icon = v.icon;
              const isActive = i === activeIndex;
              return (
                <div
                  key={v.key}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 24}px)`,
                  }}
                  aria-hidden={!isActive}
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-black/30 backdrop-blur-sm"
                    style={{ borderColor: v.color, color: v.color }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="font-sans text-[40px] font-extrabold uppercase leading-none tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[52px]">
                    {v.title}
                  </h3>
                  <p className="max-w-md text-[13px] leading-relaxed text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-[14px]">
                    {v.tags}
                  </p>
                  <a
                    href="#"
                    className="mt-1 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:text-brand-neon-green"
                    style={{ color: v.color }}
                  >
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
