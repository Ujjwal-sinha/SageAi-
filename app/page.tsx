import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeatureSection } from '@/components/feature-section';
import { Footer } from '@/components/footer';
import { CTASection } from '@/components/cta-section';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Enhanced background with Web3 patterns */}
      <div className="absolute inset-0 -z-20">
        <div className="web3-grid opacity-30" />
        <div className="blockchain-pattern opacity-20" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full gradient-shift opacity-30 blur-3xl" />
      </div>
      
      {/* Floating background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl float" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl float-delayed" />
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-40 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl float-delayed" />
      </div>
      
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <CTASection/>
      <Footer />
    </main>
  );
}