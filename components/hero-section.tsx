/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from '@/lib/motion-mock';
import { ArrowRight, Brain, GitBranch, Database, Sparkles, Zap, Shield, Code2 } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through demo states
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const demoStates = [
    {
      title: "Create a self-optimizing smart contract",
      status: "Generating contract with adaptive gas fee mechanism...",
      icon: <Code2 className="w-4 h-4" />,
      gradient: "from-blue-600/10 to-purple-600/10"
    },
    {
      title: "Analyze DeFi risk profile for $ETH",
      status: "Computing real-time market volatility metrics...",
      icon: <Shield className="w-4 h-4" />,
      gradient: "from-emerald-600/10 to-cyan-600/10"
    },
    {
      title: "Generate personalized NFT collection",
      status: "Creating unique artwork based on wallet history...",
      icon: <Sparkles className="w-4 h-4" />,
      gradient: "from-purple-600/10 to-pink-600/10"
    }
  ];
  
  return (
    <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Enhanced background with Web3 patterns */}
      <div className="absolute inset-0 -z-20">
        <div className="web3-grid opacity-30" />
        <div className="blockchain-pattern opacity-20" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full gradient-shift opacity-30 blur-3xl" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl float -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl float-delayed -z-10" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl float -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-emerald-500/30 text-emerald-400 text-sm font-medium hover-lift shadow-glow-cyan">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse pulse-slow" />
              <span className="font-mono">LIVE ON SOMNIA TESTNET</span>
              <Zap className="w-4 h-4" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
                <span className="block text-foreground font-mono mb-2">UNLEASH THE</span>
                <span className="block gradient-text text-glow font-black tracking-wide">
                  FUTURE OF
                </span>
                <span className="block gradient-text text-glow font-black tracking-wide">
                  WEB3 AI
                </span>
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Experience the next evolution of decentralized intelligence with <span className="text-accent font-semibold">Sage AI</span> - 
              a native AI layer seamlessly integrated into Somnia Blockchain's ecosystem.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex items-center gap-3 glass rounded-lg p-3 hover-lift">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Self-Optimizing</span>
              </div>
              <div className="flex items-center gap-3 glass rounded-lg p-3 hover-lift">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Ultra Secure</span>
              </div>
              <div className="flex items-center gap-3 glass rounded-lg p-3 hover-lift">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-3 glass rounded-lg p-3 hover-lift">
                <Code2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/dashboard">
                <Button 
                  variant="default" 
                  size="lg"
                  
                  className="text-lg font-semibold"
                >
                  Launch dApp
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="lg"
              
                  className="text-lg"
                >
                  Explore Features
                  <Brain className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Interactive Demo */}
          <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind terminal */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl scale-110 opacity-75" />
              
              {/* Terminal Window */}
              <div className="relative glass-strong rounded-2xl p-8 shadow-glow-blue hover:shadow-glow-purple transition-all duration-500 hover-lift border-2 border-accent/20">
                {/* Terminal Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <Brain className="w-7 h-7 text-accent" />
                    <div>
                      <h3 className="text-xl font-bold gradient-text">Sage AI Terminal</h3>
                      <p className="text-xs text-muted-foreground font-mono">v2.0.1-beta</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="space-y-4">
                  {demoStates.map((demo, index) => (
                    <div 
                      key={index}
                      className={`relative p-4 rounded-xl border transition-all duration-500 hover-lift ${
                        activeDemo === index 
                          ? 'glass-strong border-accent/50 shadow-glow-blue' 
                          : 'glass border-border/30'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${demo.gradient} opacity-0 hover:opacity-100 transition-opacity rounded-xl`} />
                      <div className="relative space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-accent font-mono text-sm">{">"}</span>
                          {demo.icon}
                          <p className="font-mono text-foreground text-sm font-medium">{demo.title}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <div className={`w-2 h-2 rounded-full ${activeDemo === index ? 'bg-accent animate-pulse' : 'bg-muted-foreground/50'}`} />
                          <p className="font-mono text-xs text-muted-foreground">{demo.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Status Bar */}
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GitBranch className="w-4 h-4" />
                      <span className="font-mono">testnet</span>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-accent/30">
                    <Database className="w-4 h-4 text-accent" />
                    <span className="text-sm font-mono text-accent">UTK</span>
                  </div>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm float" />
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-purple-500/20 rounded-full blur-sm float-delayed" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}