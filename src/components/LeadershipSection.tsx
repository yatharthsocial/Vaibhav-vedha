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
    name: "Dr. Shilpa Naveen Kumar",
    title: "Director, Academics Operations & Finance",
    tags: "Academic Design | Finance | Partnerships | Mentor",
    photo: "/leadership/shilpa-naveen-kumar.jpg",
  },
  {
    name: "Dr. Naveen Kumar",
    title: "Managing Director",
    tags: "Strategist | Mentor | Visionary | Guide",
    photo: "/leadership/naveen-kumar.jpg",
  },
  {
    name: "Rajesh Shetty",
    title: "Director, Business Development",
    tags: "Strategy | Business Development | Operations | Growth",
    photo: "/leadership/rajesh-shetty.jpg",
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
      className="relative w-full bg-[#f5f4f1] px-6 py-24 [@media(max-height:500px)]:!py-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 text-center [@media(max-height:500px)]:!mb-6">
          <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
            OUR LEADERSHIP
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 [@media(max-height:500px)]:!grid-cols-3 [@media(max-height:500px)]:!gap-4 lg:grid-cols-3 lg:gap-10">
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-black/10 bg-black/5 [@media(max-height:500px)]:!aspect-[3/4]">
                {/* Placeholder — same treatment as the hero used before
                    the real footage was dropped in. Swap for a real
                    <Image src={l.photo}> once the headshot exists. */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 text-black/35">
                  <User className="h-9 w-9 [@media(max-height:500px)]:!h-6 [@media(max-height:500px)]:!w-6" strokeWidth={1.5} />
                  <span className="px-4 text-center text-[11px] font-medium uppercase tracking-wide [@media(max-height:500px)]:!text-[9px]">
                    {l.name}, photo
                  </span>
                </div>
              </div>

              <span className="mt-5 block text-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold [@media(max-height:500px)]:!mt-2 sm:text-left">
                {l.title}
              </span>
              <h3 className="mt-1.5 text-center text-[20px] font-extrabold text-brand-green-dark [@media(max-height:500px)]:!text-[14px] sm:text-left">
                {l.name}
              </h3>
              <p className="mt-2 text-center text-[13px] leading-relaxed text-black/60 [@media(max-height:500px)]:!mt-1 [@media(max-height:500px)]:!text-[10.5px] [@media(max-height:500px)]:!leading-snug sm:text-left">
                {l.tags}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
