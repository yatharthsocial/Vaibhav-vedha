"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

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
  // Back of the card — shown when it's flipped with "Read more".
  intro: string;
  focus: string[];
  closing: string;
}[] = [
  {
    slug: "green",
    title: "Green",
    tagline: "For a cleaner, greener future.",
    image: "/verticals/green.jpg",
    bg: "#f7f5ef",
    ink: "#0e3b23",
    accent: "#1f7a45",
    intro:
      "Renewable energy, sustainability, green jobs, ESG-oriented opportunities, emerging green technologies and green-economy projects.",
    focus: [
      "Renewable Energy",
      "Green Hydrogen",
      "ESG & Sustainability",
      "Carbon Footprint Reduction",
      "Green Jobs & Skills",
    ],
    closing: "Green Today. Stronger Tomorrow.",
  },
  {
    slug: "build",
    title: "Build",
    tagline: "Building with tomorrow in mind.",
    image: "/verticals/build.jpg",
    bg: "#e0be4a",
    ink: "#0e3b23",
    accent: "#0e3b23",
    intro:
      "Real estate, infrastructure, project management, development partnerships and allied construction or execution initiatives.",
    focus: [
      "Green Buildings",
      "Smart Infrastructure",
      "Project Management",
      "Construction & Engineering",
      "Asset Management",
    ],
    closing: "Built with purpose. Designed for tomorrow.",
  },
  {
    slug: "learn",
    title: "Learn",
    tagline: "Skills that open doors.",
    image: "/verticals/learn.jpg",
    bg: "#d7e8dc",
    ink: "#0e3b23",
    accent: "#1f7a45",
    intro:
      "Industry-linked education, skill development, employability programmes, institutional partnerships and workforce solutions.",
    focus: [
      "Vocational Training",
      "Industry-Specific Programmes",
      "University & Institutional Collaborations",
      "Certification Programmes",
      "Green Jobs Training",
    ],
    closing: "Learn. Apply. Grow.",
  },
  {
    slug: "advise",
    title: "Advise",
    tagline: "Clarity for meaningful growth.",
    image: "/verticals/advise.jpg",
    bg: "#1f7a45",
    ink: "#ffffff",
    accent: "#39ff14",
    intro:
      "Strategic advisory, project consulting, business development, institutional collaboration, partnerships and market-entry support.",
    focus: [
      "ESG Advisory",
      "Policy & Regulatory Support",
      "Skill Council Consulting",
      "Business Strategy",
      "Government & Institutional Relations",
    ],
    closing: "Think clearly. Connect meaningfully.",
  },
  {
    slug: "digital",
    title: "Digital",
    tagline: "Technology that moves ideas forward.",
    image: "/verticals/digital.jpg",
    bg: "#ffffff",
    ink: "#0e3b23",
    accent: "#c9a227",
    intro:
      "Technology-enabled services, digital business platforms, process solutions and scalable digital initiatives.",
    focus: [
      "Digital Solutions",
      "E-Learning Platforms",
      "Smart Monitoring Systems",
      "Data & Analytics",
      "GreenTech",
    ],
    closing: "Human purpose. Digital possibility.",
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

// Per-letter share of a 0→1 transition: each letter starts LETTER_STAGGER
// later than the one before it and they all finish together at 1, so a
// word rolls across left to right rather than moving as one block.
const LETTER_STAGGER = 0.045;
const charT = (t: number, index: number, count: number) => {
  const span = 1 - (count - 1) * LETTER_STAGGER;
  return Math.min(1, Math.max(0, (t - index * LETTER_STAGGER) / span));
};

const getViewportHeight = () =>
  window.visualViewport?.height ?? window.innerHeight;

// Initial (pre-JS) state for anything that swaps with the active card.
const stateFor = (i: number, active: number) =>
  i === active ? "active" : i < active ? "before" : "after";

export default function BusinessSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Which card (if any) is turned over to its back. Any open card turns
  // back over the moment a different card lands on top.
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    let viewportHeight = getViewportHeight();
    let target = 0;
    let current = 0;
    let frame: number | null = null;
    let lastActive = -1;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const swapEls =
      wrapperRef.current?.querySelectorAll<HTMLElement>("[data-swap]") ?? [];
    const wordChars = Array.from(
      wrapperRef.current?.querySelectorAll<HTMLElement>("[data-word]") ?? [],
      (word) => Array.from(word.querySelectorAll<HTMLElement>("[data-char]")),
    );
    const tagEls = Array.from(
      wrapperRef.current?.querySelectorAll<HTMLElement>("[data-tag]") ?? [],
    );

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
            REST_ROTATION[i] +
            (1 - t) * ENTRY_ROTATION * (i % 2 === 0 ? 1 : -1);
          const scale = 1 - depthAbove * DEPTH_SCALE;
          card.style.transform = `translate3d(0, calc(${(1 - t) * 105}vh - ${
            depthAbove * DEPTH_LIFT_PX
          }px), 0) rotate(${rotation}deg) scale(${scale})`;
        }
        const shade = shadeRefs.current[i];
        if (shade)
          shade.style.opacity = String(Math.min(0.6, depthAbove * DEPTH_SHADE));
        depthAbove += t;
      }

      // Names and taglines move with the cards themselves: name i rolls
      // in as card i travels up, and rolls out as card i + 1 does. The
      // first name is simply there from the start.
      wordChars.forEach((chars, i) => {
        const inT = i === 0 ? 1 : ts[i];
        const outT = i + 1 < COUNT ? ts[i + 1] : 0;
        chars.forEach((ch, c) => {
          const y =
            (1 - charT(inT, c, chars.length)) * 100 -
            charT(outT, c, chars.length) * 100;
          ch.style.transform = `translate3d(0, ${y}%, 0)`;
        });
      });
      tagEls.forEach((tag, i) => {
        const inT = i === 0 ? 1 : ts[i];
        const outT = i + 1 < COUNT ? ts[i + 1] : 0;
        const y = (1 - inT) * 100 - outT * 100;
        tag.style.transform = `translate3d(0, ${y}%, 0)`;
        tag.style.opacity = String(Math.max(0, 1 - Math.abs(y) / 100));
      });

      // Each progress segment fills as its card travels in.
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.transform = `scaleX(${ts[i]})`;
      });

      if (active !== lastActive) {
        if (lastActive !== -1) setFlipped(null);
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
    <div
      id="verticals"
      ref={wrapperRef}
      className="relative h-[500lvh] bg-brand-green-dark"
    >
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
              <img
                src={v.image}
                alt=""
                className="h-full w-full object-cover"
              />
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
              {/* Each letter sits in the same clipped line and is
                  moved by render() — rolling up and out as the next
                  card travels in, while the next name's letters roll
                  up from below, staggered left to right (the navbar's
                  hover roll, driven by the card's own progress). */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: "0.95em",
                  fontSize: "clamp(52px, 7.4vw, 128px)",
                }}
              >
                {verticals.map((v, i) => (
                  <span
                    key={v.slug}
                    data-word={i}
                    aria-hidden={i !== 0}
                    className="absolute inset-x-0 top-0 flex font-sans font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
                  >
                    {[...v.title, "."].map((ch, c) => (
                      <span
                        key={c}
                        data-char
                        className={`inline-block will-change-transform ${
                          ch === "." ? "text-brand-neon-green" : ""
                        }`}
                        style={{
                          transform: `translate3d(0, ${i === 0 ? 0 : 100}%, 0)`,
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </div>

              <div className="relative mt-3 h-[1.5em] overflow-hidden text-[15px] text-white/70 sm:mt-5 sm:text-[19px]">
                {verticals.map((v, i) => (
                  <span
                    key={v.slug}
                    data-tag={i}
                    className="absolute inset-x-0 top-0 leading-[1.5] will-change-transform"
                    style={{
                      transform: `translate3d(0, ${i === 0 ? 0 : 100}%, 0)`,
                      opacity: i === 0 ? 1 : 0,
                    }}
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
                  <span
                    key={v.slug}
                    className="relative h-[3px] flex-1 overflow-hidden bg-white/15"
                  >
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
                  className="flip-card absolute inset-0 rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] will-change-transform"
                  style={{
                    color: v.ink,
                    transform: `translate3d(0, 105vh, 0) rotate(${REST_ROTATION[i]}deg)`,
                  }}
                >
                  <div className="flip-inner" data-flipped={flipped === i}>
                    {/* Front */}
                    <div
                      className="flip-face flex flex-col gap-4 overflow-hidden rounded-2xl p-5 sm:gap-5 sm:p-7"
                      style={{ backgroundColor: v.bg }}
                      inert={flipped === i}
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
                        <img
                          src={v.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
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
                        <button
                          type="button"
                          onClick={() => setFlipped(i)}
                          aria-expanded={flipped === i}
                          className="group flex flex-none items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 sm:text-[12px]"
                          style={{ borderColor: `${v.ink}33` }}
                        >
                          Read more
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="flip-face flip-back flex flex-col overflow-y-auto rounded-2xl p-6 sm:p-8"
                      style={{ backgroundColor: v.bg }}
                      inert={flipped !== i}
                    >
                      <div
                        data-back-item
                        className="flex items-center justify-between"
                        style={{ "--i": 0 } as CSSProperties}
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60">
                          0{i + 1} · Vertical
                        </span>
                        <button
                          type="button"
                          onClick={() => setFlipped(null)}
                          aria-label={`Close ${v.title} details`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-300 hover:rotate-90"
                          style={{ borderColor: `${v.ink}33` }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <h3
                        data-back-item
                        className="mt-5 font-sans font-extrabold uppercase leading-[0.9] tracking-tight"
                        style={
                          {
                            fontSize: "clamp(34px, 3.6vw, 56px)",
                            "--i": 1,
                          } as CSSProperties
                        }
                      >
                        {v.title}
                      </h3>
                      <p
                        data-back-item
                        className="mt-4 text-[13.5px] leading-relaxed opacity-75 sm:text-[14.5px]"
                        style={{ "--i": 2 } as CSSProperties}
                      >
                        {v.intro}
                      </p>

                      <span
                        data-back-item
                        className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] opacity-60"
                        style={{ "--i": 3 } as CSSProperties}
                      >
                        What we focus on
                      </span>
                      <ul className="mt-2">
                        {v.focus.map((item, j) => (
                          <li
                            key={item}
                            data-back-item
                            className="flex items-center gap-3 border-t py-2.5 text-[14px] font-semibold sm:text-[15px]"
                            style={
                              {
                                borderColor: `${v.ink}1f`,
                                "--i": 4 + j,
                              } as CSSProperties
                            }
                          >
                            <span
                              className="h-1.5 w-1.5 flex-none rounded-full"
                              style={{ backgroundColor: v.accent }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div
                        data-back-item
                        className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6"
                        style={{ "--i": 4 + v.focus.length } as CSSProperties}
                      >
                        <p className="text-[13px] font-bold">{v.closing}</p>
                        <Link
                          href={`/${v.slug}`}
                          className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-transform duration-300 hover:-translate-y-0.5 sm:text-[12px]"
                          style={{ backgroundColor: v.ink, color: v.bg }}
                        >
                          Explore {v.title}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Darkens the card as more land on top of it. */}
                  <div
                    ref={(el) => {
                      shadeRefs.current[i] = el;
                    }}
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-black"
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
