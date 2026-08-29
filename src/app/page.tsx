import HeroAboutTransition from "@/components/HeroAboutTransition";
import LeadershipSection from "@/components/LeadershipSection";
import VerticalsShowcase from "@/components/VerticalsShowcase";

export default function Home() {
  return (
    <main className="w-full bg-black">
      <HeroAboutTransition />
      <VerticalsShowcase />
      <LeadershipSection />
    </main>
  );
}
