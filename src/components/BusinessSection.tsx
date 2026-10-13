"use client";

import { useEffect, useRef } from "react";

const verticals: {
  slug: string;
  title: string;
  tagline: string;
  image: string;
  // Card fill and the ink used on it — all drawn from the brand palette
  // (cream, gold, sage, green) so the stack reads as one family.
  bg: string;
  ink: string;
  accent: string;
}[] = [
  {
    slug: "green",
    title: "Green",
    tagline: "For a cleaner, greener future.",
    image: "/verticals/green.jpg",
    bg: "#f7f5ef",
    ink: "#0e3b23",
    accent: "#1f7a45",
  },
  {
    slug: "build",
    title: "Build",
    tagline: "Building with tomorrow in mind.",
    image: "/verticals/build.jpg",
    bg: "#e0be4a",
    ink: "#0e3b23",
    accent: "#0e3b23",
  },
  {
    slug: "learn",
    title: "Learn",
    tagline: "Skills that open doors.",
    image: "/verticals/learn.jpg",
    bg: "#d7e8dc",
    ink: "#0e3b23",
    accent: "#1f7a45",
  },
  {
    slug: "advise",
    title: "Advise",
    tagline: "Clarity for meaningful growth.",
    image: "/verticals/advise.jpg",
    bg: "#1f7a45",
    ink: "#ffffff",
    accent: "#39ff14",
  },
  {
    slug: "digital",
    title: "Digital",
    tagline: "Technology that moves ideas forward.",
    image: "/verticals/digital.jpg",
    bg: "#ffffff",
    ink: "#0e3b23",
    accent: "#c9a227",
  },
];

const COUNT = verticals.length;

// Where each card comes to rest once it's landed on the stack — small,
// alternating tilts so the pile reads as cards set down by hand rather
// than a perfectly squared deck.
const REST_ROTATION = [-2.5, 2, -1.5, 2.5, 0];
// Extra tilt a card carries while it's still travelling up, unwinding
// to its resting angle as it lands.
const ENTRY_ROTATION = 7;
// What each card underneath gives up per card landed on top of it —
// a little scale, a little lift and some shade — so the pile has depth
// and the cards below visibly settle as a new one arrives.
const DEPTH_SCALE = 0.045;
const DEPTH_LIFT_PX = 18;
const DEPTH_SHADE = 0.16;

// How many viewport-heights of scroll drive the five cards, on top of
// the one viewport-height the pinned panel itself occupies (matches the
// wrapper's 500lvh below).
const SCROLL_SPAN_MULTIPLIER = 4;
// The last card lands at this fraction of the scroll span, leaving the
// rest as a short hold on the finished stack before the page moves on.
const STACK_DONE_AT = 0.9;
// Fraction of the remaining distance the animation covers each frame as
// it eases toward the scroll position — what turns discrete wheel ticks
// into one continuous glide. Lower is softer.
const SCROLL_EASE = 0.07;

// Gentle at both ends, no sharp acceleration in the middle — reads as
// a card being set down rather than thrown.
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

// Initial (pre-JS) state for anything that swaps with the active card.
const stateFor = (i: number, active: number) =>
  i === active ? "active" : i < active ? "before" : "after";

export default function BusinessSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let viewportHeight = getViewportHeight();
    let target = 0;
    let current = 0;
    let frame: number | null = null;
    let lastActive = -1;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swapEls = wrapperRef.current?.querySelectorAll<HTMLElement>("[data-swap]") ?? [];

    const render = (progress: number) => {
      // Card i owns the i-th fifth of the stacking range: it rises from
      // below the viewport, unwinding its extra tilt, and lands on top.
      const stackProgress = Math.min(1, progress / STACK_DONE_AT) * COUNT;
      const ts = verticals.map((_, i) =>
        easeInOutSine(Math.min(1, Math.max(0, stackProgress - i))),
      );

      let active = 0;
      let depthAbove = 0;
      for (let i = COUNT - 1; i >= 0; i--) {
        const t = ts[i];
        if (t > 0.5 && active === 0) active = i;
        const card = cardRefs.current[i];
        if (card) {
          const rotation =
            REST_ROTATION[i] + (1 - t) * ENTRY_ROTATION * (i % 2 === 0 ? 1 : -1);
          const scale = 1 - depthAbove * DEPTH_SCALE;
          card.style.transform = `translate3d(0, calc(${(1 - t) * 105}vh - ${
            depthAbove * DEPTH_LIFT_PX
          }px), 0) rotate(${rotation}deg) scale(${scale})`;
        }
        const shade = shadeRefs.current[i];
        if (shade) shade.style.opacity = String(Math.min(0.6, depthAbove * DEPTH_SHADE));
        depthAbove += t;
      }

      // Each progress segment fills as its card travels in.
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.transform = `scaleX(${ts[i]})`;
      });

      if (active !== lastActive) {
        lastActive = active;
        swapEls.forEach((el) => {
          el.dataset.state = stateFor(Number(el.dataset.swap), active);
        });
      }
    };

    const tick = () => {
      frame = null;
      const diff = target - current;
      if (Math.abs(diff) < 0.0002) {
        current = target;
      } else {
        current += diff * SCROLL_EASE;
        frame = requestAnimationFrame(tick);
      }
      render(current);
    };

    const readTarget = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const span = viewportHeight * SCROLL_SPAN_MULTIPLIER;
      const scrolled = -wrapper.getBoundingClientRect().top;
      target = span > 0 ? Math.min(1, Math.max(0, scrolled / span)) : 0;
    };

    const onScroll = () => {
      readTarget();
      if (reduceMotion) {
        current = target;
        render(current);
      } else if (frame === null) {
        frame = requestAnimationFrame(tick);
      }
    };

    let resizeSettleTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      resizeSettleTimer = setTimeout(() => {
        viewportHeight = getViewportHeight();
        onScroll();
      }, 150);
    };

    // Snap on load, so a page restored mid-scroll doesn't animate in
    // from the start.
    readTarget();
    current = target;
    render(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    // lvh rather than svh/dvh, same as HeroAboutTransition: a fixed
    // size that never resizes mid-scroll as a mobile address bar
    // animates. 500lvh = 100 pinned + 400 scroll span.
    <div id="verticals" ref={wrapperRef} className="relative h-[500lvh] bg-brand-green-dark">
      <div className="sticky top-0 h-[100lvh] w-full overflow-hidden text-white">
        {/* Background — the active vertical's own photo, deep in brand
            green, crossfading as the cards change. */}
        <div className="absolute inset-0">
          {verticals.map((v, i) => (
            <div
              key={v.slug}
              data-swap={i}
              data-state={stateFor(i, 0)}
              className="vertical-bg absolute inset-0"
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.image} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-brand-green-dark/[0.88]" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark via-brand-green-dark/60 to-transparent" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1500px] flex-col px-6 pt-[9vh] sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:pt-0">
          {/* Left — the active vertical's name, set huge, rolling to
              the next one as each card lands. */}
          <div className="flex flex-none flex-col lg:h-[74vh] lg:w-[46%] lg:justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/45 sm:text-[12px]">
              Our Verticals
            </span>

            <div className="mt-3 lg:mt-0">
              <div className="relative overflow-hidden" style={{ height: "0.95em", fontSize: "clamp(52px, 7.4vw, 128px)" }}>
                {verticals.map((v, i) => (
                  <span
                    key={v.slug}
                    data-swap={i}
                    data-state={stateFor(i, 0)}
                    className="vertical-swap absolute inset-x-0 top-0 font-sans font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
                  >
                    {v.title}
                    <span className="text-brand-neon-green">.</span>
                  </span>
                ))}
              </div>

              <div className="relative mt-3 h-[1.5em] overflow-hidden text-[15px] text-white/70 sm:mt-5 sm:text-[19px]">
                {verticals.map((v, i) => (
                  <span
                    key={v.slug}
                    data-swap={i}
                    data-state={stateFor(i, 0)}
                    className="vertical-swap absolute inset-x-0 top-0 leading-[1.5]"
                    style={{ transitionDelay: "80ms" }}
                  >
                    {v.tagline}
                  </span>
                ))}
              </div>
            </div>

            {/* Five-part progress — each segment fills as its card
                travels in. Desktop only; phones need the room. */}
            <div className="hidden lg:block">
              <div className="flex gap-2">
                {verticals.map((v, i) => (
                  <span key={v.slug} className="relative h-[3px] flex-1 overflow-hidden bg-white/15">
                    <span
                      ref={(el) => {
                        barRefs.current[i] = el;
                      }}
                      className="absolute inset-0 origin-left bg-brand-neon-green"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                <span>One vision</span>
                <span>Five ways to create impact</span>
              </div>
            </div>
          </div>

          {/* Right — the stack. Every card is pre-positioned off-screen
              below (matching what render() writes at progress 0), so
              nothing flashes in place before the scroll effect runs. */}
          <div className="relative mt-7 min-h-0 flex-1 pb-[6vh] lg:mt-0 lg:flex lg:h-full lg:items-center lg:pb-0">
            <div className="relative mx-auto h-full w-full max-w-[420px] lg:h-[74vh] lg:max-w-[520px]">
              {verticals.map((v, i) => (
                <div
                  key={v.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] will-change-transform sm:gap-5 sm:p-7"
                  style={{
                    backgroundColor: v.bg,
                    color: v.ink,
                    transform: `translate3d(0, 105vh, 0) rotate(${REST_ROTATION[i]}deg)`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
                      style={{ backgroundColor: v.ink, color: v.bg }}
                    >
                      Vertical
                    </span>
                    <span
                      className="font-sans font-extrabold leading-[0.8] tracking-tighter"
                      style={{ fontSize: "clamp(56px, 7vw, 112px)" }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.image} alt="" className="h-full w-full object-cover" />
                  </div>

                  <div>
                    <h3
                      className="font-sans font-extrabold uppercase leading-[0.9] tracking-tight"
                      style={{ fontSize: "clamp(40px, 4.6vw, 72px)" }}
                    >
                      {v.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-[14px] font-semibold sm:text-[16px]">
                      <span
                        className="h-2 w-2 flex-none rounded-full"
                        style={{ backgroundColor: v.accent }}
                      />
                      {v.tagline}
                    </p>
                  </div>

                  {/* Darkens the card as more land on top of it. */}
                  <div
                    ref={(el) => {
                      shadeRefs.current[i] = el;
                    }}
                    className="pointer-events-none absolute inset-0 bg-black"
                    style={{ opacity: 0 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
