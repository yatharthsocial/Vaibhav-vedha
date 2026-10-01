"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/SocialIcons";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/#about" },
      { label: "Leadership", href: "/#leadership" },
      { label: "Our Verticals", href: "/#verticals" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Gallery", href: "/#gallery" },
      { label: "Insights", href: "/insights" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
];

const socials = [
  { key: "instagram", icon: InstagramIcon, href: "#" },
  { key: "linkedin", icon: LinkedinIcon, href: "#" },
  { key: "facebook", icon: FacebookIcon, href: "#" },
  { key: "twitter", icon: TwitterIcon, href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Same one-shot, low-threshold reveal used across the rest of the
  // site (see LeadershipSection, FAQSection) — fires as soon as a
  // sliver of the footer enters view, then disconnects.
  useEffect(() => {
    const el = footerRef.current;
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
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-brand-green-dark px-6 pb-10 pt-20 text-white lg:px-16 lg:pt-24"
    >
      {/* A thin gold line across the very top — the same accent
          colour used as a divider everywhere else on the site (the
          short rule beside every section eyebrow), here stretched
          full-width to mark the page's actual end. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold-light/50 to-transparent" />

      <div
        className="relative mx-auto w-full max-w-6xl transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {/* Mobile: logo block full-width and centered, then the two
            link columns paired side by side (rather than each one
            stacking full-width, which just made for a long, repetitive
            scroll), then Get in Touch full-width and centered again.
            From sm up, this settles back into the original left-aligned
            row of columns. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-center sm:grid-cols-2 sm:gap-12 sm:text-left lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col items-center sm:col-span-1 sm:mx-0 sm:max-w-xs sm:items-start">
            <Image
              src="/logo.png"
              alt="Vaibhav Veda Green Ventures"
              width={480}
              height={480}
              className="h-14 w-14"
            />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              A diversified enterprise spanning real estate, infrastructure, legal consulting,
              interiors and design, and media and branding.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  aria-label={key}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors duration-300 hover:border-brand-neon-green hover:text-brand-neon-green"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-light">
                {col.title}
              </span>
              <ul className="mt-5 space-y-3 sm:space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[13.5px] text-white/60 transition-colors hover:text-white"
                    >
                      {/* A small dash that slides in from the left on
                          hover — a cheap, tasteful "this is a real
                          link" cue, matching the rest of the site's
                          preference for small deliberate motion over
                          static text. */}
                      <span className="h-px w-0 bg-brand-neon-green transition-[width] duration-300 group-hover:w-3" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-light">
              Get in Touch
            </span>
            <ul className="mt-5 space-y-3 text-[13.5px] text-white/60 sm:space-y-2.5">
              <li>Karnataka, India</li>
              <li>
                <a href="mailto:info@vaibhavveda.com" className="transition-colors hover:text-white">
                  info@vaibhavveda.com
                </a>
              </li>
              <li>
                <a href="tel:+911234567890" className="transition-colors hover:text-white">
                  +91 12345 67890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* A huge, barely-there wordmark — the same "quiet depth, not
            a flat fill" move used in the Gallery section's typed
            watermark, just static here since there's no scroll-sweep
            to type it against. Given its own reserved-height band in
            normal document flow (rather than being absolutely
            positioned against the footer's bottom edge with a guessed
            offset) so it can never overlap the columns above or the
            copyright bar below, regardless of how tall either one
            renders at any breakpoint. */}
        <div
          aria-hidden="true"
          className="relative mt-10 h-14 overflow-hidden sm:mt-12 sm:h-20 lg:mt-14 lg:h-28"
        >
          <span
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden whitespace-nowrap font-sans font-extrabold uppercase leading-none tracking-tight text-white/[0.05]"
            style={{ fontSize: "clamp(2.5rem, 9vw, 150px)" }}
          >
            Vaibhav Veda
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:mt-10 sm:flex-row">
          <p className="text-center text-[12px] text-white/40">
            © {new Date().getFullYear()} Vaibhav Veda Green Ventures. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-[12px] text-white/40 transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-[12px] text-white/40 transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
