"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, LineChart, Code, Shield, Zap, Workflow, Network, ArrowRight, TrendingUp, Cpu, Database, Lock, Layers } from 'lucide-react';
import Link from 'next/link';

export function FeatureSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 8);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Neural Smart Contracts",
      description: "Self-evolving contracts that adapt gas fees, security parameters, and execution paths using advanced machine learning algorithms trained on blockchain data.",
      color: "text-cyan-400",
      gradient: "from-cyan-600/20 to-blue-600/20",
      stats: "99.9% Efficiency",
      category: "AI CORE"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Quantum DeFi Analytics",
      description: "Real-time multi-dimensional risk modeling, yield optimization strategies, and market predictions powered by quantum-inspired algorithms.",
      color: "text-purple-400",
      gradient: "from-purple-600/20 to-pink-600/20",
      stats: "95% Accuracy",
      category: "ANALYTICS"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Generative NFT Engine",
      description: "Create unique NFT collections based on wallet history, on-chain behavior, and personalized preferences with automated rarity distribution.",
      color: "text-pink-400",
      gradient: "from-pink-600/20 to-rose-600/20",
      stats: "50K+ Created",
      category: "CREATIVE"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Adaptive Security Matrix",
      description: "AI-powered security systems that identify vulnerabilities, monitor threats, and adapt defenses in real-time across all smart contracts.",
      color: "text-green-400",
      gradient: "from-green-600/20 to-emerald-600/20",
      stats: "Zero Exploits",
      category: "SECURITY"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Autonomous Code Generation",
      description: "Generate optimized, audited blockchain code from natural language with automated testing, security verification, and deployment.",
      color: "text-emerald-400",
      gradient: "from-emerald-600/20 to-teal-600/20",
      stats: "100K+ Lines",
      category: "DEVELOPMENT"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Parallel AI Processing",
      description: "Leverage Somnia's high-performance architecture for distributed AI computations with sub-millisecond latency and infinite scalability.",
      color: "text-yellow-400",
      gradient: "from-yellow-600/20 to-orange-600/20",
      stats: "400K TPS",
      category: "PERFORMANCE"
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Governance Intelligence",
      description: "AI-assisted proposal evaluation, voting pattern analysis, and governance recommendations based on protocol health metrics.",
      color: "text-violet-400",
      gradient: "from-violet-600/20 to-purple-600/20",
      stats: "98% Participation",
      category: "GOVERNANCE"
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Omnichain Intelligence",
      description: "Seamless analysis and operations across 15+ blockchains with unified intelligence layer and automated arbitrage opportunities.",
      color: "text-cyan-400",
      gradient: "from-cyan-600/20 to-blue-600/20",
      stats: "15+ Chains",
      category: "INTEROP"
    }
  ];

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-15" />
        <div className="hex-pattern opacity-10" />
        <div className="circuit-pattern opacity-5" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full web3-gradient opacity-15 blur-3xl" />
      </div>
      
      {/* Floating blockchain nodes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
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
      
      <div className="container-web3">
        {/* Enhanced Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-strong border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8 hover-lift neon-glow-cyan group">
            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
            <span className="font-cyber tracking-wider">ADVANCED CAPABILITIES</span>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display tracking-tight mb-8">
            <span className="text-white block mb-2">Next-Generation</span>
            <span className="text-holographic text-glow block">AI-Powered Web3</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl leading-relaxed">
            Sage AI brings unprecedented intelligence to blockchain applications through its 
            native integration with <span className="text-cyan-400 font-semibold">Somnia Blockchain's</span> high-performance infrastructure.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="web3-grid mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={`group h-full relative overflow-hidden glass-card border-2 transition-all duration-500 hover-lift cursor-pointer ${
                  activeIndex === index || hoveredCard === index
                    ? 'border-cyan-500/50 neon-glow-cyan' 
                    : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Holographic shimmer effect */}
                <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                
                <CardHeader className="relative pb-4">
                  {/* Category badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full glass border border-cyan-500/30 text-xs font-cyber text-cyan-400 tracking-wider">
                    {feature.category}
                  </div>
                  
                  <div className={`p-4 glass-strong rounded-2xl border border-white/20 group-hover:neon-glow-cyan transition-all duration-300 ${feature.color} mb-6 w-fit relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-white group-hover:text-glow transition-all duration-300 mb-3">
                    {feature.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs font-cyber text-cyan-400 tracking-wider">
                      {feature.stats}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Hover action */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-white font-cyber">
                      EXPLORE <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Enhanced Bottom CTA */}
        <div className="text-center relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          
          <div className="relative glass-strong rounded-3xl p-12 border border-cyan-500/20 hover-lift">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8">
              <Zap className="w-5 h-5 animate-pulse" />
              <span className="font-cyber tracking-wider">EXPERIENCE THE POWER</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-display mb-6 text-white">
              Ready to Transform Your
              <span className="block mt-2 text-holographic text-glow">
                Blockchain Projects?
              </span>
            </h3>
            
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of developers and businesses already leveraging the power of 
              <span className="text-cyan-400 font-semibold"> decentralized AI</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/dashboard">
                <Button 
                  variant="default" 
                  size="xl"
                  className="btn-holographic text-xl font-bold px-12 py-6 hover-lift group"
                >
                  <span className="flex items-center gap-3">
                    Explore All Features
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="xl"
                className="text-xl px-12 py-6 btn-cyber hover-lift"
              >
                <span className="flex items-center gap-3">
                  View Documentation
                  
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}