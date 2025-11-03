"use client"

import { ArrowRight, Bot, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gray-900/50">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-black/90"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="cyber-grid"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/20 border border-blue-700/40 text-blue-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to Get Started?
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Transform Your Business with
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Decentralized AI
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the future of blockchain technology with our advanced AI platform. 
            Built for developers, designed for scale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Bot className="w-5 h-5 mr-2" />
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/about">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 font-semibold rounded-lg transition-all duration-200"
              >
                View Documentation
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Shield className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold mb-2">Token-Gated Access</h3>
              <p className="text-sm text-gray-400 text-center">Feature access based on UTK balance</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Zap className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-2">Somnia Testnet</h3>
              <p className="text-sm text-gray-400 text-center">Live integration with Somnia network</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Bot className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-400 text-center">Groq-backed LLM for intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}