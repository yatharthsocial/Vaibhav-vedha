"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const faqs: { question: string; answer: string }[] = [
  {
    question: "What does Vaibhav Veda Green Ventures do?",
    answer:
      "We're a diversified group building ventures across real estate, infrastructure, education, advisory and digital solutions, with sustainability built into how every business under our umbrella operates.",
  },
  {
    question: "Which sectors do you operate in?",
    answer:
      "Five verticals: Green (sustainability and renewable energy), Build (real estate and construction), Learn (education and skill development), Advise (business and financial advisory) and Digital (technology and IT solutions).",
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
      "You can write to us directly or connect with any of our leadership team listed above — we're always open to new conversations.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[#f5f4f1] px-6 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-12 text-center">
          <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">FAQ</span>
          <h2 className="mt-4 font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[44px]">
            Frequently asked questions.
          </h2>
        </div>

        <div className="divide-y divide-black/10 border-y border-black/10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-bold text-brand-green-dark sm:text-[17px]">
                    {faq.question}
                  </span>
                  <Plus
                    className={`h-5 w-5 flex-none text-brand-gold transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-[13.5px] leading-relaxed text-black/60 sm:text-[14.5px]">
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
