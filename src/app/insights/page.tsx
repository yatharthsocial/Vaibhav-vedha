import Footer from "@/components/Footer";
import InsightsPageContent from "@/components/InsightsPageContent";

export const metadata = {
  title: "Insights — Vaibhav Veda Green Ventures",
  description:
    "Notes from across real estate, infrastructure, legal, design and media — from the people doing the work.",
};

export default function InsightsPage() {
  return (
    <main className="relative w-full bg-white">
      <InsightsPageContent />
      <Footer />
    </main>
  );
}
