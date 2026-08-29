"use client";

import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const leaders: {
  name: string;
  title: string;
  tags: string;
  // Drop the real headshot in as e.g. /public/leadership/naveen-kumar.jpg
  // and swap the placeholder block below for an <Image src={photo} />.
  photo: string;
}[] = [
  {
    name: "Dr. M. Naveen Kumar",
    title: "CEO & Founder Director",
    tags: "Visionary Leader | Entrepreneur | Strategist | Philanthropist",
    photo: "/leadership/naveen-kumar.jpg",
  },
  {
    name: "Dr. Shilpa H. Naveen",
    title: "Executive Director",
    tags: "Academician | Social Entrepreneur | Author | Mentor",
    photo: "/leadership/shilpa-naveen.jpg",
  },
];

export default function LeadershipSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f5f4f1] px-6 py-24 lg:px-16 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.25em] text-brand-gold">
            OUR LEADERSHIP
          </span>
          <span className="h-px w-10 bg-brand-gold/60" />
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-14">
          {leaders.map((l, i) => (
            <div
              key={l.name}
              className="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: visible ? `${i * 150}ms` : "0ms",
              }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
                {/* Placeholder — same treatment as the hero used before
                    the real footage was dropped in. Swap for a real
                    <Image src={l.photo}> once the headshot exists. */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 text-black/35">
                  <User className="h-9 w-9" strokeWidth={1.5} />
                  <span className="px-4 text-center text-[11px] font-medium uppercase tracking-wide">
                    {l.name} — photo
                  </span>
                </div>
              </div>

              <h3 className="mt-5 text-[22px] font-extrabold text-brand-green-dark">
                {l.name}
              </h3>
              <p className="text-[13px] font-medium text-black/50">{l.title}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-black/60">
                {l.tags}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
