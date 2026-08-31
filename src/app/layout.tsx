import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Vaibhav Veda Green Ventures",
  description:
    "Vaibhav Veda Green Ventures is a diversified enterprise working across real estate, infrastructure, education, advisory and digital solutions for a better tomorrow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
      // Browser extensions (password managers, ad/tracker blockers,
      // etc.) commonly inject their own attributes onto <html> before
      // React hydrates — e.g. a "data-qb-installed" attribute showed
      // up here on a real device, from whatever extension is on that
      // browser, not from anything this app renders. React would
      // otherwise log a hydration-mismatch warning for every such
      // extension on every visitor's browser; this scopes the
      // suppression to just this element's own attributes, so it
      // doesn't hide a real mismatch anywhere else in the tree.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
