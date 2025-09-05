"use client";

import Link from "next/link";
import React from "react";
import { FaBolt, FaExpandArrowsAlt, FaCogs, FaShieldAlt } from "react-icons/fa";
import { Brain, Zap, Shield, Cpu, Network, ArrowRight } from "lucide-react";

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-cyan-400 text-5xl mb-4 block animate-pulse">{children}</span>
);

const HeroSection: React.FC = () => (
  <section className="text-center mb-24 pt-16 relative">
    {/* Background glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
    
    <div className="relative z-10">
      <h1 className="text-6xl md:text-7xl font-display text-holographic text-glow mb-8">Sage AI</h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
        The next generation of <span className="text-cyan-400 font-semibold">decentralized AI</span> for Web3. 
        Empowering developers and users with blockchain-backed intelligence for smart contracts, DeFi, NFTs, and more.
      </p>
      
      <Link href="/dashboard">
        <button className="btn-holographic font-bold px-12 py-6 text-xl mt-8 hover-lift group">
          <span className="flex items-center gap-3">
            GET STARTED
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </Link>
    </div>
  </section>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="flex flex-col items-center glass-card border border-cyan-500/20 rounded-3xl p-8 hover:neon-glow-cyan transition-all hover-lift text-white backdrop-blur group relative overflow-hidden">
    {/* Holographic overlay */}
    <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
    
    <div className="relative z-10 text-center">
      <Icon>{icon}</Icon>
      <h3 className="text-xl font-display text-cyan-400 mt-4 mb-3 group-hover:text-glow transition-all">{title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

const BenefitsList: React.FC = () => (
  <section className="container-web3 web3-grid mb-20">
    <FeatureCard
      icon={<FaBolt />}
      title="Faster Transactions"
      description="Access AI services quickly with parallel processing through Somnia Blockchain's high-performance infrastructure."
    />
    <FeatureCard
      icon={<FaExpandArrowsAlt />}
      title="Enhanced Scalability"
      description="Handles increasing users and AI operations without lag using advanced distributed computing."
    />
    <FeatureCard
      icon={<FaCogs />}
      title="Increased Efficiency"
      description="Optimized system resources for smooth, cost-effective AI operations with quantum-inspired algorithms."
    />
    <FeatureCard
      icon={<FaShieldAlt />}
      title="Future-Proof Infrastructure"
      description="A scalable, secure backbone ready for next-generation AI applications and blockchain evolution."
    />
  </section>
);

const AboutPage: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
    {/* Enhanced background */}
    <div className="absolute inset-0 -z-20">
      <div className="cyber-grid opacity-10" />
      <div className="hex-pattern opacity-5" />
      <div className="circuit-pattern opacity-3" />
    </div>
    
    {/* Floating particles */}
    <div className="absolute inset-0 -z-10">
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          className="blockchain-node"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          }}
        />
      ))}
    </div>
    
    <main className="flex-1 overflow-y-auto px-8 py-16 custom-scrollbar">
      <HeroSection />

      {/* Enhanced content sections */}
      <section className="container-web3 mb-20 space-y-16">
        <div className="glass-strong border-2 border-cyan-500/30 rounded-3xl p-12 hover:neon-glow-purple transition-all hover-lift relative overflow-hidden group">
          {/* Holographic overlay */}
          <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
          
          <div className="relative z-10 space-y-12">
            <div>
              <h2 className="text-4xl font-display text-cyan-400 mb-6 flex items-center gap-4">
                <Brain className="w-10 h-10 animate-pulse" />
                Our Vision
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                Sage AI pioneers decentralized AI by giving users cutting-edge tools for the Web3 ecosystem. 
                Our vision: empower developers and users with <span className="text-cyan-400 font-semibold">blockchain-backed AI</span> for 
                smart contract insights, market predictions, NFT creation, and DeFi intelligence — all with 
                scalability, efficiency, and transparency at its core.
              </p>
            </div>
            
            <div>
              <h2 className="text-4xl font-display text-purple-400 mb-6 flex items-center gap-4">
                <Network className="w-10 h-10 animate-pulse" />
                What is Somnia Blockchain?
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                Somnia Blockchain is a modern distributed ledger technology that enables high-performance 
                decentralized applications. It supports <span className="text-purple-400 font-semibold">parallel transaction processing</span> and 
                advanced smart contract capabilities — meaning higher throughput and faster confirmations for 
                AI-powered Web3 applications.
              </p>
            </div>
            
            <div>
              <h2 className="text-4xl font-display text-green-400 mb-6 flex items-center gap-4">
                <Zap className="w-10 h-10 animate-pulse" />
                Why Somnia Blockchain for Sage AI?
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                Somnia Blockchain is ideal for decentralized AI — it's <span className="text-green-400 font-semibold">scalable, fast, and efficient</span>. 
                It allows our AI models to run under high loads without compromising speed or accuracy, 
                enabling seamless integration of advanced features and future-proof infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BenefitsList />

      {/* Enhanced future goals section */}
      <section className="container-web3 text-center mb-20">
        <div className="glass-strong border-2 border-purple-500/30 rounded-3xl p-16 hover:neon-glow-cyan transition-all hover-lift relative overflow-hidden group">
          {/* Holographic overlay */}
          <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-display text-purple-400 mb-8 flex items-center justify-center gap-4">
              <Shield className="w-10 h-10 animate-pulse" />
              Our Future Goals
            </h2>
            <p className="text-gray-200 leading-relaxed text-xl max-w-3xl mx-auto">
              Our roadmap includes developing <span className="text-purple-400 font-semibold">specialized AI models</span> tailored for Web3, 
              integrating across more chains, and building a strong developer community. 
              We aim to be the leading platform where <span className="text-cyan-400 font-semibold">decentralized AI thrives</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced final CTA */}
      <section className="container-web3 text-center mt-16">
        <div className="glass-card border border-cyan-500/20 rounded-3xl p-12 hover-glow">
          <h2 className="text-3xl font-display text-cyan-400 mb-4 flex items-center justify-center gap-3">
            <Cpu className="w-8 h-8 animate-pulse" />
            Join the Decentralized AI Revolution
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Start your journey with Sage AI and harness the power of scalable, decentralized intelligence.
          </p>
          
          <Link href="/dashboard">
            <button className="btn-holographic font-bold px-12 py-6 text-xl tracking-wide hover-lift group">
              <span className="flex items-center gap-3">
                GET STARTED
                <Zap className="w-6 h-6 group-hover:animate-pulse" />
              </span>
            </button>
          </Link>
        </div>
      </section>
    </main>
  </div>
);

export default AboutPage;