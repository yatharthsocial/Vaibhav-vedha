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
// How many viewport-heights of scroll distance drive the reveal, on
// top of the one viewport-height the pinned panel itself occupies —
// 1 more, matching the original 200svh (100 pinned + 100 scroll span).
const SCROLL_SPAN_MULTIPLIER = 1;

// The most accurate live viewport height available: visualViewport
// tracks a mobile browser's collapsible address bar in real time,
// which plain window.innerHeight doesn't always do promptly.
const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

export default function HeroAboutTransition() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const aboutLayerRef = useRef<HTMLDivElement>(null);

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

    // Drives both the slide-in and the blur directly off scroll
    // position (rather than a CSS transition) so they track the scroll
    // 1:1 — that's what makes it feel physically smooth rather than
    // laggy or delayed. Only reads layout (getBoundingClientRect) and
    // writes transform/filter — both of those are compositor-only
    // properties that don't trigger layout, so this stays cheap enough
    // to run on every scroll frame without jank.
    const updateProgress = () => {
      ticking = false;
      const wrapper = wrapperRef.current;
      const heroLayer = heroLayerRef.current;
      const aboutLayer = aboutLayerRef.current;
      if (!wrapper || !heroLayer || !aboutLayer) return;

      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - viewportHeight;
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
    // Fallback height for the instant before JS has run (matches the
    // usual case: address bar expanded, so svh is accurate then) —
    // syncHeights() immediately overrides both this and the sticky
    // panel below with a live-measured pixel height once mounted.
    <div ref={wrapperRef} className="relative h-[200svh]">
      <div ref={stickyRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
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
          // Matches exactly what updateProgress() would set at
          // progress 0 — off-screen right, still soft. Without this,
          // the element has no transform at all until the scroll
          // effect first runs (post-hydration), and an untransformed
          // `absolute inset-0` sibling painted after Hero in the DOM
          // just fully covers it. That's what was showing About first
          // on every load: it sat there, fully covering Hero, until JS
          // caught up and pushed it off-screen a beat later.
          style={{
            willChange: "transform, filter",
            transform: "translate3d(100%, 0, 0)",
            filter: `blur(${ABOUT_BLUR_PX}px)`,
          }}
        >
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
