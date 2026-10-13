const partners = [
  "Government",
  "Industry",
  "Academia",
  "Enterprise",
  "Communities",
];

// Eight-petal bloom used as the separator in the scrolling band.
function Bloom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="27"
          rx="15"
          ry="23"
          fill="currentColor"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="16" fill="currentColor" />
    </svg>
  );
}

export default function CollaborationSection() {
  return (
    <section
      id="collaboration"
      className="relative w-full overflow-hidden bg-[#f5f4f1] py-16 sm:py-20"
    >
      {/* Scrolling band — the five partners on an endless loop, the
          row rendered twice back to back so the loop point is
          invisible (same marquee-x keyframes as the gallery modal). */}
      <div>
        <div className="overflow-hidden bg-brand-neon-green py-4 text-brand-green-dark sm:py-6">
          <div
            className="flex w-max will-change-transform"
            style={{ animation: "marquee-x 38s linear infinite" }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center"
                aria-hidden={copy === 1}
              >
                {partners.map((name) => (
                  <span key={name} className="flex items-center">
                    <span
                      className="whitespace-nowrap px-6 font-sans font-extrabold uppercase leading-none tracking-[-0.03em] sm:px-10"
                      style={{ fontSize: "clamp(56px, 9vw, 150px)" }}
                    >
                      {name}
                    </span>
                    <Bloom className="bloom-spin h-[clamp(40px,6vw,96px)] w-[clamp(40px,6vw,96px)] flex-none" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Trailing stripes, thinning out below the band. */}
        <div className="mt-2 space-y-2" aria-hidden="true">
          <div className="h-[8px] bg-brand-neon-green/80" />
          <div className="h-[5px] bg-brand-neon-green/60" />
          <div className="h-[3px] bg-brand-neon-green/40" />
          <div className="h-[2px] bg-brand-neon-green/25" />
        </div>
      </div>
    </section>
  );
}
