"use client"

import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-700/30 text-blue-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started Today
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Blockchain Projects?
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers and businesses already leveraging the power of Sage AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-glow-blue">
                <Bot className="w-5 h-5 mr-2" />
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 border-gray-700 hover:bg-gray-800"
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-pink-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}