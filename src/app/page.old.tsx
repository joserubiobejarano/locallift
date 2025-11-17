import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { WhoItsForSection } from "@/components/marketing/WhoItsForSection";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <HeroSection />
      <FeatureShowcase />
      <TestimonialsSection />
      <FAQSection />
      <WhoItsForSection />
      <CTASection />
    </main>
  );
}

