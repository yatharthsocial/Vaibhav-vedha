"use client";

import { useEffect, useRef, useState } from "react";

const images: { src: string; caption: string }[] = [
  { src: "/verticals/build.jpg", caption: "Real Estate & Construction" },
  { src: "/verticals/green.jpg", caption: "Green & Sustainability" },
  { src: "/verticals/learn.jpg", caption: "Education & Skilling" },
  { src: "/verticals/advise.jpg", caption: "Business Advisory" },
  { src: "/verticals/digital.jpg", caption: "Digital Solutions" },
];

// How long the watermark takes to type itself out once the panel
// scrolls into view — a fixed, time-based reveal (not tied to scroll
// depth), so it starts the moment the section is looked at rather than
// requiring the user to already be scrolling past it. The image sweep
// below is the part that's actually scroll-linked.
const TYPE_DURATION_MS = 900;

// How many viewport-heights of extra scroll drive the image sweep.
const SCROLL_SPAN_MULTIPLIER = 1.4;

// The pinned panel's own height (min(92lvh,780px), set directly on the
// two elements below since Tailwind's build-time class scanner can't
// see a value assembled from a JS template string) — heading, watermark
// and image track all live inside it, so the whole composition (not
// just the images) pins together once it reaches the top of the
// viewport, exactly where it first sits fully in view, rather than the
// heading scrolling away on its own beforehand.

// Same technique as the Hero→About pinned transition: lvh (not dvh) so
// the pinned panel's own size never changes mid-scroll as a mobile
// browser's address bar animates — see HeroAboutTransition.tsx for the
// full reasoning. This value is only ever read for the scroll-progress
// math below, never written back to any element's size.
const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

export default function GallerySection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Types the watermark out once, the moment the panel itself is
  // roughly a quarter into view — independent of how far the user then
  // scrolls, so there's something happening immediately rather than a
  // blank pinned box waiting for scroll progress to catch up.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTyped(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drives the horizontal sweep: scroll progress (0 to 1) through the
  // pinned wrapper maps linearly onto the track's full travel distance
  // — fully off-screen right to fully off-screen left (viewport width
  // plus the track's own width), so every image actually exits past
  // the left edge rather than just settling into view — only once
  // that's done does the wrapper's scroll range end and the page
  // release into normal scroll below it. The heading and watermark
  // above the track stay completely still throughout — only the track
  // itself moves.
  useEffect(() => {
    let ticking = false;
    let viewportHeight = getViewportHeight();
    let viewportWidth = 0;
    let trackWidth = 0;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      viewportWidth = viewport.clientWidth;
      trackWidth = track.scrollWidth;
    };

    const updateProgress = () => {
      ticking = false;
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const transitionSpan = viewportHeight * SCROLL_SPAN_MULTIPLIER;
      const progress =
        transitionSpan > 0 ? Math.min(1, Math.max(0, scrolled / transitionSpan)) : 0;

      const startX = viewportWidth;
      const endX = -trackWidth;
      const x = startX + progress * (endX - startX);
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      updateProgress();
    });
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);

    // Debounced, and only ever updates the local viewportHeight number
    // used for the progress math — never writes any element's size, so
    // it can't fight an in-progress touch scroll the way a live DOM
    // height write would.
    let resizeSettleTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      resizeSettleTimer = setTimeout(() => {
        viewportHeight = getViewportHeight();
        onScroll();
      }, 150);
    };

    measure();
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative w-full bg-white">
      {/* Pinned panel: heading, watermark and image track all live
          together in this one box, so the whole composition pins in
          place — right where it first sits fully in view — rather than
          the heading scrolling away on its own before the images take
          over. From there, only the track sweeps right to left as the
          user scrolls; everything else stays put. Only once every
          image has actually exited past the left edge does the
          wrapper's scroll range end and the page release into normal
          scroll below it. */}
      <div ref={wrapperRef} className="relative h-[calc(min(92lvh,780px)+130lvh)]">
        <div
          ref={panelRef}
          className="sticky top-0 flex h-[min(92lvh,780px)] w-full flex-col items-center overflow-hidden"
        >
          <div className="w-full max-w-6xl shrink-0 px-6 pt-16 text-center sm:pt-20 lg:px-16">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-brand-gold" />
              <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
                OUR WORK
              </span>
              <span className="h-px w-10 bg-brand-gold" />
            </div>

            <h2 className="mx-auto mt-4 max-w-xl font-sans text-[36px] font-extrabold leading-[1.08] tracking-tight text-brand-green-dark sm:text-[52px]">
              A glimpse of what we build.
            </h2>
          </div>

          <div className="relative flex w-full flex-1 items-center overflow-hidden">
            {/* A giant, faint wordmark sitting behind the image track —
                typed out via clip-path the moment the panel scrolls
                into view, with a thin cursor riding the reveal edge,
                before the images sweep in over it. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                className="select-none whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-tight text-black/[0.05] transition-[clip-path]"
                style={{
                  fontSize: "clamp(2.25rem, 12vw, 180px)",
                  clipPath: typed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  transitionDuration: `${TYPE_DURATION_MS}ms`,
                  transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              >
                Gallery
              </span>
              <span
                className="absolute top-1/2 h-[0.7em] w-[3px] -translate-y-1/2 bg-brand-gold/50 transition-all"
                style={{
                  fontSize: "clamp(2.25rem, 12vw, 180px)",
                  left: typed ? "100%" : "0%",
                  opacity: typed ? 0 : 1,
                  transitionDuration: `${TYPE_DURATION_MS}ms, 200ms`,
                  transitionProperty: "left, opacity",
                  transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              />
            </div>

            <div ref={viewportRef} className="relative z-10 h-full w-full overflow-hidden">
              <div
                ref={trackRef}
                className="flex h-full w-max items-center gap-5 px-6 will-change-transform sm:gap-6 lg:px-16"
                style={{ transform: "translate3d(100%, 0, 0)" }}
              >
                {images.map((img) => (
                  <div
                    key={img.src}
                    // Portrait (3:4) on mobile, landscape (16:9) from
                    // sm up — a wide crop of these particular photos
                    // reads too thin/sliver-like on a narrow phone
                    // screen, where a taller portrait frame shows more
                    // of the actual composition.
                    className="relative aspect-[3/4] flex-none overflow-hidden rounded-xl bg-black/5 shadow-xl sm:aspect-[16/9]"
                    style={{
                      // Height-first, sized to exactly 100% of the
                      // space actually left over after the heading
                      // above it — not a vh-based guess, which on a
                      // short viewport (mobile landscape, where the
                      // heading eats a bigger share of a shorter
                      // panel) could estimate more room than truly
                      // remains and get the image clipped at the
                      // bottom. Width simply follows from that via
                      // whichever aspect ratio applies above.
                      height: "100%",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
