import type { Metadata } from "next";
import Footer from "@/components/Footer";
import VerticalPage from "@/components/vertical/VerticalPage";
import { getVertical } from "@/lib/verticals";

const vertical = getVertical("learn");

export const metadata: Metadata = {
  title: `${vertical.name} — Vaibhav Veda Green Ventures`,
  description: vertical.hero.lead,
};

export default function LearnPage() {
  return (
    <main className="relative w-full bg-white">
      <VerticalPage slug="learn" />
      <Footer />
    </main>
  );
}
