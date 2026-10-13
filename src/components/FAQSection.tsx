"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "What does Vaibhav Veda Green Ventures do?",
    answer:
      "We bring together industry, institutions, expertise and opportunity to create solutions that strengthen businesses, empower people and contribute to a more sustainable future.",
  },
  {
    question: "Which areas do you work in?",
    answer:
      "Five interconnected verticals: Green (renewable energy, sustainability and green skills), Build (infrastructure and development), Learn (industry-linked education and skills), Advise (strategic and institutional advisory) and Digital (technology-led solutions).",
  },
  {
    question: "Who do you work with?",
    answer:
      "Government, industry, academia, enterprise and communities. Our approach is partnership-led, bringing complementary strengths to the same table around a shared purpose.",
  },
  {
    question: "How can I partner with you?",
    answer:
      "Reach out through the contact form below and our team will connect you with the right vertical to discuss the opportunity.",
  },
  {
    question: "Where are you based?",
    answer: "We're based in Karnataka, India.",
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

  const rise = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transitionDelay: visible ? `${delayMs}ms` : "0ms",
  });
  const riseClass =
    "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative w-full bg-[#f5f4f1] px-6 pb-4 pt-16 lg:px-16 lg:pb-6 lg:pt-20"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className={`text-center ${riseClass}`} style={rise(0)}>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-brand-gold" />
            <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
              FAQ
            </span>
            <span className="h-px w-10 bg-brand-gold" />
          </div>
          <h2 className="mt-4 font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[44px]">
            Common questions.
          </h2>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border transition-[background-color,border-color,box-shadow,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? "border-brand-green-light/35 bg-white shadow-[0_18px_40px_-22px_rgba(14,59,35,0.35)]"
                    : "border-black/[0.04] bg-white/70 hover:bg-white"
                }`}
                style={rise(120 + i * 90)}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left sm:gap-5 sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-green-dark/[0.06] text-[11px] font-bold tabular-nums text-brand-green-dark/60">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[15px] font-bold text-brand-green-dark sm:text-[17px]">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen
                        ? "rotate-45 border-brand-green-dark/20 bg-white text-brand-green-dark"
                        : "border-brand-green-dark bg-brand-green-dark text-white"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Fades and rises in just after the row opens, and
                          fades out immediately on close. */}
                    <p
                      className="max-w-xl pb-6 pl-[3.75rem] pr-6 text-[13.5px] leading-relaxed text-black/60 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:pl-[4.75rem] sm:text-[14.5px]"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen
                          ? "translateY(0)"
                          : "translateY(-8px)",
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
    </section>
  );
}
