"use client";

import { useEffect, useRef } from "react";
import AboutSection from "./AboutSection";
import Hero from "./Hero";

// How much the hero blurs by once About has fully covered it.
const MAX_BLUR_PX = 12;
// How blurred About itself starts while still off-screen, before it
// sharpens into focus as it slides in.
const ABOUT_BLUR_PX = 10;
// Fraction of the scroll progress at which About finishes sharpening —
// under 1 so it settles into full focus a little before the slide-in
// itself finishes, rather than staying soft right up to the last pixel.
const ABOUT_SHARPEN_BY = 0.75;

export default function HeroAboutTransition() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const aboutLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    // Drives both the slide-in and the blur directly off scroll
    // position (rather than a CSS transition) so they track the scroll
    // 1:1 — that's what makes it feel physically smooth rather than
    // laggy or delayed. This runs on every screen size: it only reads
    // scroll position and sets CSS transform/filter, it never calls
    // preventDefault or otherwise fights the browser's own scrolling,
    // so it doesn't have the jank/fighting problem true scroll-hijacking
    // has on touch devices.
    const compute = () => {
      ticking = false;
      const wrapper = wrapperRef.current;
      const heroLayer = heroLayerRef.current;
      const aboutLayer = aboutLayerRef.current;
      if (!wrapper || !heroLayer || !aboutLayer) return;

      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;

      // Hero itself never moves — it just blurs behind the incoming panel.
      heroLayer.style.filter = `blur(${progress * MAX_BLUR_PX}px)`;

      // About starts fully off-screen to the right and slides to cover
      // it, arriving out of focus and sharpening as it settles into
      // place — a soft "focus pull" rather than a hard, instantly-crisp
      // cut, so the content itself feels like it's smoothly resolving.
      aboutLayer.style.transform = `translate3d(${(1 - progress) * 100}%, 0, 0)`;
      const sharpenProgress = Math.min(1, progress / ABOUT_SHARPEN_BY);
      aboutLayer.style.filter = `blur(${(1 - sharpenProgress) * ABOUT_BLUR_PX}px)`;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    // Extra height (200svh: 100 to stay pinned + 100 of scroll distance
    // to drive the reveal), on every screen size.
    <div ref={wrapperRef} className="relative h-[200svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          ref={heroLayerRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "filter" }}
        >
          <Hero />
        </div>
        <div
          ref={aboutLayerRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "transform, filter" }}
        >
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
