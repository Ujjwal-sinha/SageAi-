import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeatureSection } from '@/components/feature-section';
import { Footer } from '@/components/footer';
import { CTASection } from '@/components/cta-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-5" />
      </div>
      
      {/* Very subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5" />
      </div>
      
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <CTASection/>
      <Footer />
    </main>
  );
}