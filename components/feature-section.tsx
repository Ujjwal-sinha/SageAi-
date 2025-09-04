"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Sparkles, LineChart, Code, Shield, Zap, Workflow, Network } from 'lucide-react';

export function FeatureSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 8);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="h-12 w-12 text-blue-400" />,
      title: "Self-Optimizing Smart Contracts",
      description: "Contracts that automatically adjust gas fees, security parameters, and execution paths based on network conditions."
    },
    {
      icon: <LineChart className="h-12 w-12 text-purple-400" />,
      title: "Predictive DeFi Analytics",
      description: "Real-time risk modeling, yield optimization strategies, and market trend predictions with high accuracy."
    },
    {
      icon: <Sparkles className="h-12 w-12 text-pink-400" />,
      title: "AI-Generated NFTs",
      description: "Create unique NFT collections based on wallet history, on-chain activity, and personalized preferences."
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-400" />,
      title: "Adaptive Security Protocols",
      description: "AI-powered security systems that identify vulnerabilities and adapt defenses in real-time."
    },
    {
      icon: <Code className="h-12 w-12 text-green-400" />,
      title: "Automatic Code Generation",
      description: "Generate optimized blockchain code from natural language descriptions and requirements."
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-400" />,
      title: "Parallelized AI Processing",
      description: "Leverage Somnia Blockchain's architecture for distributed AI computations with minimal latency."
    },
    {
      icon: <Workflow className="h-12 w-12 text-purple-400" />,
      title: "Governance Optimization",
      description: "AI-assisted proposal evaluation and voting recommendations based on protocol health metrics."
    },
    {
      icon: <Network className="h-12 w-12 text-blue-400" />,
      title: "Cross-Chain Intelligence",
      description: "Seamless analysis and operations across multiple blockchains with unified intelligence layer."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-1" />
            Core Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Next-Generation <span className="text-blue-400">AI Capabilities</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Sage AI brings unprecedented intelligence to blockchain applications through its native integration with Somnia Blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card 
                className={`h-full bg-gray-900/50 backdrop-blur-sm border ${
                  activeIndex === index 
                    ? 'border-blue-500/50 shadow-glow-blue' 
                    : 'border-gray-800 hover:border-gray-700'
                } transition-all duration-300`}
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}