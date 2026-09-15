"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/SocialIcons";

const socials = [
  { key: "instagram", icon: InstagramIcon, href: "#" },
  { key: "linkedin", icon: LinkedinIcon, href: "#" },
  { key: "facebook", icon: FacebookIcon, href: "#" },
  { key: "twitter", icon: TwitterIcon, href: "#" },
];

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-[14px] text-brand-green-dark outline-none transition-colors focus:border-brand-green";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-black/45";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative w-full bg-white px-6 py-24 lg:px-16 lg:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Left — details. Centered on mobile, back to the normal
            left-aligned layout from lg up. */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand-gold" />
            <span className="text-[14px] font-bold tracking-[0.25em] text-brand-gold">
              CONTACT US
            </span>
            <span className="h-px w-10 bg-brand-gold" />
          </div>

          <h2 className="mt-4 max-w-md font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight text-brand-green-dark sm:text-[44px]">
            Let&apos;s build something{" "}
            <span className="text-brand-neon-green">together.</span>
          </h2>

          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-black/55">
            Have a project in mind or want to explore a partnership? We&apos;d love to hear from
            you.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5 lg:items-start">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 flex-none text-brand-green" />
              <span className="text-left text-[14px] leading-relaxed text-black/70">
                Vaibhav Veda Green Ventures, Karnataka, India
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 flex-none text-brand-green" />
              <a
                href="mailto:info@vaibhavveda.com"
                className="text-[14px] text-black/70 transition-colors hover:text-brand-green-dark"
              >
                info@vaibhavveda.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 flex-none text-brand-green" />
              <a
                href="tel:+911234567890"
                className="text-[14px] text-black/70 transition-colors hover:text-brand-green-dark"
              >
                +91 12345 67890
              </a>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-5">
            {socials.map(({ key, icon: Icon, href }) => (
              <a
                key={key}
                href={href}
                aria-label={key}
                className="text-black/40 transition-colors hover:text-brand-green"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="rounded-2xl border border-black/10 bg-[#f5f4f1] p-6 sm:p-8">
          {submitted ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <p className="text-[18px] font-bold text-brand-green">Thank you.</p>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-black/55">
                We&apos;ve received your message and will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Name <span className="text-brand-gold">*</span>
                  </label>
                  <input required type="text" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    Email <span className="text-brand-gold">*</span>
                  </label>
                  <input required type="email" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea required rows={4} className={`${inputClass} resize-none`} />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-neon-green px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-brand-green-dark transition-opacity hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
