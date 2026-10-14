import type { Metadata } from "next";
import Footer from "@/components/Footer";
import VerticalPage from "@/components/vertical/VerticalPage";
import { getVertical } from "@/lib/verticals";

const vertical = getVertical("digital");

export const metadata: Metadata = {
  title: `${vertical.name} — Vaibhav Veda Green Ventures`,
  description: vertical.hero.lead,
};

export default function DigitalPage() {
  return (
    <main className="relative w-full bg-white">
      <VerticalPage slug="digital" />
      <Footer />
    </main>
  );
}
