"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, LineChart, Code, Shield, Zap, Workflow, Network, ArrowRight, TrendingUp } from 'lucide-react';
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
      title: "Self-Optimizing Smart Contracts",
      description: "Contracts that automatically adjust gas fees, security parameters, and execution paths based on real-time network conditions and market dynamics.",
      color: "text-blue-400",
      gradient: "from-blue-600/20 to-cyan-600/20",
      stats: "99.7% Gas Efficiency"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Predictive DeFi Analytics",
      description: "Real-time risk modeling, yield optimization strategies, and market trend predictions powered by advanced machine learning algorithms.",
      color: "text-purple-400",
      gradient: "from-purple-600/20 to-pink-600/20",
      stats: "85% Accuracy Rate"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI-Generated NFTs",
      description: "Create unique NFT collections based on wallet history, on-chain activity, and personalized preferences with automated rarity distribution.",
      color: "text-pink-400",
      gradient: "from-pink-600/20 to-rose-600/20",
      stats: "10K+ NFTs Created"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Adaptive Security Protocols",
      description: "AI-powered security systems that identify vulnerabilities, monitor suspicious activities, and adapt defenses in real-time across all contracts.",
      color: "text-emerald-400",
      gradient: "from-emerald-600/20 to-teal-600/20",
      stats: "Zero Exploits"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Automatic Code Generation",
      description: "Generate optimized, audited blockchain code from natural language descriptions with automated testing and security verification.",
      color: "text-green-400",
      gradient: "from-green-600/20 to-emerald-600/20",
      stats: "50K+ Lines Generated"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Parallelized AI Processing",
      description: "Leverage Somnia Blockchain's high-performance architecture for distributed AI computations with sub-second latency and infinite scalability.",
      color: "text-yellow-400",
      gradient: "from-yellow-600/20 to-orange-600/20",
      stats: "400K TPS"
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Governance Optimization",
      description: "AI-assisted proposal evaluation, voting pattern analysis, and governance recommendations based on protocol health and community sentiment.",
      color: "text-violet-400",
      gradient: "from-violet-600/20 to-purple-600/20",
      stats: "95% Participation"
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Cross-Chain Intelligence",
      description: "Seamless analysis and operations across multiple blockchains with unified intelligence layer and automated arbitrage opportunities.",
      color: "text-cyan-400",
      gradient: "from-cyan-600/20 to-blue-600/20",
      stats: "15+ Chains"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Enhanced background with Web3 patterns */}
      <div className="absolute inset-0 -z-20">
        <div className="web3-grid opacity-20" />
        <div className="blockchain-pattern opacity-10" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full gradient-shift opacity-20 blur-3xl" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl float -z-10" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl float-delayed -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-accent/30 text-accent text-sm font-medium mb-8 hover-lift shadow-glow-cyan">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono">ADVANCED CAPABILITIES</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Next-Generation</span>
            <br />
            <span className="gradient-text text-glow">AI-Powered Web3</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
            Sage AI brings unprecedented intelligence to blockchain applications through its 
            native integration with Somnia Blockchain's high-performance infrastructure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card 
                className={`group h-full relative overflow-hidden glass-strong border-2 transition-all duration-500 hover-lift cursor-pointer ${
                  activeIndex === index || hoveredCard === index
                    ? 'border-accent/50 shadow-glow-blue' 
                    : 'border-border/20 hover:border-accent/30'
                }`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 w-0 group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100" />
                
                <CardHeader className="relative pb-4">
                  <div className={`p-3 glass rounded-xl border border-white/10 group-hover:shadow-glow-blue transition-all duration-300 ${feature.color} mb-4 w-fit`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-glow transition-all duration-300 mb-2">
                    {feature.title}
                  </CardTitle>
                  <div className="text-xs font-mono text-accent opacity-75">
                    {feature.stats}
                  </div>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span className="font-mono">EXPERIENCE THE POWER</span>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to harness the full potential of decentralized AI? 
            Explore all features in our interactive dashboard.
          </p>
          <Link href="/dashboard">
            <Button 
              variant="default" 
              size="lg"
              className="text-xl font-bold"
            >
              Explore All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}