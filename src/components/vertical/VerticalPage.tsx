"use client";

import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  verticalPages,
  type Vertical,
  type VerticalBlock,
} from "@/lib/verticals";

// Same one-shot, low-threshold fade + rise used across the rest of the
// site (LeadershipSection, FAQSection, InsightsPageContent).
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-px w-10 ${light ? "bg-brand-gold-light/60" : "bg-brand-gold"}`}
      />
      <span
        className={`text-[12px] font-bold uppercase tracking-[0.28em] ${
          light ? "text-brand-gold-light" : "text-brand-gold"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------
// Header — sits over the hero; the five verticals as the main nav, with
// the current one marked.
// ---------------------------------------------------------------------
function VerticalHeader({ current }: { current: Vertical["slug"] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-10 lg:py-5">
        <Link
          href="/"
          aria-label="Vaibhav Veda Green Ventures home"
          className="flex-none"
        >
          <Image
            src="/logo.png"
            alt="Vaibhav Veda Green Ventures"
            width={480}
            height={480}
            priority
            className="h-12 w-12 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] lg:h-16 lg:w-16"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-md lg:flex">
          {verticalPages.map((v) => {
            const active = v.slug === current;
            return (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                  active
                    ? "bg-brand-neon-green text-brand-green-dark"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {v.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden rounded-full border border-white/60 px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-neon-green hover:text-brand-neon-green sm:inline-block"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
          >
            <span className="relative flex h-[16px] w-6 flex-col justify-between">
              <span
                className={`h-[2px] w-full rounded-full bg-white transition-transform duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-white transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-white transition-transform duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 -z-10 flex flex-col items-center justify-center gap-5 bg-brand-green-dark/97 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-[15px] font-bold uppercase tracking-[0.2em] text-white/60"
        >
          Home
        </Link>
        {verticalPages.map((v) => (
          <Link
            key={v.slug}
            href={`/${v.slug}`}
            onClick={() => setOpen(false)}
            className={`text-[28px] font-extrabold uppercase tracking-tight ${
              v.slug === current ? "text-brand-neon-green" : "text-white"
            }`}
          >
            {v.name}
          </Link>
        ))}
        <Link
          href="/#contact"
          onClick={() => setOpen(false)}
          className="mt-4 rounded-full bg-brand-neon-green px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-brand-green-dark"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------
function Hero({ v, index }: { v: Vertical; index: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const pop = (delay: number) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(28px)",
    transitionDelay: `${delay}ms`,
  });
  const popClass =
    "transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-brand-green-dark text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={v.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: ready ? "scale(1)" : "scale(1.08)" }}
      />
      <div className="absolute inset-0 bg-brand-green-dark/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-brand-green-dark/40 to-transparent" />

      {/* Oversized vertical name, barely there, behind the copy. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] right-0 select-none font-sans font-extrabold uppercase leading-none tracking-[-0.05em] text-white/[0.05]"
        style={{ fontSize: "clamp(120px, 24vw, 420px)" }}
      >
        {v.name}
      </span>

      <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-16 pt-36 sm:pb-20 lg:px-10 lg:pb-24">
        <div className={`flex items-center gap-3 ${popClass}`} style={pop(100)}>
          <span className="text-[12px] font-bold tabular-nums text-brand-neon-green">
            0{index + 1}
          </span>
          <span className="h-px w-10 bg-white/40" />
          <span className="text-[12px] font-bold uppercase tracking-[0.28em] text-white/80">
            Vaibhav Veda {v.name}
          </span>
        </div>

        <h1
          className={`mt-6 max-w-5xl font-sans font-extrabold leading-[1.02] tracking-[-0.03em] ${popClass}`}
          style={{ ...pop(220), fontSize: "clamp(40px, 6.2vw, 96px)" }}
        >
          {v.hero.title}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p
            className={`max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-[17px] ${popClass}`}
            style={pop(380)}
          >
            {v.hero.lead}
          </p>
          <a
            href="#focus"
            className={`group flex w-fit items-center gap-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white ${popClass}`}
            style={pop(520)}
          >
            What we focus on
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-[transform,border-color] duration-500 group-hover:translate-y-1 group-hover:border-brand-neon-green">
              <ArrowDown className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Intro statement + focus areas
// ---------------------------------------------------------------------
function Intro({ v }: { v: Vertical }) {
  return (
    <section className="w-full bg-[#f7f5ef] px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>{v.intro.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-sans text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-green-dark sm:text-[46px] lg:text-[54px]">
            {v.intro.title}
          </h2>
        </Reveal>
        <div className="lg:pt-12">
          {v.intro.paragraphs.map((p, i) => (
            <Reveal key={i} delay={100 + i * 90}>
              <p className="mb-5 text-[15.5px] leading-relaxed text-black/60 sm:text-[17px]">
                {p}
              </p>
            </Reveal>
          ))}
          {v.intro.chips && (
            <Reveal delay={350} className="mt-2 flex flex-wrap gap-2">
              {v.intro.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-brand-green-dark/15 bg-white px-4 py-2 text-[13px] font-semibold text-brand-green-dark"
                >
                  {c}
                </span>
              ))}
            </Reveal>
          )}
          {v.intro.kicker && (
            <Reveal delay={420}>
              <p className="mt-6 border-l-2 border-brand-green-light pl-4 text-[16px] font-bold text-brand-green-dark sm:text-[18px]">
                {v.intro.kicker}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function Focus({ v }: { v: Vertical }) {
  return (
    <section
      id="focus"
      className="w-full scroll-mt-4 bg-white px-5 py-24 lg:px-10 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        {/* Sticky intro column with the vertical's photo. */}
        <div>
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <Eyebrow>What we focus on</Eyebrow>
              <h2 className="mt-5 font-sans text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-green-dark sm:text-[44px]">
                Five areas.{" "}
                <span className="text-brand-green-light">One direction.</span>
              </h2>
            </Reveal>
            <Reveal delay={150} className="mt-8 hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/70 to-transparent" />
                <span className="absolute bottom-5 left-6 text-[13px] font-bold uppercase tracking-[0.2em] text-white">
                  {v.tagline}
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <ol className="border-b border-brand-green-dark/10">
          {v.focus.map((f, i) => (
            <li key={f.title} className="border-t border-brand-green-dark/10">
              <Reveal
                delay={i * 60}
                className="group grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 py-8 sm:grid-cols-[64px_minmax(0,1fr)] sm:py-10"
              >
                <span className="pt-1.5 text-[13px] font-bold tabular-nums text-brand-gold">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-[24px] font-extrabold leading-tight tracking-tight text-brand-green-dark transition-colors duration-300 group-hover:text-brand-green-light sm:text-[30px]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] font-semibold text-brand-green-light sm:text-[16px]">
                    {f.kicker}
                  </p>
                  <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-black/60 sm:text-[15.5px]">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------
function Block({
  block,
  light,
  isLast,
}: {
  block: VerticalBlock;
  light: string;
  isLast: boolean;
}) {
  switch (block.type) {
    case "statement":
      return (
        <section
          className="w-full px-5 py-24 lg:px-10 lg:py-32"
          style={{ backgroundColor: light }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <Reveal className="flex justify-center">
              <Eyebrow>{block.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 font-sans text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-green-dark sm:text-[48px]">
                {block.title}
              </h2>
            </Reveal>
            {block.paragraphs.map((p, i) => (
              <Reveal key={i} delay={200 + i * 90}>
                <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-relaxed text-black/60 sm:text-[17px]">
                  {p}
                </p>
              </Reveal>
            ))}
            {block.kicker && (
              <Reveal delay={400}>
                <p className="mt-10 inline-block rounded-full bg-brand-green-dark px-6 py-3 text-[13px] font-bold uppercase tracking-[0.15em] text-white sm:text-[14px]">
                  {block.kicker}
                </p>
              </Reveal>
            )}
          </div>
        </section>
      );

    case "lines": {
      // Dark by default; light when it's the last block, so it doesn't
      // run straight into the dark closing section below it.
      const dark = !isLast;
      return (
        <section
          className={`w-full px-5 py-24 lg:px-10 lg:py-32 ${dark ? "bg-brand-green-dark text-white" : "text-brand-green-dark"}`}
          style={dark ? undefined : { backgroundColor: light }}
        >
          <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <Reveal>
              <Eyebrow light={dark}>{block.eyebrow}</Eyebrow>
              <h2 className="mt-5 font-sans text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
                {block.title}
              </h2>
              {block.intro && (
                <p
                  className={`mt-5 max-w-md text-[15.5px] leading-relaxed sm:text-[17px] ${dark ? "text-white/60" : "text-black/55"}`}
                >
                  {block.intro}
                </p>
              )}
            </Reveal>
            <div>
              <ul
                className={`border-b ${dark ? "border-white/10" : "border-brand-green-dark/10"}`}
              >
                {block.lines.map((line, i) => (
                  <li
                    key={line}
                    className={`border-t ${dark ? "border-white/10" : "border-brand-green-dark/10"}`}
                  >
                    <Reveal
                      delay={i * 80}
                      className="group flex items-baseline gap-5 py-5 sm:py-6"
                    >
                      <span
                        className={`text-[12px] font-bold tabular-nums ${dark ? "text-brand-neon-green" : "text-brand-gold"}`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`text-[19px] font-semibold leading-snug transition-colors duration-300 sm:text-[24px] ${dark ? "text-white/85 group-hover:text-white" : "text-brand-green-dark/80 group-hover:text-brand-green-dark"}`}
                      >
                        {line}
                      </span>
                    </Reveal>
                  </li>
                ))}
              </ul>
              {block.outro && (
                <Reveal delay={block.lines.length * 80}>
                  <p
                    className={`mt-8 max-w-xl text-[15.5px] leading-relaxed sm:text-[17px] ${dark ? "text-white/60" : "text-black/55"}`}
                  >
                    {block.outro}
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      );
    }

    case "chips":
      return (
        <section
          className="w-full px-5 py-24 lg:px-10 lg:py-32"
          style={{ backgroundColor: light }}
        >
          <div className="mx-auto max-w-[1300px]">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
              <Reveal>
                <Eyebrow>{block.eyebrow}</Eyebrow>
                <h2 className="mt-5 font-sans text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-green-dark sm:text-[48px]">
                  {block.title}
                </h2>
              </Reveal>
              {block.intro && (
                <Reveal delay={100}>
                  <p className="text-[15.5px] leading-relaxed text-black/60 sm:text-[17px]">
                    {block.intro}
                  </p>
                </Reveal>
              )}
            </div>
            <div className="mt-12 flex flex-wrap gap-3 sm:gap-4">
              {block.chips.map((c, i) => (
                <Reveal key={c} delay={i * 60}>
                  <span className="inline-block rounded-full border border-brand-green-dark/15 bg-white px-6 py-3.5 text-[17px] font-bold text-brand-green-dark transition-[background-color,color,border-color] duration-300 hover:border-brand-green-dark hover:bg-brand-green-dark hover:text-white sm:px-8 sm:py-4 sm:text-[22px]">
                    {c}
                  </span>
                </Reveal>
              ))}
            </div>
            {block.outro && (
              <Reveal delay={200}>
                <p className="mt-12 max-w-2xl text-[15.5px] leading-relaxed text-black/60 sm:text-[17px]">
                  {block.outro}
                </p>
              </Reveal>
            )}
          </div>
        </section>
      );

    case "flow":
      return (
        <section
          className="w-full px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
          style={{ backgroundColor: light }}
        >
          <div className="rounded-[28px] bg-brand-green-dark px-6 py-16 text-white sm:rounded-[36px] sm:px-10 lg:px-14 lg:py-24">
            <div className="mx-auto max-w-[1300px]">
              <Reveal className="text-center">
                <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold-light">
                  {block.eyebrow}
                </span>
                <h2 className="mx-auto mt-4 max-w-2xl font-sans text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-[44px]">
                  {block.title}
                </h2>
              </Reveal>

              <ol className="relative mt-14 grid gap-4 lg:mt-20 lg:grid-cols-5 lg:gap-0">
                {/* Connecting line behind the step markers (desktop). */}
                <span className="pointer-events-none absolute left-[10%] right-[10%] top-6 hidden h-px bg-gradient-to-r from-white/5 via-brand-neon-green/50 to-white/5 lg:block" />
                {block.steps.map((s, i) => (
                  <li key={s.title} className="relative">
                    <Reveal
                      delay={150 + i * 120}
                      className="flex gap-5 lg:flex-col lg:items-center lg:px-3 lg:text-center"
                    >
                      <span
                        className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border text-[13px] font-bold tabular-nums ${
                          s.highlight
                            ? "border-brand-neon-green bg-brand-neon-green text-brand-green-dark shadow-[0_0_40px_-6px_rgba(57,255,20,0.7)]"
                            : "border-white/20 bg-brand-green-dark text-white"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <div className="pb-6 lg:pb-0 lg:pt-6">
                        <h3
                          className={`text-[18px] font-extrabold leading-tight sm:text-[20px] ${
                            s.highlight ? "text-brand-neon-green" : "text-white"
                          }`}
                        >
                          {s.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                          {s.text}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      );

    case "grid":
      return (
        <section
          className="w-full px-5 py-24 lg:px-10 lg:py-32"
          style={{ backgroundColor: light }}
        >
          <div className="mx-auto max-w-[1300px]">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-20">
              <Reveal>
                <Eyebrow>{block.eyebrow}</Eyebrow>
                <h2 className="mt-5 font-sans text-[32px] font-extrabold leading-[1.06] tracking-[-0.02em] text-brand-green-dark sm:text-[48px]">
                  {block.title}
                </h2>
              </Reveal>
              {block.intro && (
                <Reveal delay={100}>
                  <p className="text-[15.5px] leading-relaxed text-black/60 sm:text-[17px]">
                    {block.intro}
                  </p>
                </Reveal>
              )}
            </div>
            <div
              className={`mt-12 grid gap-4 sm:grid-cols-2 ${
                block.items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
              }`}
            >
              {block.items.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-brand-green-dark/10 bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brand-green-light/40 hover:shadow-[0_24px_50px_-28px_rgba(14,59,35,0.45)] sm:p-7">
                    <span className="text-[12px] font-bold tabular-nums text-brand-gold">
                      0{i + 1}
                    </span>
                    <div className="mt-10">
                      <h3 className="text-[20px] font-extrabold leading-tight tracking-tight text-brand-green-dark sm:text-[22px]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-black/60">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );
  }
}

// ---------------------------------------------------------------------
// Closing + next vertical
// ---------------------------------------------------------------------
function Closing({ v, index }: { v: Vertical; index: number }) {
  const next = verticalPages[(index + 1) % verticalPages.length];
  return (
    <>
      <section className="relative w-full overflow-hidden bg-brand-green-dark px-5 py-28 text-white lg:px-10 lg:py-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, rgba(57,255,20,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold-light">
              Collaborate to Celebrate
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="mt-6 font-sans font-extrabold leading-[1.04] tracking-[-0.03em]"
              style={{ fontSize: "clamp(36px, 5.4vw, 80px)" }}
            >
              {v.closing.title}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-white/65 sm:text-[17px]">
              {v.closing.text}
            </p>
          </Reveal>
          <Reveal
            delay={300}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {v.closing.ctas.map((label, i) => (
              <Link
                key={label}
                href="/#contact"
                className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-bold uppercase tracking-wide transition-[background-color,color,border-color,transform] duration-300 hover:-translate-y-0.5 ${
                  i === 0
                    ? "bg-brand-neon-green text-brand-green-dark hover:bg-white"
                    : "border border-white/50 text-white hover:border-brand-neon-green hover:text-brand-neon-green"
                }`}
              >
                {label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-12 text-[12px] font-bold uppercase tracking-[0.25em] text-white/40">
              Sustainable Today{" "}
              <span className="mx-2 text-brand-neon-green">|</span> Stronger
              Tomorrow
            </p>
          </Reveal>
        </div>
      </section>

      {/* Next vertical — a full-width link to keep the visitor moving
          through the ecosystem. */}
      <Link
        href={`/${next.slug}`}
        className="group relative block w-full overflow-hidden bg-black text-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={next.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/90 to-brand-green-dark/30" />
        <div className="relative mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-16 lg:px-10 lg:py-24">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.28em] text-white/60">
              Next vertical
            </span>
            <span
              className="mt-3 block font-sans font-extrabold uppercase leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(48px, 9vw, 150px)" }}
            >
              {next.name}
              <span className="text-brand-neon-green">.</span>
            </span>
            <span className="mt-3 block text-[15px] text-white/70 sm:text-[17px]">
              {next.tagline}
            </span>
          </div>
          <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full border border-white/40 transition-[transform,background-color,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-brand-neon-green group-hover:bg-brand-neon-green group-hover:text-brand-green-dark sm:h-20 sm:w-20">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
      </Link>
    </>
  );
}

export default function VerticalPage({ slug }: { slug: Vertical["slug"] }) {
  const index = verticalPages.findIndex((v) => v.slug === slug);
  const v = verticalPages[index];

  return (
    <>
      <VerticalHeader current={slug} />
      <Hero v={v} index={index} />
      <Intro v={v} />
      <Focus v={v} />
      {/* Light blocks alternate between the site's two light greys so
          neighbouring sections don't share a background. */}
      {v.blocks.map((block, i) => (
        <Block
          key={i}
          block={block}
          light={i % 2 === 0 ? "#f5f4f1" : "#ffffff"}
          isLast={i === v.blocks.length - 1}
        />
      ))}
      <Closing v={v} index={index} />
    </>
  );
}
