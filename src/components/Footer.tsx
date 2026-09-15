import Image from "next/image";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/icons/SocialIcons";

const columns: { title: string; links: string[] }[] = [
  {
    title: "Company",
    links: ["Home", "About Us", "Leadership", "Our Verticals"],
  },
  {
    title: "More",
    links: ["Gallery", "FAQ", "Contact Us"],
  },
];

const socials = [
  { key: "instagram", icon: InstagramIcon, href: "#" },
  { key: "linkedin", icon: LinkedinIcon, href: "#" },
  { key: "facebook", icon: FacebookIcon, href: "#" },
  { key: "twitter", icon: TwitterIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-brand-green-dark px-6 pb-8 pt-16 text-white lg:px-16 lg:pt-20">
      <div className="mx-auto w-full max-w-6xl">
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
              className="h-12 w-12"
            />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              A diversified enterprise spanning real estate, infrastructure, education, advisory
              and digital solutions.
            </p>
            <div className="mt-6 flex items-center gap-5 sm:gap-4">
              {socials.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  aria-label={key}
                  className="text-white/45 transition-colors hover:text-brand-neon-green"
                >
                  <Icon className="h-[18px] w-[18px] sm:h-4 sm:w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold-light">
                {col.title}
              </span>
              <ul className="mt-4 space-y-3 sm:space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13.5px] text-white/60 transition-colors hover:text-white"
                    >
                      {link}
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
            <ul className="mt-4 space-y-3 text-[13.5px] text-white/60 sm:space-y-2.5">
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:flex-row">
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
