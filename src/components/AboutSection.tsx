import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

// Placeholder photo — swap for real About imagery when it's ready (any
// path under /public works).
const PHOTO = "/verticals/advise.jpg";

const connections = [
  "A learner finding the right opportunity.",
  "An institution meeting the right industry partner.",
  "A sustainable idea finding the expertise to become viable.",
  "A project bringing together people who make it happen.",
];

// Every [data-reveal] element's hidden/shown states and timing live in
// globals.css (the #about rules); --i is its place in the stagger.
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// One headline line inside its own mask, so it slides up into view
// from behind an invisible edge rather than fading in.
function MaskLine({ i, children }: { i: number; children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span data-reveal="line" className="block" style={order(i)}>
        {children}
      </span>
    </span>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative grid h-full w-full grid-cols-1 overflow-hidden bg-[#f7f5ef] text-brand-green-dark lg:grid-cols-[44%_minmax(0,1fr)]"
    >
      {/* Left — one full-height photo, edge to edge. Desktop only: on
          a phone the panel is a single screen and the text needs it. */}
      <div data-reveal="image" className="relative hidden overflow-hidden lg:block" style={order(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO}
          alt="The Vaibhav Veda team in a meeting"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/70 via-transparent to-transparent" />
        <p data-reveal="fade" style={order(3)} className="absolute bottom-10 left-10 right-10 max-w-sm font-serif text-[22px] italic leading-snug text-white xl:text-[26px]">
          &ldquo;Because the future we imagine will be built together.&rdquo;
        </p>
        {/* Curtain in the panel's own color, lifting off the photo — a
            transform (GPU-composited), unlike a clip-path wipe, which
            repaints the whole image every frame. Last child so it
            covers the gradient and quote too. */}
        <div className="about-curtain absolute inset-0 bg-[#f7f5ef]" />
      </div>

      {/* Right — copy, spread over the full panel height. */}
      <div className="flex h-full flex-col justify-between gap-8 px-6 py-14 [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:py-4 sm:px-12 lg:px-14 lg:py-14 xl:px-20">
        <div
          data-reveal="fade"
          className="flex items-baseline justify-between border-b border-brand-green-dark/15 pb-4 [@media(max-height:500px)]:pb-1.5"
          style={order(1)}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-green-light">
            About Vaibhav Veda
          </span>
          <span className="font-serif text-[15px] italic text-brand-green-dark/60">Est. 2021</span>
        </div>

        <div>
          <h2
            className="font-serif font-medium leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(30px, min(5.4vw, 8.5vh), 80px)" }}
          >
            <MaskLine i={2}>Progress grows</MaskLine>
            <MaskLine i={3}>
              when we <em className="text-brand-green-light">grow</em>
            </MaskLine>
            <MaskLine i={4}>
              <em className="text-brand-green-light">together.</em>
            </MaskLine>
          </h2>

          <p
            data-reveal="fade"
            className="mt-7 max-w-xl text-[14px] leading-relaxed text-black/60 [@media(max-height:500px)]:hidden sm:text-[15.5px]"
            style={order(5)}
          >
            Every meaningful transformation begins with a connection. We work at the intersection
            of enterprise, sustainability, infrastructure, education, advisory and technology,
            creating partnerships that turn possibilities into lasting outcomes.
          </p>
        </div>

        <ol
          data-reveal="fade"
          className="grid grid-cols-2 gap-x-6 gap-y-5 [@media(max-height:560px)]:hidden xl:grid-cols-4"
          style={order(6)}
        >
          {connections.map((c, i) => (
            <li key={c} className="border-t border-brand-green-dark/20 pt-3">
              <span className="font-serif text-[13px] italic text-brand-gold">0{i + 1}</span>
              <p className="mt-1.5 text-[13px] leading-snug text-black/65 sm:text-[13.5px]">{c}</p>
            </li>
          ))}
        </ol>

        <div
          data-reveal="fade"
          className="flex flex-wrap items-center justify-between gap-4"
          style={order(7)}
        >
          <a
            href="#verticals"
            className="group inline-flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.14em] text-brand-green-dark [@media(max-height:500px)]:text-[10px]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green-dark text-white transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-brand-green-light [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
              Explore our verticals
            </span>
          </a>
          <span className="font-serif text-[15px] italic text-brand-gold">
            Collaborate to Celebrate.
          </span>
        </div>
      </div>
    </section>
  );
}
