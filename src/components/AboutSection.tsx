import { Eye, Target } from "lucide-react";
import type { ComponentType } from "react";

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 5, suffix: "+", label: "Business Verticals" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 1, suffix: "M+", label: "Lives Impacted" },
];

const missionVision: {
  key: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  text: string;
  tagline: string;
  cardClass: string;
  badgeClass: string;
  taglineClass: string;
}[] = [
  {
    key: "mission",
    icon: Target,
    label: "Our Mission",
    text: "We build diversified ventures across real estate, infrastructure, education, advisory and digital, each one designed to keep compounding value long after it's delivered.",
    tagline: "From blueprint to impact, without the gap.",
    cardClass: "border-brand-gold-light/25",
    badgeClass: "border-brand-gold-light/40 text-brand-gold-light",
    taglineClass: "text-brand-gold-light",
  },
  {
    key: "vision",
    icon: Eye,
    label: "Our Vision",
    text: "To be the partner Indian institutions and businesses trust most for sustainable growth, turning ambition into results across every sector we serve.",
    tagline: "Karnataka first. India next. Global always.",
    cardClass: "border-brand-neon-green/25",
    badgeClass: "border-brand-neon-green/40 text-brand-neon-green",
    taglineClass: "text-brand-neon-green",
  },
];

export default function AboutSection() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-brand-green-dark text-white [@media(max-height:500px)]:!justify-start">
      {/* A quiet depth cue instead of a dot-grid + neon blob: just a
          soft darkening toward the edges so the panel doesn't read as
          a flat color fill. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 20%, rgba(255,255,255,0.05), transparent 55%)",
        }}
      />

      <div className="relative grid w-full flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_44%]">
        <div className="mx-auto flex w-full max-w-2xl flex-col justify-center px-6 py-10 [@media(max-height:500px)]:!py-4 sm:px-10 sm:py-14 lg:mx-0 lg:max-w-none lg:px-16 lg:py-0 xl:px-20">
          <div
            data-reveal
            className="mb-3 flex items-center gap-3 [@media(max-height:500px)]:!mb-1.5 sm:mb-5"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            <span className="h-px w-10 bg-brand-gold-light/60" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold-light sm:text-[11px]">
              ABOUT US
            </span>
          </div>

          <h2
            data-reveal
            className="font-sans max-w-lg text-[28px] font-extrabold leading-[1.2] tracking-tight [@media(max-height:500px)]:!text-[20px] [@media(max-height:500px)]:!leading-[1.15] sm:text-[40px] sm:leading-[1.15] lg:text-[48px]"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            A diversified enterprise, <span className="text-brand-neon-green">built to compound.</span>
          </h2>

          <p
            data-reveal
            className="mt-3 max-w-md text-[12.5px] leading-relaxed text-white/60 [@media(max-height:500px)]:!mt-1.5 [@media(max-height:500px)]:!text-[11px] [@media(max-height:500px)]:!leading-snug sm:mt-5 sm:text-[14.5px] lg:text-[15px]"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            Vaibhav Veda Green Ventures works across real estate,
            infrastructure, education, advisory and digital solutions. Every
            business under our umbrella runs on the same principle: growth
            that lasts, for our partners, our people and the communities we
            serve.
          </p>

          <div
            data-reveal
            className="mt-5 grid grid-cols-3 [@media(max-height:500px)]:!mt-3 sm:mt-9 sm:flex sm:flex-wrap"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`pr-2 sm:pr-10 ${i > 0 ? "border-l border-white/10 pl-2 sm:pl-10" : ""}`}
              >
                <div className="font-sans text-[20px] font-extrabold tracking-tight text-brand-neon-green [@media(max-height:500px)]:!text-[16px] sm:text-[26px]">
                  <span data-count={s.value}>0</span>
                  {s.suffix}
                </div>
                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/45 sm:text-[10px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 [@media(max-height:500px)]:!mt-3 [@media(max-height:500px)]:!pt-3 sm:mt-9 sm:gap-4 sm:pt-7">
            {missionVision.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.key}
                  data-reveal
                  className={`rounded-lg border bg-white/[0.03] p-3 [@media(max-height:500px)]:!p-2 sm:p-4 ${m.cardClass}`}
                  style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span
                      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border sm:h-7 sm:w-7 ${m.badgeClass}`}
                    >
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/85 sm:text-[10px]">
                      {m.label}
                    </span>
                  </div>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-white/55 [@media(max-height:500px)]:!mt-1 [@media(max-height:500px)]:!text-[9.5px] [@media(max-height:500px)]:!leading-snug sm:mt-3 sm:text-[12px]">
                    {m.text}
                  </p>
                  <p className={`mt-2 text-[10px] italic [@media(max-height:500px)]:!mt-1 sm:mt-3 sm:text-[11.5px] ${m.taglineClass}`}>
                    &ldquo;{m.tagline}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/video/hero-last-frame.jpg"
            alt="Vaibhav Veda Green Ventures sustainable office building"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark/70 via-brand-green-dark/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
