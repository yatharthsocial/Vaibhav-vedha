"use client";

import Image, { type StaticImageData } from "next/image";
import drNaveenKumarPhoto from "@/DrNaveenKumar.png";
import drShilpaNaveenPhoto from "@/DrShilpaNaveenKumar.png";
import { useEffect, useRef, useState } from "react";

const leaders: {
  index: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  highlights: { title: string; text: string }[];
  photo: StaticImageData;
  // object-position for the portrait crop — the source photos aren't
  // framed for a 4:5 box, so each one says where its subject sits.
  photoPosition: string;
  // Optional background-removed portrait. When set, it's shown on a
  // green circle with the head rising above the circle's rim, instead
  // of the boxed photo.
  cutout?: { src: string; width: number; height: number };
}[] = [
  {
    index: "01",
    name: "Dr. M. Naveen Kumar",
    title: "Chairman & Managing Director",
    bio: "Dr. Naveen brings together enterprise building, green growth, skill development, infrastructure and institutional collaboration. His work connects industry, academia, government ecosystems and emerging opportunities, giving Vaibhav Veda a leadership perspective grounded in partnerships and long-term institution building.",
    tags: [
      "Entrepreneur",
      "Orator",
      "Green Energy Propagator",
      "Institutional Leader",
    ],
    // Kept to roughly the same length on purpose — with three
    // side-by-side columns, uneven lengths wrap to different line
    // counts and leave the row with a ragged, unaligned bottom edge.
    highlights: [
      {
        title: "Board of Director",
        text: "Skill Council for Green Jobs.",
      },
      {
        title: "Governing Council Member",
        text: "Sector Skill Council for Green Jobs, MSDE, Government of India.",
      },
      {
        title: "Syndicate Member",
        text: "Governor-nominated, Bengaluru North University, Government of Karnataka.",
      },
    ],
    photo: drNaveenKumarPhoto,
    photoPosition: "42% center",
    // Cut out of public/gallery/final-naveen.jpeg (person segmentation).
    cutout: {
      src: "/leadership/naveen-cutout.webp",
      width: 1144,
      height: 1100,
    },
  },
  {
    index: "02",
    name: "Dr. Shilpa H. Naveen",
    title: "Director",
    bio: "An economist by profession, social entrepreneur, edupreneur and transformation speaker, Dr. Shilpa brings a deeply people-centred perspective to the Vaibhav Veda journey. Her work reflects a belief that growth becomes meaningful when its benefits travel beyond organisations and reach individuals, families and communities.",
    tags: [
      "Economist",
      "Social Entrepreneur",
      "Edupreneur",
      "Transformation Speaker",
    ],
    highlights: [
      {
        title: "Health",
        text: "Because dignity begins with well-being.",
      },
      {
        title: "Education",
        text: "Because knowledge creates choices.",
      },
      {
        title: "Empowerment",
        text: "Because opportunity becomes powerful when people can shape their own future.",
      },
    ],
    photo: drShilpaNaveenPhoto,
    photoPosition: "50% 15%",
    // Cut out of public/gallery/Dr. Shilpa H. Naveen.jpeg (person
    // segmentation, edges de-fringed), framed to match Dr. Naveen's.
    cutout: {
      src: "/leadership/shilpa-cutout.webp",
      width: 1173,
      height: 1100,
    },
  },
];

// Geometry of the cut-out portrait, in a box BOX_H × its own width
// tall. The circle is CIRCLE_D of the box width across, sitting on the
// box's bottom edge, with its centre at CIRCLE_CY % of the height. The
// portrait is drawn twice: once clipped to the circle, and once clipped
// to a central strip above the circle's centre — together that reads as
// the subject standing in the circle with only the head rising past
// its rim.
const CIRCLE_D = 0.9;
const BOX_H = 1.1;
// The portrait is drawn this much wider than the box (centred), so the
// figure is a little larger than the circle and the head clears the rim.
const FIGURE_W = 1.1;
const CIRCLE_CY = ((BOX_H - CIRCLE_D / 2) / BOX_H) * 100;
const CIRCLE_RX = (CIRCLE_D / 2) * 100;
const CIRCLE_RY = (CIRCLE_D / 2 / BOX_H) * 100;
const HEAD_BAND = 0.4;

// The figure rises from below the circle's bottom edge up into place.
// Only the image moves — the clip shapes stay put — so the figure is
// hidden until it enters the circle, then emerges from inside it.
const RISE_MS = 1500;

function CutoutPortrait({
  cutout,
  alt,
}: {
  cutout: { src: string; width: number; height: number };
  alt: string;
}) {
  // Each portrait animates when it scrolls into view itself, rather
  // than both firing as soon as the section's top edge appears.
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
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layers = [
    `ellipse(${CIRCLE_RX}% ${CIRCLE_RY}% at 50% ${CIRCLE_CY}%)`,
    // Above-the-rim layer: reaches down to the circle's centre line so
    // it overlaps the curved top edge with no gap, but only across a
    // central band (HEAD_BAND of the width) so the shoulders never
    // spill past the circle's sides — only the head clears the rim.
    `inset(0 ${(100 - HEAD_BAND * 100) / 2}% ${100 - CIRCLE_CY}% ${(100 - HEAD_BAND * 100) / 2}%)`,
  ];
  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ aspectRatio: `1 / ${BOX_H}` }}
    >
      {/* The circle — brand-green with a soft light source top-left,
          plus a thin outer ring. */}
      <div
        className="absolute bottom-0 left-1/2 aspect-square transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: `${CIRCLE_D * 100}%`,
          opacity: visible ? 1 : 0,
          transform: `translateX(-50%) scale(${visible ? 1 : 0.85})`,
          transformOrigin: "50% 100%",
        }}
      >
        <span className="absolute -inset-3 rounded-full border border-brand-green-dark/15" />
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #1f7a45 0%, #145c34 45%, #0e3b23 100%)",
          }}
        />
      </div>

      {/* The portrait, twice — see the geometry note above. The clip
          wrappers stay still; only the image inside them rises. */}
      {layers.map((clip, i) => (
        <div
          key={clip}
          className="absolute inset-0"
          style={{ clipPath: clip }}
          aria-hidden={i > 0}
        >
          <Image
            src={cutout.src}
            alt={i === 0 ? alt : ""}
            width={cutout.width}
            height={cutout.height}
            sizes="(min-width: 640px) 40vw, 100vw"
            className="absolute bottom-0 h-auto max-w-none will-change-transform"
            style={{
              width: `${FIGURE_W * 100}%`,
              left: `${((1 - FIGURE_W) / 2) * 100}%`,
              transform: visible
                ? "translate3d(0, 0, 0)"
                : "translate3d(0, 100%, 0)",
              transition: `transform ${RISE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${
                visible ? "250ms" : "0ms"
              }`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function LeadershipSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // A low threshold (just a sliver of the section visible, rather than
  // 20% of it) so the reveal fires right as the section starts
  // entering the viewport from below — with the highlights content
  // added, this section is now tall enough that a higher threshold
  // meant the content had already scrolled most of the way into view,
  // static and un-animated, before the fade/rise even triggered.
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
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="leadership"
      ref={sectionRef}
      className="relative w-full bg-[#f5f4f1] px-6 py-24 [@media(max-height:500px)]:!py-10 lg:px-16 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className="mb-16 text-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] [@media(max-height:500px)]:!mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
            OUR LEADERSHIP
          </span>
          <h2 className="mt-4 font-sans text-[28px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[38px]">
            Leadership with a Wider Purpose
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-black/55 sm:text-[15px]">
            Behind Vaibhav Veda is a belief that enterprise carries the ability
            to create opportunity far beyond business itself.
          </p>
        </div>

        {/* Full-width profile rows, alternating photo side, instead of
            a card grid — reads as an actual executive-team page rather
            than a repeated feature-card template. The small inline
            01/02 index before each title echoes the same numbering
            already used in the About section's Mission/Vision pair. */}
        <div className="flex flex-col divide-y divide-black/10">
          {leaders.map((l, i) => (
            <div
              key={l.name}
              className={`flex flex-col gap-8 py-14 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-14 [@media(max-height:500px)]:!gap-4 [@media(max-height:500px)]:!py-6 ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* The photo stays put — only the text column slides up
                  from below and fades in, so the portrait reads as
                  already-there rather than something flying in. */}
              <div
                className={`relative w-full flex-none ${l.cutout ? "sm:w-[40%]" : "sm:w-[36%]"}`}
              >
                {l.cutout ? (
                  <CutoutPortrait cutout={l.cutout} alt={l.name} />
                ) : (
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-green-dark [@media(max-height:500px)]:!aspect-[3/4]">
                    <Image
                      src={l.photo}
                      alt={l.name}
                      fill
                      sizes="(min-width: 640px) 36vw, 100vw"
                      placeholder="blur"
                      className="object-cover"
                      style={{ objectPosition: l.photoPosition }}
                    />
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                {/* Each piece of the text column rises and fades in on
                    its own, one after another (eyebrow, then name,
                    then bio, then tags, then highlights) — not the
                    whole block moving as a single unit, so it reads as
                    a cascade of sentences arriving rather than one
                    flat slide. */}
                <div
                  className="flex items-baseline gap-2 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(18px)",
                    transitionDelay: visible ? `${150 + i * 180}ms` : "0ms",
                  }}
                >
                  <span className="font-sans text-[11px] font-semibold text-black/30">
                    {l.index}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                    {l.title}
                  </span>
                </div>
                <div className="relative">
                  <h3
                    className="mt-2 text-[26px] font-extrabold text-brand-green-dark transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(max-height:500px)]:!text-[16px] sm:text-[32px]"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(18px)",
                      transitionDelay: visible ? `${240 + i * 180}ms` : "0ms",
                    }}
                  >
                    {l.name}
                  </h3>
                  <p
                    className="mt-3 max-w-md text-[13.5px] leading-relaxed text-black/60 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(max-height:500px)]:!mt-1.5 [@media(max-height:500px)]:!text-[11px] sm:text-[14.5px]"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(18px)",
                      transitionDelay: visible ? `${330 + i * 180}ms` : "0ms",
                    }}
                  >
                    {l.bio}
                  </p>
                  <div
                    className="mt-5 flex flex-wrap gap-2 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(max-height:500px)]:!mt-2"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(18px)",
                      transitionDelay: visible ? `${420 + i * 180}ms` : "0ms",
                    }}
                  >
                    {l.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand-green-dark/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-green-dark/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Fills out the rest of the column alongside the
                      portrait's own height (a bio plus a few tags left
                      a lot of bare space next to a tall 4:5 photo) with
                      actual substance rather than decorative padding —
                      the same bordered index/label/text pattern the
                      About section's Mission/Vision pair already
                      uses. */}
                  {/* line-clamp (title to 2 lines, text to 4) plus a
                      min-height on each matching that line count
                      makes every column the same height no matter how
                      the actual copy's word/character count varies —
                      a layout-level guarantee rather than hand-tuning
                      each blurb to match the others, which breaks
                      again the moment any one of them is edited. */}
                  <div
                    className="mt-8 grid grid-cols-1 gap-5 border-t border-black/10 pt-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(max-height:500px)]:!mt-4 [@media(max-height:500px)]:!pt-3 sm:grid-cols-3 sm:gap-6"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(18px)",
                      transitionDelay: visible ? `${510 + i * 180}ms` : "0ms",
                    }}
                  >
                    {l.highlights.map((h) => (
                      <div key={h.title}>
                        <span className="line-clamp-2 block min-h-[2.6em] text-[10px] font-bold uppercase leading-[1.3] tracking-[0.15em] text-brand-green-dark/80">
                          {h.title}
                        </span>
                        <p className="line-clamp-4 mt-2 min-h-[62px] text-[12.5px] leading-relaxed text-black/50">
                          {h.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
