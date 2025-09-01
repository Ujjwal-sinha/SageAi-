"use client";

import Link from "next/link";
import React from "react";
import { FaBolt, FaExpandArrowsAlt, FaCogs, FaShieldAlt } from "react-icons/fa";


// Reusable icon wrapper
const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-purple-400 text-4xl mb-3">{children}</span>
);

// Hero section
const HeroSection: React.FC = () => (
  <section className="text-center mb-20 pt-8">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-purple-800 bg-clip-text text-transparent mb-4 drop-shadow-lg">BlockSynth AI</h1>
    <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed mb-4">
      The next generation of decentralized AI for Web3. Empowering developers and users with blockchain-backed intelligence for smart contracts, DeFi, NFTs, and more.
    </p>
    <Link href="/dashboard">
      <button
        aria-label="Get started with BlockSynth AI"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-glow-purple text-lg mt-4 transition-all"
      >
        Get Started
      </button>
    </Link>
  </section>
);

// Feature card UI
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="flex flex-col items-center bg-white/10 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 text-white backdrop-blur">
    <Icon>{icon}</Icon>
    <h3 className="text-xl font-semibold text-purple-300 mt-2 mb-1">{title}</h3>
    <p className="text-sm text-center text-gray-200">{description}</p>
  </div>
);

// Benefit cards grid
const BenefitsList: React.FC = () => (
  <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 px-4">
    <FeatureCard
      icon={<FaBolt />}
      title="Faster Transactions"
      description="Access AI services quickly with parallel processing through BlockDAG."
    />
    <FeatureCard
      icon={<FaExpandArrowsAlt />}
      title="Enhanced Scalability"
      description="Handles increasing users and AI operations without lag."
    />
    <FeatureCard
      icon={<FaCogs />}
      title="Increased Efficiency"
      description="Optimized system resources for smooth, cost-effective AI."
    />
    <FeatureCard
      icon={<FaShieldAlt />}
      title="Future-Proof Infrastructure"
      description="A scalable, secure backbone ready for next-gen AI."
    />
  </section>
);

// Full screen layout with scrollable main content
const AboutPage: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
    <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-12">
      <HeroSection />

      <section className="max-w-4xl mx-auto mb-16 space-y-12 bg-gradient-to-br from-[#1a1a2a] to-[#181825] rounded-2xl shadow-xl p-8 border border-purple-900/40">
        <div>
          <h2 className="text-3xl font-bold text-purple-400 mb-3">Our Vision</h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            BlockSynth AI pioneers decentralized AI by giving users cutting-edge tools for the Web3 ecosystem. Our vision: empower developers and users with blockchain-backed AI for smart contract insights, market predictions, NFT creation, and DeFi intelligence — all with scalability, efficiency, and transparency at its core.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-purple-400 mb-3">What is BlockDAG?</h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            BlockDAG (Directed Acyclic Graph) is a modern distributed ledger that allows multiple blocks to be added simultaneously. Unlike linear blockchains, it supports parallel transaction processing — meaning higher throughput and faster confirmations.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-purple-400 mb-3">Why BlockDAG for BlockSynth AI?</h2>
          <p className="text-gray-200 leading-relaxed text-lg">
            BlockDAG is ideal for decentralized AI — it’s scalable, fast, and efficient. It allows our AI models to run under high loads without compromising speed or accuracy, enabling seamless integration of advanced features and future-proof infrastructure.
          </p>
        </div>
      </section>

      <BenefitsList />

      <section className="max-w-2xl mx-auto text-center mb-16 px-4 bg-gradient-to-br from-[#1a1a2a] to-[#181825] rounded-2xl shadow-lg p-8 border border-purple-900/40">
        <h2 className="text-3xl font-bold text-purple-400 mb-4">Our Future Goals</h2>
        <p className="text-gray-200 leading-relaxed text-lg">
          Our roadmap includes developing specialized AI models tailored for Web3, integrating across more chains, and building a strong developer community. We aim to be the leading platform where decentralized AI thrives.
        </p>
      </section>

      <section className="max-w-xl mx-auto text-center mt-10">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">Join the Decentralized AI Revolution</h2>
        <p className="text-gray-300 mb-6 text-lg">
          Start your journey with BlockSynth AI and harness the power of scalable, decentralized intelligence.
        </p>
        <Link href="/dashboard">
          <button
            aria-label="Get started with BlockSynth AI"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-glow-purple text-lg transition-all"
          >
            Get Started
          </button>
        </Link>
      </section>
    </main>
  </div>
);

export default AboutPage;
