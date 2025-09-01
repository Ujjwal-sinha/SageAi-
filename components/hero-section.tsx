/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from '@/lib/motion-mock';
import { ArrowRight, Brain, GitBranch, Database } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle animated gradient border for Web3 feel */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full animate-gradient-x bg-gradient-to-r from-blue-700/20 via-purple-700/20 to-pink-500/20 blur-2xl opacity-60" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-400 text-sm font-medium mb-2 flex items-center gap-2 shadow shadow-purple-500/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Live on BlockDag Testnet
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block font-mono text-white/90 drop-shadow-lg">UNLEASH THE POWER OF</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x font-extrabold tracking-widest" style={{letterSpacing:'0.04em'}}>Blockchain AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
                BlockSynth AI is a native generative AI layer built directly into BlockDag's ecosystem, 
                delivering adaptive, self-optimizing dApps and unprecedented decentralized intelligence.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-6 h-12 text-base shadow-glow-blue border-2 border-blue-500/30 hover:border-purple-500/40 transition-all duration-200">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 rounded-lg px-6 h-12 text-base">
                    View Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            <div className="relative w-full max-w-md">
              {/* 3D Effect using CSS */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <span className="text-lg font-semibold">BlockSynth AI</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative p-4 bg-black/50 rounded-xl border border-gray-800 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="font-mono text-gray-300 text-sm mb-2">{">"} Create a self-optimizing smart contract</p>
                    <p className="font-mono text-xs text-gray-500 ml-4">Generating contract with adaptive gas fee mechanism...</p>
                  </div>
                  <div className="relative p-4 bg-black/50 rounded-xl border border-gray-800 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="font-mono text-gray-300 text-sm mb-2">{">"} Analyze DeFi risk profile for $ETH</p>
                    <p className="font-mono text-xs text-gray-500 ml-4">Computing real-time market volatility metrics...</p>
                  </div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-700/50 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="font-mono text-blue-300 text-sm mb-2">{">"} Generate personalized NFT collection</p>
                    <p className="font-mono text-xs text-blue-500/80 ml-4">Creating unique artwork based on wallet history...</p>
                  </div>
                </div>
                {/* Web3 token badge */}
                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    <GitBranch className="w-4 h-4 mr-1" />
                    <span>TestNet</span>
                    <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center text-sm text-yellow-400 gap-2 bg-yellow-900/10 px-3 py-1 rounded-full border border-yellow-700/20">
                    <Database className="w-4 h-4 mr-1" />
                    <span>UTK Token</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
}