/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, GitBranch, Database, Sparkles, Zap, Shield, Code2, Cpu, Network } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const demoStates = [
    {
      title: "CREATE ADAPTIVE SMART CONTRACT",
      status: "Generating self-optimizing contract with dynamic gas management...",
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      gradient: "from-cyan-600/20 to-blue-600/20",
      accent: "cyan"
    },
    {
      title: "ANALYZE DEFI RISK MATRIX",
      status: "Computing multi-dimensional risk vectors across protocols...",
      icon: <Shield className="w-5 h-5 text-green-400" />,
      gradient: "from-green-600/20 to-emerald-600/20",
      accent: "green"
    },
    {
      title: "GENERATE NEURAL NFT COLLECTION",
      status: "Creating unique artwork using blockchain-trained models...",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      gradient: "from-purple-600/20 to-pink-600/20",
      accent: "purple"
    },
    {
      title: "OPTIMIZE CROSS-CHAIN BRIDGE",
      status: "Calculating optimal routing through 15+ blockchain networks...",
      icon: <Network className="w-5 h-5 text-yellow-400" />,
      gradient: "from-yellow-600/20 to-orange-600/20",
      accent: "yellow"
    }
  ];
  
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Dynamic background with mouse interaction */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 212, 255, 0.15), transparent 40%)`
        }}
      />
      
      {/* Enhanced background layers */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-20" />
        <div className="hex-pattern opacity-15" />
        <div className="circuit-pattern opacity-10" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full cyber-gradient opacity-20 blur-3xl" />
      </div>
      
      {/* Floating blockchain nodes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
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
        
        {/* Connection lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={`line-${i}`}
            className="connection-line"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 200 + 100}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
          {/* Left Column - Enhanced Content */}
          <div className={`space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            {/* Status Badge */}
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full glass-strong border border-cyan-500/30 text-cyan-400 text-sm font-medium hover-lift neon-glow-cyan group">
              <div className="status-online w-3 h-3 rounded-full" />
              <span className="font-cyber tracking-wider">LIVE ON SOMNIA TESTNET</span>
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-tight">
                <span className="block text-white font-black mb-2 hover-neon">UNLEASH THE</span>
                <span className="block text-holographic font-black tracking-wide text-glow">
                  FUTURE OF
                </span>
                <span className="block text-cyber font-black tracking-wide pulse-neon">
                  WEB3 AI
                </span>
              </h1>
            </div>
            
            {/* Enhanced Description */}
            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Experience the next evolution of <span className="text-cyan-400 font-semibold">decentralized intelligence</span> with 
                <span className="text-holographic font-bold"> Sage AI</span> - 
                a native AI layer seamlessly integrated into Somnia Blockchain's ecosystem.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 rounded-full glass border border-cyan-500/30 text-cyan-400 text-sm font-cyber">
                  SELF-OPTIMIZING
                </span>
                <span className="px-4 py-2 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-cyber">
                  ULTRA SECURE
                </span>
                <span className="px-4 py-2 rounded-full glass border border-green-500/30 text-green-400 text-sm font-cyber">
                  LIGHTNING FAST
                </span>
              </div>
            </div>
            
            {/* Feature highlights grid */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 hover-lift group">
                <Brain className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                <span className="text-sm font-medium">Neural Networks</span>
              </div>
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 hover-lift group">
                <Shield className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
                <span className="text-sm font-medium">Quantum Security</span>
              </div>
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 hover-lift group">
                <Zap className="w-6 h-6 text-yellow-400 group-hover:animate-pulse" />
                <span className="text-sm font-medium">Instant Processing</span>
              </div>
              <div className="flex items-center gap-4 glass-card rounded-xl p-4 hover-lift group">
                <Cpu className="w-6 h-6 text-purple-400 group-hover:animate-pulse" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-6 pt-8">
              <Link href="/dashboard">
                <Button 
                  variant="default" 
                  size="xl"
                  className="btn-holographic text-xl font-bold px-10 py-6 hover-lift group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Launch DAPP
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="text-xl px-10 py-6 btn-cyber hover-lift group"
                >
                  <span className="flex items-center gap-3">
                    Explore Features
                    <Brain className="w-6 h-6 group-hover:animate-pulse" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-gray-400">400K+ TPS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-400">15+ Chains</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-gray-400">Zero Downtime</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Enhanced Interactive Demo */}
          <div className={`flex justify-center xl:justify-end transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            <div className="relative w-full max-w-lg">
              {/* Multiple glow layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur-3xl scale-110 opacity-75 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-3xl blur-2xl scale-105 opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Terminal Window */}
              <div className="relative glass-strong rounded-3xl p-8 neon-glow-purple hover:neon-glow-cyan transition-all duration-500 hover-lift border-2 border-cyan-500/20 group">
                {/* Terminal Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display text-holographic group-hover:text-glow">Sage AI Terminal</h3>
                      <p className="text-xs text-cyan-400/80 font-cyber tracking-wider">v3.0.1-quantum</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="space-y-4">
                  {demoStates.map((demo, index) => (
                    <div 
                      key={index}
                      className={`relative p-6 rounded-2xl border transition-all duration-700 hover-lift ${
                        activeDemo === index 
                          ? 'glass-strong border-cyan-500/50 neon-glow-cyan' 
                          : 'glass border-white/10'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${demo.gradient} opacity-0 hover:opacity-100 transition-opacity rounded-2xl`} />
                      <div className="relative space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-400 font-cyber text-lg">{">"}</span>
                          <div className="p-2 glass rounded-lg border border-cyan-500/30">
                            {demo.icon}
                          </div>
                          <p className="font-cyber text-white text-sm font-bold tracking-wide">{demo.title}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-8">
                          <div className={`w-3 h-3 rounded-full ${
                            activeDemo === index 
                              ? `bg-${demo.accent}-400 animate-pulse` 
                              : 'bg-gray-500/50'
                          }`} />
                          <p className="font-cyber text-xs text-gray-300 tracking-wide">{demo.status}</p>
                        </div>
                        
                        {/* Progress bar */}
                        {activeDemo === index && (
                          <div className="ml-8 mt-3">
                            <div className="w-full bg-gray-800 rounded-full h-1">
                              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1 rounded-full animate-pulse" style={{ width: '75%' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Status Bar */}
                <div className="mt-8 pt-6 border-t border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <GitBranch className="w-5 h-5 text-cyan-400" />
                      <span className="font-cyber tracking-wide">TESTNET</span>
                      <div className="status-online w-3 h-3 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Cpu className="w-4 h-4" />
                      <span>Neural Processing: ACTIVE</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 glass-card rounded-full px-4 py-2 border border-cyan-500/30 hover-glow">
                    <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-sm font-cyber text-cyan-400 tracking-wider">UTK</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-cyan-500/20 rounded-full blur-sm float" />
              <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-purple-500/20 rounded-full blur-sm float-delayed" />
              <div className="absolute top-1/2 -right-4 w-6 h-6 bg-green-500/20 rounded-full blur-sm float-slow" />
            </div>
          </div>
        </div>
        
        {/* Bottom scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-gray-400 font-cyber tracking-wider">SCROLL TO EXPLORE</span>
            <div className="w-px h-8 bg-gradient-to-b from-cyan-400 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}