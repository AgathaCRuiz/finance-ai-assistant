import { Navbar }           from "@/components/hero/Navbar";
import { HeroSection }      from "@/components/hero/HeroSection";
import { DashboardSection } from "@/components/hero/DashboardSection";
import { Features }         from "@/components/hero/Features";
import { TechLoop }         from "@/components/hero/TechLoop";
import { CTASection }       from "@/components/hero/CtaSection";
import { Footer }           from "@/components/hero/Footer";


export function HomePage() {
  return (
    <div style={{ background: "#07090d", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <Features />
      <TechLoop />
      <CTASection />
      <Footer />
    </div>
  );
}