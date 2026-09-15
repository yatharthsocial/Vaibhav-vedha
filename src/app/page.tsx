import BusinessSection from "@/components/BusinessSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import HeroAboutTransition from "@/components/HeroAboutTransition";
import LeadershipSection from "@/components/LeadershipSection";

export default function Home() {
  return (
    <main className="w-full bg-black">
      <HeroAboutTransition />
      <LeadershipSection />
      <BusinessSection />
      <GallerySection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
