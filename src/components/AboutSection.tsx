const stats: { value: string; label: string }[] = [
  { value: "5+", label: "Business Verticals" },
  { value: "50+", label: "Projects Delivered" },
  { value: "1M+", label: "Lives Impacted" },
];

const highlights: { title: string; text: string }[] = [
  {
    title: "Our Mission",
    text: "Deliver diversified, future-ready ventures that create lasting value for people, partners and the planet.",
  },
  {
    title: "Our Approach",
    text: "Sustainability isn't a division — it's built into how every business under our umbrella operates.",
  },
  {
    title: "Our People",
    text: "A leadership team of entrepreneurs, academicians and operators driving execution on the ground.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-brand-green-dark px-6 py-6 text-white sm:py-10 lg:px-16 lg:py-0">
      {/* Faint grid texture + a soft glow, so the field reads as
          composed rather than a flat color fill. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-brand-neon-green/10 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center gap-3 sm:mb-5">
            <span className="h-px w-10 bg-brand-gold-light/60" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold-light sm:text-[11px]">
              ABOUT US
            </span>
          </div>

          <h2 className="font-display text-[26px] uppercase leading-[1.08] tracking-[0.01em] sm:text-[40px] sm:leading-[1.05] lg:text-[52px]">
            Building value.
            <br />
            Creating <span className="text-brand-neon-green">impact.</span>
          </h2>

          <p className="mt-3 max-w-xl text-[12.5px] leading-relaxed text-white/65 sm:mt-6 sm:text-[15px] lg:text-[16px]">
            Vaibhav Veda Green Ventures is a diversified enterprise spanning
            real estate, infrastructure, education, advisory and digital
            solutions. Every business under our umbrella is built on the same
            principle: sustainable growth that compounds value for our
            partners, our people and the communities we operate in.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-4 sm:mt-9 sm:gap-x-10 sm:gap-y-5 sm:pt-7">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-[20px] text-brand-neon-green sm:text-[28px] lg:text-[32px]">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50 sm:mt-1 sm:text-[10.5px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 divide-y divide-white/10 border-t border-white/10 sm:mt-8">
            {highlights.map((h, i) => (
              <div key={h.title} className="flex items-start gap-4 py-2.5 sm:gap-5 sm:py-4">
                <span className="font-display pt-0.5 text-[12px] text-white/30 sm:text-[13px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide sm:text-[12.5px]">
                    {h.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/55 sm:mt-1 sm:text-[12.5px] sm:leading-relaxed">
                    {h.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:col-span-5 lg:block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/video/hero-last-frame.jpg"
              alt="Vaibhav Veda Green Ventures — sustainable office building"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-brand-green-dark/10 to-transparent" />
            <div className="absolute inset-0 bg-brand-green-dark/20" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl border border-white/10 bg-brand-green-dark px-6 py-4 shadow-xl">
            <div className="font-display text-[24px] text-brand-neon-green">
              Pan-India
            </div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-white/60">
              Presence &amp; Ambition
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
