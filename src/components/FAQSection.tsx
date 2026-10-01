"use client";

import { ArrowRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "What does Vaibhav Veda Green Ventures do?",
    answer:
      "We're a diversified group building ventures across real estate, infrastructure, legal consulting, interiors and design, and media and branding, with sustainability built into how every business under our umbrella operates.",
  },
  {
    question: "Which sectors do you operate in?",
    answer:
      "Five verticals: Real Estate (residential, commercial and farm plots), Infrastructure (transportation and urban development), Legal Consulting (regulatory compliance and corporate law), Interiors & Design (residential and commercial spaces) and Media & Branding (advertising and media strategy).",
  },
  {
    question: "Where is the group based?",
    answer:
      "Our roots are in Karnataka, with an India-wide footprint today and ambitions to grow globally as each vertical scales.",
  },
  {
    question: "How can I partner or invest with you?",
    answer:
      "Reach out through our contact details and our team will connect you with the right vertical lead to discuss partnership or investment opportunities.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "You can write to us directly or connect with any of our leadership team listed above. We're always open to new conversations.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Same one-shot, low-threshold reveal pattern as the rest of the
  // site (see LeadershipSection) — fires as soon as a sliver of the
  // section enters view, then disconnects, so it never re-triggers.
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
      id="faq"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#f5f4f1] px-6 py-24 lg:px-16 lg:py-32"
    >
      {/* A quiet gold glow behind the heading — the same "the page
          feels alive, not a flat fill" cue used elsewhere (About's
          radial gradient, the ambient-drift blobs), just toned down
          for this light background. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 15% 0%, rgba(201,162,39,0.08), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_1.5fr] lg:items-center lg:gap-20">
          {/* Left — vertically centered against the full height of the
              list beside it, with its own CTA so this section doesn't
              dead-end without a next step. */}
          <div
            className="text-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:text-left"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="h-px w-10 bg-brand-gold" />
              <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">FAQ</span>
            </div>
            <h2 className="mt-4 font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[44px]">
              Frequently asked questions.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-black/55 lg:mx-0">
              The things people ask us most, answered straight. If yours
              isn&apos;t here, it goes straight to a person, not a ticket queue.
            </p>
            <a
              href="/#contact"
              className="group mx-auto mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-brand-green-dark px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-green lg:mx-0"
            >
              Still have questions?
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Right — the accordion itself. Each row's question sits
              beside its own tabular index (01, 02...) echoing the
              numbering already used in About's Mission/Vision and
              Leadership's highlights, and reveals with its own
              staggered rise rather than the whole list popping in at
              once. */}
          <div className="divide-y divide-black/10 border-t border-black/10">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: visible ? `${150 + i * 110}ms` : "0ms",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group flex w-full items-center gap-5 py-6 text-left sm:gap-6"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans text-[13px] font-bold tabular-nums text-brand-gold/70 sm:text-[14px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-bold transition-colors duration-300 sm:text-[18px] ${
                        isOpen
                          ? "text-brand-green-dark"
                          : "text-brand-green-dark/75 group-hover:text-brand-green-dark"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300 ${
                        isOpen
                          ? "rotate-45 border-brand-green-dark bg-brand-green-dark"
                          : "border-brand-green-dark/15 group-hover:border-brand-green-dark/40"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-colors duration-300 ${
                          isOpen ? "text-white" : "text-brand-green-dark/60"
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* The answer doesn't just appear the instant the
                          row's height finishes expanding — it fades
                          and rises in slightly after, and fades out
                          immediately (no delay) on close, so opening
                          reads as "height opens, then the text settles
                          in" rather than a flat reveal. */}
                      <p
                        className="max-w-xl pb-6 pl-[2.1rem] pr-10 text-[13.5px] leading-relaxed text-black/60 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:pl-[2.6rem] sm:text-[14.5px]"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
                          transitionDelay: isOpen ? "150ms" : "0ms",
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
