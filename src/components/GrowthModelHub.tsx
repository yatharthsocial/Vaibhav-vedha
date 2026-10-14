"use client";

import Image from "next/image";
import { Factory, GraduationCap, Handshake, Landmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

// Laid out around the hub in this order: top-left, top-right,
// bottom-left, bottom-right.
const partners: { name: string; text: string; icon: LucideIcon }[] = [
  {
    name: "Government & Institutions",
    text: "Institutional engagement, policy-aligned programmes and public-interest initiatives.",
    icon: Landmark,
  },
  {
    name: "Industry",
    text: "Projects, employment pathways, technology adoption, contracting and strategic alliances.",
    icon: Factory,
  },
  {
    name: "Academia",
    text: "Degree-linked industry programmes, skill development, internships and employability initiatives.",
    icon: GraduationCap,
  },
  {
    name: "Investors & Strategic Partners",
    text: "Joint ventures, SPVs, project finance and sector-specific growth platforms.",
    icon: Handshake,
  },
];

const riseClass =
  "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
const rise = (visible: boolean, delayMs: number) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transitionDelay: visible ? `${delayMs}ms` : "0ms",
});

type Connector = { d: string };

export default function GrowthModelHub() {
  const panelRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // One-shot reveal, same as the rest of the site.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Connectors are drawn from the real layout, not guessed: from the
  // hub's edge to the inner edge of each card, as a soft S-curve.
  // Re-measured whenever the diagram resizes. Desktop layout only — on
  // a phone the cards stack and there's nothing to connect sideways.
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    const measure = () => {
      const hub = hubRef.current;
      if (!hub || window.innerWidth < 1024) {
        setConnectors([]);
        return;
      }
      const box = diagram.getBoundingClientRect();
      const h = hub.getBoundingClientRect();
      const cx = h.left + h.width / 2 - box.left;
      const cy = h.top + h.height / 2 - box.top;
      const r = h.width / 2;
      const next = cardRefs.current.map((card, i) => {
        if (!card) return { d: "" };
        const c = card.getBoundingClientRect();
        const left = i % 2 === 0;
        const ex = (left ? c.right : c.left) - box.left;
        const ey = c.top + c.height / 2 - box.top;
        const angle = Math.atan2(ey - cy, ex - cx);
        const sx = cx + Math.cos(angle) * r;
        const sy = cy + Math.sin(angle) * r;
        const mx = (sx + ex) / 2;
        return { d: `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}` };
      });
      setSize({ w: box.width, h: box.height });
      setConnectors(next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(diagram);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={panelRef}
      className="relative mt-24 overflow-hidden rounded-[28px] bg-brand-green-dark px-6 py-16 text-white sm:rounded-[36px] sm:px-10 lg:mt-32 lg:px-14 lg:py-20"
    >
      {/* Soft glow behind the hub. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 45% at 50% 58%, rgba(57,255,20,0.10), transparent 70%)",
        }}
      />

      <div
        className={`relative text-center ${riseClass}`}
        style={rise(visible, 0)}
      >
        <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold-light">
          Partnership-led Growth Model
        </span>
        <h3 className="mx-auto mt-4 max-w-2xl font-sans text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-[44px]">
          Different strengths.{" "}
          <span className="text-brand-neon-green">One table.</span>
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/55 sm:text-[15.5px]">
          Engagement across government, industry, academia and investors,
          brought together around shared outcomes.
        </p>
      </div>

      <div ref={diagramRef} className="relative mt-14 lg:mt-20">
        {connectors.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 hidden lg:block"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            aria-hidden="true"
          >
            <defs>
              <filter
                id="hub-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {connectors.map((c, i) => {
              const lit = hovered === i;
              return (
                <g key={i}>
                  <path
                    d={c.d}
                    fill="none"
                    stroke={
                      lit ? "rgba(57,255,20,0.55)" : "rgba(255,255,255,0.16)"
                    }
                    strokeWidth={lit ? 1.5 : 1}
                    style={{
                      transition: "stroke 500ms ease, stroke-width 500ms ease",
                    }}
                    className="hub-draw"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={visible ? 0 : 1}
                  />
                  <path
                    d={c.d}
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth={lit ? 3 : 2.5}
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="4 96"
                    filter="url(#hub-glow)"
                    className="hub-pulse"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: "opacity 600ms ease 1200ms",
                      animationDelay: `${i * 0.6}s`,
                      animationDuration: lit ? "1.6s" : "3.2s",
                    }}
                  />
                </g>
              );
            })}
          </svg>
        )}

        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_minmax(280px,0.85fr)_1fr] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-14">
          {/* Hub — logo at the centre, two slow orbits around it. */}
          <div
            className={`order-first flex items-center justify-center py-10 sm:col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:py-0 ${riseClass}`}
            style={rise(visible, 150)}
          >
            <div className="relative flex items-center justify-center">
              <span className="hub-orbit absolute h-[250px] w-[250px] rounded-full border border-dashed border-white/12 sm:h-[290px] sm:w-[290px]" />
              <span
                className="hub-orbit absolute h-[190px] w-[190px] rounded-full border border-white/10 sm:h-[220px] sm:w-[220px]"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "28s",
                }}
              />
              <div
                ref={hubRef}
                className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full border border-brand-neon-green/40 bg-brand-green-dark shadow-[0_0_60px_-10px_rgba(57,255,20,0.45)] sm:h-40 sm:w-40"
              >
                <span className="hub-ring absolute inset-0 rounded-full border border-brand-neon-green/40" />
                <span
                  className="hub-ring absolute inset-0 rounded-full border border-brand-neon-green/40"
                  style={{ animationDelay: "1.5s" }}
                />
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-white p-1 sm:h-[72px] sm:w-[72px]">
                  <Image
                    src="/logo.png"
                    alt="Vaibhav Veda"
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>
                <span className="relative mt-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
                  Vaibhav Veda
                </span>
              </div>
            </div>
          </div>

          {partners.map((p, i) => {
            const Icon = p.icon;
            const lit = hovered === i;
            return (
              <div
                key={p.name}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`${i < 2 ? "lg:row-start-1" : "lg:row-start-2"} ${
                  i % 2 === 0 ? "lg:col-start-1" : "lg:col-start-3"
                } ${riseClass}`}
                style={rise(visible, 350 + i * 120)}
              >
                <div
                  className={`relative h-full rounded-2xl border p-6 backdrop-blur-sm transition-[border-color,background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-7 ${
                    lit
                      ? "-translate-y-1 border-brand-neon-green/45 bg-white/[0.08] shadow-[0_24px_50px_-24px_rgba(57,255,20,0.35)]"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-500 ${
                        lit
                          ? "border-brand-neon-green bg-brand-neon-green text-brand-green-dark"
                          : "border-white/15 bg-white/[0.06] text-brand-neon-green"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-[12px] font-bold tabular-nums text-white/30">
                      0{i + 1}
                    </span>
                  </div>
                  <h4 className="mt-5 text-[18px] font-bold leading-snug sm:text-[20px]">
                    {p.name}
                  </h4>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                    {p.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p
        className={`relative mt-14 text-center text-[12px] font-bold uppercase tracking-[0.25em] text-white/40 lg:mt-16 ${riseClass}`}
        style={rise(visible, 900)}
      >
        Different strengths{" "}
        <span className="mx-2 text-brand-neon-green">·</span> Shared purpose{" "}
        <span className="mx-2 text-brand-neon-green">·</span> Greater impact
      </p>
    </div>
  );
}
