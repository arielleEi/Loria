import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ToolsSection from "@/components/landing/ToolsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <ToolsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
