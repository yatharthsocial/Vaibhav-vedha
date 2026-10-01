const stats: { value: number; suffix: string; label: string }[] = [
  { value: 5, suffix: "+", label: "Business Verticals" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 1, suffix: "M+", label: "Lives Impacted" },
];

const missionVision: { key: string; index: string; label: string; text: string }[] = [
  {
    key: "mission",
    index: "01",
    label: "Our Mission",
    text: "We run businesses in real estate, infrastructure, legal consulting, interiors and design, and media and branding, each one profitable on its own and built to outlast whoever's running it day to day.",
  },
  {
    key: "vision",
    index: "02",
    label: "Our Vision",
    text: "To be the group Indian institutions call first when they need something built properly, backed by a track record rather than a pitch deck.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-brand-green-dark text-white [@media(max-height:500px)]:!justify-start"
    >
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
            className="font-sans max-w-lg text-[30px] font-medium leading-[1.15] tracking-tight text-white/90 [@media(max-height:500px)]:!text-[20px] [@media(max-height:500px)]:!leading-[1.15] sm:text-[42px] sm:leading-[1.12] lg:text-[50px]"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            A diversified enterprise,{" "}
            <span className="font-extrabold text-brand-neon-green">built to compound.</span>
          </h2>

          <p
            data-reveal
            className="mt-4 max-w-md border-l-2 border-white/10 pl-4 text-[12.5px] leading-relaxed text-white/55 [@media(max-height:500px)]:!mt-1.5 [@media(max-height:500px)]:!text-[11px] [@media(max-height:500px)]:!leading-snug [@media(max-height:500px)]:!pl-3 sm:mt-6 sm:pl-5 sm:text-[14.5px] lg:text-[15px]"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            Vaibhav Veda Green Ventures runs five businesses: real estate,
            infrastructure, legal consulting, interiors and design, and
            media and branding. We started in Karnataka and still answer
            to the same people who backed us then, which is why nothing
            here gets built to just look good on paper.
          </p>

          <div
            data-reveal
            className="relative mt-6 grid grid-cols-3 gap-4 [@media(max-height:500px)]:!mt-3 sm:mt-10 sm:gap-10"
            style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
          >
            <span className="absolute -top-3 left-0 h-px w-10 bg-brand-gold-light/60 [@media(max-height:500px)]:hidden sm:-top-4" />
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-sans text-[22px] font-light tracking-tight text-white [@media(max-height:500px)]:!text-[16px] sm:text-[32px]">
                  <span data-count={s.value}>0</span>
                  <span className="text-brand-neon-green">{s.suffix}</span>
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/40 sm:text-[10px]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-6 [@media(max-height:500px)]:!mt-3 [@media(max-height:500px)]:!gap-3 sm:mt-11 sm:gap-10">
            {missionVision.map((m) => (
              <div
                key={m.key}
                data-reveal
                className="border-t border-white/15 pt-3 [@media(max-height:500px)]:!pt-2 sm:pt-4"
                style={{ opacity: 0, transform: "translateY(18px)", willChange: "opacity, transform" }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-[11px] font-semibold text-white/30">{m.index}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 sm:text-[11px]">
                    {m.label}
                  </span>
                </div>
                <p className="mt-2.5 text-[11px] leading-relaxed text-white/55 [@media(max-height:500px)]:!mt-1 [@media(max-height:500px)]:!text-[9.5px] [@media(max-height:500px)]:!leading-snug sm:mt-3 sm:text-[12.5px]">
                  {m.text}
                </p>
              </div>
            ))}
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
