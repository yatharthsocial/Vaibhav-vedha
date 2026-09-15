"use client";

import { useEffect, useRef, useState } from "react";

const images: { src: string; caption: string }[] = [
  { src: "/verticals/build.jpg", caption: "Real Estate & Construction" },
  { src: "/verticals/green.jpg", caption: "Green & Sustainability" },
  { src: "/verticals/learn.jpg", caption: "Education & Skilling" },
  { src: "/verticals/advise.jpg", caption: "Business Advisory" },
  { src: "/verticals/digital.jpg", caption: "Digital Solutions" },
];

// How long the watermark takes to type itself out once the section
// scrolls into view, and how much of a beat to leave before the
// images start their own reveal right after.
const TYPE_DURATION_MS = 1100;
const IMAGES_START_DELAY_MS = 150;

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);

  // A plain scroll-into-view trigger, not a scroll-scrubbed animation —
  // this section behaves like every other one on the page (natural
  // scroll, no pinning, no extra scroll distance). Once it's in view
  // the whole sequence just plays once, on its own timer: the
  // watermark types out over TYPE_DURATION_MS, then the images fade
  // up right after.
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
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(
      () => setImagesVisible(true),
      TYPE_DURATION_MS + IMAGES_START_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white px-6 py-24 [@media(max-height:500px)]:!py-10 lg:px-16 lg:py-28"
    >
      {/* A giant, faint wordmark sitting behind everything else — quiet
          background texture. Typed out via a clip-path transition
          triggered once by scrolling into view (not scroll-scrubbed),
          with a thin cursor riding the reveal edge. Sized in vw (with
          a floor and cap) so it always sits comfortably inside the
          viewport at any screen size, mobile included. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-[clamp(2.75rem,15vw,220px)] [@media(max-height:500px)]:!text-[clamp(2rem,9vw,110px)]">
        <span
          aria-hidden="true"
          className="block select-none whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-tight text-black/[0.05] transition-[clip-path]"
          style={{
            clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transitionDuration: `${TYPE_DURATION_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          Gallery
        </span>
        <span
          aria-hidden="true"
          className="absolute top-0 h-full w-[3px] bg-brand-gold/50 transition-all"
          style={{
            left: visible ? "100%" : "0%",
            opacity: imagesVisible ? 0 : 1,
            transitionDuration: `${TYPE_DURATION_MS}ms, 200ms`,
            transitionProperty: "left, opacity",
            transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-brand-gold" />
          <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
            OUR WORK
          </span>
          <span className="h-px w-10 bg-brand-gold" />
        </div>

        <h2 className="mt-4 max-w-xl font-sans text-[36px] font-extrabold leading-[1.08] tracking-tight text-brand-green-dark [@media(max-height:500px)]:!mt-2 [@media(max-height:500px)]:!max-w-md [@media(max-height:500px)]:!text-[22px] [@media(max-height:500px)]:!leading-[1.2] sm:text-[52px]">
          A glimpse of what we build.
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-14 grid w-full max-w-6xl grid-cols-2 gap-4 [@media(max-height:500px)]:!mt-6 [@media(max-height:500px)]:!gap-3 sm:mt-16 sm:grid-cols-5 sm:gap-5">
        {images.map((img, i) => (
          <div
            key={img.src}
            className="relative overflow-hidden bg-black/5 shadow-lg transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              aspectRatio: "3 / 4",
              opacity: imagesVisible ? 1 : 0,
              // translate3d rather than translateX — it forces the browser
              // to promote this box to its own GPU compositor layer up
              // front, so the slide is composited smoothly throughout
              // instead of only getting promoted (with a possible frame
              // hitch) once the transition starts. That promotion is what
              // makes this read as consistently smooth on real mobile
              // hardware, not just in a desktop-class browser.
              transform: imagesVisible ? "translate3d(0, 0, 0)" : "translate3d(48px, 0, 0)",
              willChange: "opacity, transform",
              transitionDelay: imagesVisible ? `${i * 100}ms` : "0ms",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.caption} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
