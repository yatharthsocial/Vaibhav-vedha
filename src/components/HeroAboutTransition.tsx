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
// Extra viewport-heights of scroll, once About has fully slid into
// place, during which it just stays put before the section releases
// into whatever comes next. Without this, the pinned wrapper ends the
// instant the slide-in finishes, so continuing to scroll hands off to
// the next section immediately — About never gets a moment to actually
// be read before it's gone.
const HOLD_SPAN_MULTIPLIER = 0.75;

// About's own content (eyebrow, headline, paragraph, stats, cards) fades
// and rises in one piece at a time as the panel slides into place,
// rather than all snapping into view together the moment the slide
// finishes — each [data-reveal] element (in DOM order) gets its own
// slice of the same progress value. REVEAL_START is how far into the
// slide the first element begins; REVEAL_STAGGER offsets each
// following element's start; REVEAL_WINDOW is how much progress each
// one takes to go from invisible to fully in place.
const REVEAL_START = 0.05;
const REVEAL_STAGGER = 0.09;
const REVEAL_WINDOW = 0.35;
const REVEAL_RISE_PX = 18;
// Index of the stats row within the [data-reveal] list (in DOM order:
// eyebrow, headline, paragraph, stats row, mission card, vision card) —
// used to drive the stat numbers' count-up off the same reveal timing
// the row itself fades in with, instead of a separate timer.
const STATS_REVEAL_INDEX = 3;

// Used only as the divisor for the scroll-progress fraction below —
// the pinned panel's actual on-screen size comes from the CSS `lvh`
// units in the JSX, not from this. A live, address-bar-aware value is
// still preferable here (over a value cached once at mount) so the
// fade/blur timing tracks the same scroll distance the user is
// actually experiencing, even though small mismatches against the
// constant `lvh` box are harmless — this only shifts *when* the
// content fades in, never the box's size or position.
const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

export default function HeroAboutTransition() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const aboutLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    // Only ever read, never written back to the DOM — the wrapper and
    // sticky panel get their actual size natively from CSS `dvh` units
    // (see the JSX below), which the browser itself keeps in sync with
    // the live viewport as the address bar shows/hides. This value
    // exists purely so the scroll-progress math below has a number to
    // divide by; it doesn't drive any element's real size, so however
    // often it's updated, it can never fight an in-progress touch
    // scroll the way writing heights via JS previously did (that was
    // the actual cause of the pinned panel visibly shifting/gapping
    // mid-scroll — this removes that mechanism entirely rather than
    // trying to time around it).
    let viewportHeight = getViewportHeight();
    // Queried once — AboutSection's markup is static, so this NodeList
    // stays valid for the component's lifetime and doesn't need
    // re-querying on every scroll frame.
    const revealEls =
      aboutLayerRef.current?.querySelectorAll<HTMLElement>("[data-reveal]") ?? null;
    const countEls =
      aboutLayerRef.current?.querySelectorAll<HTMLElement>("[data-count]") ?? null;

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
      const scrolled = -rect.top;
      // Only the SCROLL_SPAN_MULTIPLIER portion drives the animation —
      // scrolling further than that (into the hold zone) just clamps
      // progress at 1, so About sits fully in view, unblurred, for the
      // rest of the pinned wrapper instead of the transition dragging
      // out over the whole thing.
      const transitionSpan = viewportHeight * SCROLL_SPAN_MULTIPLIER;
      const progress =
        transitionSpan > 0 ? Math.min(1, Math.max(0, scrolled / transitionSpan)) : 0;

      // Hero itself never moves and never scales — it only blurs
      // behind the incoming panel. (An earlier version also scaled it
      // up slightly here, meant to compensate for a blur-edge
      // artifact, but that scale was itself a real, literal zoom
      // happening on every scroll — worse than the problem it was
      // meant to fix. Removed; blur alone doesn't move or resize
      // anything.)
      heroLayer.style.filter = `blur(${progress * MAX_BLUR_PX}px)`;

      // About starts fully off-screen to the right and slides to cover
      // it, arriving out of focus and sharpening as it settles into
      // place — a soft "focus pull" rather than a hard, instantly-crisp
      // cut, so the content itself feels like it's smoothly resolving.
      aboutLayer.style.transform = `translate3d(${(1 - progress) * 100}%, 0, 0)`;
      const sharpenProgress = Math.min(1, progress / ABOUT_SHARPEN_BY);
      aboutLayer.style.filter = `blur(${(1 - sharpenProgress) * ABOUT_BLUR_PX}px)`;

      // Each element gets its own start point, staggered in DOM order,
      // so they settle into place one after another rather than all at
      // once — same clamp-and-map approach as progress itself.
      const revealAt = (i: number) => {
        const start = REVEAL_START + i * REVEAL_STAGGER;
        return Math.min(1, Math.max(0, (progress - start) / REVEAL_WINDOW));
      };

      revealEls?.forEach((el, i) => {
        const t = revealAt(i);
        el.style.opacity = String(t);
        el.style.transform = `translate3d(0, ${(1 - t) * REVEAL_RISE_PX}px, 0)`;
      });

      // Stat numbers count up from 0 to their target in step with the
      // stats row's own reveal, instead of just fading in already at
      // full value — reuses that row's exact timing so the count
      // finishes right as the row finishes settling into place.
      const statsT = revealAt(STATS_REVEAL_INDEX);
      countEls?.forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        el.textContent = String(Math.round(target * statsT));
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    // Debounced rather than reacting to every single resize event —
    // still worth updating the cached viewportHeight number once
    // things settle (e.g. after an orientation change), just never as
    // a DOM height write mid-gesture.
    let resizeSettleTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      resizeSettleTimer = setTimeout(() => {
        viewportHeight = getViewportHeight();
        onScroll();
      }, 150);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    // Sized with lvh (large viewport height — the address-bar-collapsed
    // size), not dvh. dvh recalculates live as the address bar
    // animates, and on Android Chrome the browser can't always repaint
    // a full-bleed video/photo in sync with that live resize, which is
    // exactly what showed up as a black gap flashing in at the bottom
    // while scrolling. lvh is a fixed value — the panel never resizes
    // during the gesture at all, so there's nothing to lag behind: it
    // starts sized for the toolbar-collapsed case, and when the
    // toolbar's actually still showing, the excess is simply the part
    // sitting behind/under it rather than an empty gap.
    // 275lvh = 100 pinned + 100 scroll span + 75 hold.
    <div ref={wrapperRef} className="relative h-[275lvh]">
      <div ref={stickyRef} className="sticky top-0 h-[100lvh] w-full overflow-hidden">
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
