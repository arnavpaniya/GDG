"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WhyBetterSection from "@/components/landing/WhyBetterSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main
      className="relative bg-bg-primary text-text-primary overflow-x-hidden"
      data-testid="landing-page"
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyBetterSection />
      <HowItWorksSection />
      <OutcomesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
