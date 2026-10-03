"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { allGalleryImages, featuredGalleryImages, previewGalleryImages } from "@/lib/gallery";

// How long the watermark takes to type itself out once the panel
// scrolls into view — a fixed, time-based reveal (not tied to scroll
// depth), so it starts the moment the section is looked at rather than
// requiring the user to already be scrolling past it. The image sweep
// below is the part that's actually scroll-linked.
const TYPE_DURATION_MS = 900;

// How many viewport-heights of extra scroll drive the image sweep —
// larger means the images travel more slowly per scroll tick.
const SCROLL_SPAN_MULTIPLIER = 2.1;

// Fraction of the remaining distance the track covers each frame as it
// eases toward its scroll-derived target — lower is a softer, slower
// glide; 1 would snap straight to the scroll position.
const SWEEP_EASE = 0.08;

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

// The modal's full set, split into three rows (round-robin by index
// so each row still spans the whole shoot rather than one row being
// entirely from the first few photos) — each row scrolls continuously
// and independently, alternating direction and speed so the three
// rows read as layered motion rather than one flat strip.
const MODAL_ROW_COUNT = 3;

const MODAL_ROWS = [0, 1, 2].map((row) =>
  allGalleryImages.filter((_, i) => i % MODAL_ROW_COUNT === row),
);

const ROW_SPEED_SECONDS = [52, 68, 46];
const ROW_DIRECTION: ("normal" | "reverse")[] = ["normal", "reverse", "normal"];

// The centered preview always shows something, even before the user
// has hovered anything — this is what it shows by default.
const DEFAULT_PREVIEW_SRC = MODAL_ROWS[1][0] ?? allGalleryImages[0];

export default function GallerySection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);

  // The modal always shows one photo large and centered on screen;
  // hovering a tile in the marquee rows swaps which one — the rows
  // themselves never stop scrolling, hovering only changes the
  // preview.
  const [hoveredSrc, setHoveredSrc] = useState<string>(DEFAULT_PREVIEW_SRC);

  // A tile can end up sitting directly under an already-stationary
  // cursor the instant the modal opens (the user's click to open it
  // left the pointer right there) — browsers still fire mouseenter for
  // that, which would trigger the preview before any real hover
  // gesture happened. This flips true only on a genuine mousemove
  // inside the modal, and tile hover is ignored until then.
  const realMouseMoveRef = useRef(false);

  // Locks the page in place while the "view all" modal is open — same
  // technique as the mobile nav menu (Hero.tsx): position: fixed at
  // the exact scroll position, restored on close, rather than plain
  // overflow:hidden which mobile Safari can still scroll past.
  useEffect(() => {
    if (!modalOpen) return;
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
  }, [modalOpen]);

  // Escape closes the modal, same as clicking the backdrop or the X.
  // Also clears the hover preview on close, so it's not sitting
  // around stale the next time the modal opens.
  useEffect(() => {
    if (!modalOpen) {
      setHoveredSrc(DEFAULT_PREVIEW_SRC);
      return;
    }
    realMouseMoveRef.current = false;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

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

    // The track eases toward targetX rather than jumping to it, so
    // discrete scroll-wheel steps read as one continuous glide.
    let targetX = 0;
    let currentX: number | null = null;
    let easeFrame: number | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      viewportWidth = viewport.clientWidth;
      trackWidth = track.scrollWidth;
    };

    const applyX = (x: number) => {
      const track = trackRef.current;
      if (track) track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const ease = () => {
      easeFrame = null;
      if (currentX === null) return;
      const diff = targetX - currentX;
      if (Math.abs(diff) < 0.5) {
        currentX = targetX;
      } else {
        currentX += diff * SWEEP_EASE;
        easeFrame = requestAnimationFrame(ease);
      }
      applyX(currentX);
    };

    const updateProgress = (snap = false) => {
      ticking = false;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const scrolled = -rect.top;
      const transitionSpan = viewportHeight * SCROLL_SPAN_MULTIPLIER;
      const progress =
        transitionSpan > 0 ? Math.min(1, Math.max(0, scrolled / transitionSpan)) : 0;

      const startX = viewportWidth;
      const endX = -trackWidth;
      targetX = startX + progress * (endX - startX);

      if (snap || reduceMotion || currentX === null) {
        currentX = targetX;
        applyX(currentX);
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

    const resizeObserver = new ResizeObserver(() => {
      measure();
      updateProgress(true);
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
    updateProgress(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      if (easeFrame !== null) cancelAnimationFrame(easeFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="gallery" className="relative w-full bg-white">
      {/* Pinned panel: heading, watermark and image track all live
          together in this one box, so the whole composition pins in
          place — right where it first sits fully in view — rather than
          the heading scrolling away on its own before the images take
          over. From there, only the track sweeps right to left as the
          user scrolls; everything else stays put. Only once every
          image has actually exited past the left edge does the
          wrapper's scroll range end and the page release into normal
          scroll below it. */}
      <div ref={wrapperRef} className="relative h-[calc(min(92lvh,780px)+195lvh)]">
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
                {featuredGalleryImages.map((src, i) => (
                  <div
                    key={src}
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
                      src={src}
                      alt={`Gallery photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}

                {/* The 8th, final tile in the sweep — a collage of
                    four more photos (not the ones already in the
                    sweep) dimmed behind the CTA, so it teases the rest
                    of the gallery instead of sitting there empty. */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group relative flex aspect-[3/4] flex-none overflow-hidden rounded-xl shadow-xl sm:aspect-[16/9]"
                  style={{ height: "100%" }}
                >
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
                    {previewGalleryImages.map((src) => (
                      <div key={src} className="relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-brand-green-dark/80 transition-colors duration-300 group-hover:bg-brand-green-dark/70" />
                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition-[transform,border-color,color] duration-300 group-hover:scale-110 group-hover:border-brand-neon-green group-hover:text-brand-neon-green">
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-[13px] font-bold uppercase tracking-wide">View More</span>
                    <span className="text-[11px] text-white/60">{allGalleryImages.length} Photos</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "View More" modal — the complete set, laid out as 3
          continuously auto-scrolling rows, with a centered preview
          that always shows one photo large and swaps as the user
          hovers different tiles. Opening and closing deliberately use
          different motion, not just the same transition in reverse:
          opening has a soft overshoot (eases slightly past full size
          before settling) so it reads as an energetic "arrival",
          while closing uses a plain ease-in with no overshoot and a
          shorter duration, so it reads as a quick, decisive dismissal
          rather than the open animation lazily rewinding. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-brand-green-dark/98 transition-[opacity,backdrop-filter] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          modalOpen
            ? "pointer-events-auto opacity-100 backdrop-blur-md duration-500"
            : "pointer-events-none opacity-0 backdrop-blur-none duration-300"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Full photo gallery"
        onClick={() => setModalOpen(false)}
      >
        <div
          className="relative flex h-full min-h-0 flex-1 flex-col transition-[opacity,transform]"
          style={{
            opacity: modalOpen ? 1 : 0,
            transform: modalOpen ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
            transitionDuration: modalOpen ? "600ms" : "320ms",
            transitionTimingFunction: modalOpen
              ? "cubic-bezier(0.34, 1.4, 0.4, 1)"
              : "cubic-bezier(0.4, 0, 1, 1)",
            transitionDelay: modalOpen ? "90ms" : "0ms",
          }}
        >
          {/* Just the close button, floating over the rows — no
              reserved header bar, so the rows start right at the
              modal's top edge instead of leaving a gap under a title
              strip. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(false);
            }}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:text-brand-neon-green sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {/* The 3 rows share the full modal height equally (flex-1
              each, h-full tiles), flush against the top and bottom
              edges — no header strip, no padding, no centering slack. */}
          <div
            className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden sm:gap-3"
            onMouseMove={() => {
              realMouseMoveRef.current = true;
            }}
          >
            {MODAL_ROWS.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="min-h-0 flex-1 overflow-hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: modalOpen ? 1 : 0,
                  transform: modalOpen ? "translateY(0)" : "translateY(16px)",
                  // Each row rises in slightly after the last, so the
                  // open reads as a cascade rather than all three rows
                  // popping in simultaneously. Skipped on close — the
                  // panel's own fade already covers that, so the rows
                  // don't need their own close-stagger.
                  transitionDelay: modalOpen ? `${160 + rowIndex * 90}ms` : "0ms",
                }}
                onMouseLeave={() => setHoveredSrc(DEFAULT_PREVIEW_SRC)}
              >
                <div
                  className="flex h-full w-max gap-2 will-change-transform sm:gap-3"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    animationName: "marquee-x",
                    animationDuration: `${ROW_SPEED_SECONDS[rowIndex]}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationDirection: ROW_DIRECTION[rowIndex],
                    // Always running while the modal is open — hovering
                    // a tile only changes the centered preview, it
                    // never stops the scroll.
                    animationPlayState: modalOpen ? "running" : "paused",
                  }}
                >
                  {[...row, ...row].map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      onMouseEnter={() => {
                        if (!realMouseMoveRef.current) return;
                        setHoveredSrc(src);
                      }}
                      className="relative h-full w-[150px] flex-none overflow-hidden rounded-md bg-black/20 sm:w-[210px] lg:w-[270px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover transition-opacity duration-500 ${
                          hoveredSrc === src ? "opacity-100" : "opacity-55 lg:hover:opacity-90"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The centered preview — always showing one photo, swapped by
            hovering a tile in the rows behind it, rather than
            following the cursor the way a tooltip would. Hidden below
            the lg breakpoint, where there's no hover to drive it. */}
        <div
          className={`pointer-events-none fixed inset-0 z-[60] hidden items-center justify-center transition-opacity duration-300 lg:flex ${
            modalOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="relative w-[min(640px,60vw)] overflow-hidden rounded-xl shadow-2xl shadow-black/60"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hoveredSrc} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Corner brackets — a viewfinder frame, not a plain photo
                card, to match the rest of this interaction's "look
                closer" feel. */}
            {[
              "left-3 top-3 border-l border-t",
              "right-3 top-3 border-r border-t",
              "left-3 bottom-3 border-l border-b",
              "right-3 bottom-3 border-r border-b",
            ].map((pos) => (
              <span key={pos} className={`absolute h-4 w-4 border-white/70 ${pos}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
