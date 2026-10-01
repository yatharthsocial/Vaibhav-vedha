"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, insights, type InsightCategory } from "@/lib/insights";

// A plain scroll-reveal wrapper — same IntersectionObserver fade+rise
// mechanic used across the rest of the site.
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

export default function InsightsPageContent() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const popInClass = `transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
    ready ? "opacity-100" : "opacity-0"
  }`;
  const popInStyle = { transform: ready ? "translateY(0)" : "translateY(16px)" };

  const [active, setActive] = useState<InsightCategory | "All">("All");
  const filtered = useMemo(
    () => (active === "All" ? insights : insights.filter((i) => i.category === active)),
    [active],
  );
  const [featured, ...rest] = filtered;

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 lg:px-16">
        <Link href="/" aria-label="Vaibhav Veda Green Ventures home">
          <Image src="/logo.png" alt="Vaibhav Veda Green Ventures" width={480} height={480} className="h-12 w-12" priority />
        </Link>
        <Link
          href="/"
          className="group flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-green-dark transition-colors hover:text-brand-green"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-10 pt-28 lg:px-16 lg:pb-14 lg:pt-36">
        <div className={popInClass} style={popInStyle}>
          <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">INSIGHTS</span>
          <h1 className="mt-4 font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[44px]">
            Ideas worth sharing.
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-black/55 sm:text-[15px]">
            Notes from across real estate, infrastructure, legal, design and media — written by
            the people actually doing the work.
          </p>
        </div>

        <div
          className={`mt-8 flex flex-wrap gap-2.5 ${popInClass}`}
          style={{ ...popInStyle, transitionDelay: ready ? "100ms" : "0ms" }}
        >
          {(["All", ...categories] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                active === cat
                  ? "border-brand-green-dark bg-brand-green-dark text-white"
                  : "border-black/15 text-black/55 hover:border-black/30 hover:text-black/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-20 lg:px-16 lg:pb-28">
        {featured && (
          <Reveal key={featured.slug} className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-green-dark">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <span
                className="inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ borderColor: `${featured.color}55`, color: featured.color }}
              >
                {featured.category}
              </span>
              <h2 className="mt-4 text-[24px] font-extrabold leading-[1.15] text-brand-green-dark sm:text-[30px]">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-black/60 sm:text-[15px]">
                {featured.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-green-dark">
                Read More
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                Latest Insights
              </span>
              <h3 className="mt-2 text-[22px] font-extrabold text-brand-green-dark sm:text-[26px]">
                More from the team.
              </h3>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {rest.map((post, i) => (
                <Reveal key={post.slug} delay={i * 80} className="group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-brand-green-dark">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <span
                    className="mt-4 inline-block text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: post.color }}
                  >
                    {post.category}
                  </span>
                  <h4 className="mt-1.5 text-[16px] font-extrabold leading-snug text-brand-green-dark">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-black/55">{post.excerpt}</p>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {!featured && (
          <p className="py-16 text-center text-[14px] text-black/40">
            No posts in this category yet.
          </p>
        )}
      </div>
    </>
  );
}
