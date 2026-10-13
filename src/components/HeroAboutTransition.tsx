"use client";

import { useEffect, useRef } from "react";
import AboutSection from "./AboutSection";
import Hero from "./Hero";

// How much the hero blurs by once About has fully covered it.
const MAX_BLUR_PX = 12;
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

// About's own content (photo, meta row, headline lines, text, list,
// CTA) plays as a timed, staggered CSS animation (see the #about rules
// in globals.css) rather than being scrubbed by scroll position — a
// scroll wheel moves in discrete ticks, so scrubbed reveals visibly
// jumped. The animation starts once the panel is this far in, and
// resets (so it can play again) once it's scrolled back below
// ABOUT_RESET_AT — the gap between the two stops it flickering when
// the user hovers around a single threshold.
const ABOUT_REVEAL_AT = 0.8;
const ABOUT_RESET_AT = 0.1;
// Fraction of the remaining distance the slide/blur covers each frame
// as it eases toward the scroll position — lower is a softer glide; 1
// would track the scroll exactly (and jump with every wheel tick).
const SLIDE_EASE = 0.1;
// Once the reveal starts, scrolling *down* is held for this long — about
// as long as the staggered About animation takes to finish (last item's
// delay + duration in the #about rules in globals.css) — so a fast
// scroll can't carry the user into the next section before the photo
// and text have actually appeared. Scrolling up is never blocked, and
// the hold only happens once per pass (reset alongside the reveal).
const ABOUT_HOLD_MS = 2000;
const HOLD_KEYS = new Set(["ArrowDown", "PageDown", "End", " ", "Spacebar"]);
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
    const aboutSection = aboutLayerRef.current?.querySelector<HTMLElement>("#about") ?? null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // targetProgress is where the scroll position says the transition
    // should be; currentProgress eases toward it every frame, so
    // discrete wheel ticks become one continuous glide. Only reads
    // layout (getBoundingClientRect) and writes transform/filter —
    // compositor-only properties — so it stays cheap per frame.
    let targetProgress = 0;
    let currentProgress = 0;
    let easeFrame: number | null = null;

    let heldThisPass = false;
    let holdUntil = 0;
    const isHolding = () => performance.now() < holdUntil;

    const render = (progress: number) => {
      const heroLayer = heroLayerRef.current;
      const aboutLayer = aboutLayerRef.current;
      if (!heroLayer || !aboutLayer) return;

      // Hero itself never moves and never scales — it only blurs
      // behind the incoming panel.
      heroLayer.style.filter = `blur(${progress * MAX_BLUR_PX}px)`;

      // About starts fully off-screen to the right and slides to cover
      // it. Transform only — an earlier version also blurred this
      // whole full-screen layer as it arrived, but re-blurring a
      // viewport-sized layer (photo included) every frame is exactly
      // what made the About image stutter, especially in Safari.
      aboutLayer.style.transform = `translate3d(${(1 - progress) * 100}%, 0, 0)`;

      if (aboutSection) {
        if (progress >= ABOUT_REVEAL_AT) aboutSection.dataset.revealed = "";
        else if (progress <= ABOUT_RESET_AT) delete aboutSection.dataset.revealed;
      }
    };

    const ease = () => {
      easeFrame = null;
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0005) {
        currentProgress = targetProgress;
      } else {
        currentProgress += diff * SLIDE_EASE;
        easeFrame = requestAnimationFrame(ease);
      }
      render(currentProgress);
    };

    const updateProgress = (snap = false) => {
      ticking = false;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      // Only the SCROLL_SPAN_MULTIPLIER portion drives the animation —
      // scrolling further than that (into the hold zone) just clamps
      // progress at 1, so About sits fully in view, unblurred, for the
      // rest of the pinned wrapper.
      const transitionSpan = viewportHeight * SCROLL_SPAN_MULTIPLIER;
      const rawProgress = transitionSpan > 0 ? scrolled / transitionSpan : 0;
      targetProgress = Math.min(1, Math.max(0, rawProgress));

      // Start the hold off the *raw* scroll position (not the smoothed
      // one), so it engages the moment the user actually crosses the
      // threshold. If a single big jump (fling, Page Down) already
      // carried them past the fully-in point, pull back to it — still
      // inside the pinned range, so About is what they see.
      if (!reduceMotion && aboutSection) {
        if (!heldThisPass && rawProgress >= ABOUT_REVEAL_AT) {
          heldThisPass = true;
          holdUntil = performance.now() + ABOUT_HOLD_MS;
          aboutSection.dataset.revealed = "";
        } else if (rawProgress <= ABOUT_RESET_AT) {
          heldThisPass = false;
        }
        if (isHolding() && rawProgress > 1) {
          window.scrollTo({ top: window.scrollY - (scrolled - transitionSpan), behavior: "instant" });
          targetProgress = 1;
        }
      }

      if (snap || reduceMotion) {
        currentProgress = targetProgress;
        render(currentProgress);
      } else if (easeFrame === null) {
        easeFrame = requestAnimationFrame(ease);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => updateProgress());
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

    // Downward-scroll blockers for the hold — non-passive so they can
    // cancel the gesture. Upward scrolling always passes through.
    const onWheel = (e: WheelEvent) => {
      if (isHolding() && e.deltaY > 0) e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isHolding() || !HOLD_KEYS.has(e.key)) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
    };
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      // Finger moving up = page scrolling down.
      if (isHolding() && touchStartY - y > 0) e.preventDefault();
    };

    // Snap on load, so a page restored mid-scroll doesn't glide in
    // from the top. A page restored already past About shouldn't be
    // held, so the hold is only armed once the user is above it.
    updateProgress(true);
    if (targetProgress >= ABOUT_REVEAL_AT) {
      heldThisPass = true;
      aboutSection?.setAttribute("data-revealed", "");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      if (easeFrame !== null) cancelAnimationFrame(easeFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
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
            willChange: "transform",
            transform: "translate3d(100%, 0, 0)",
          }}
        >
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
