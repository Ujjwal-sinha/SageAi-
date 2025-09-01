import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeatureSection } from '@/components/feature-section';
import { AIPromptShowcase } from '@/components/ai-prompt-showcase';
import { StatsSection } from '@/components/stats-section';
import { Footer } from '@/components/footer';
import { CTASection } from '@/components/cta-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 pointer-events-none z-0"></div>
      <Navbar />
      <HeroSection />
      <AIPromptShowcase />
      <FeatureSection />
      
      <CTASection/>
      <Footer />
    </main>
  );
}