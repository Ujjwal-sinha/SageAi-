"use client"

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PromptExample {
  text: string;
  description: string;
  category: 'smart-contract' | 'defi' | 'trading' | 'development';
}

export function AIPromptShowcase() {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  
  const examples: PromptExample[] = [
    {
      text: "CREATE A SMART CONTRACT FOR A TOKEN NAMED BSAI ON SOMNIA BLOCKCHAIN.",
      description: "Generates a secure ERC-20 token contract with customizable tokenomics",
      category: "smart-contract"
    },
    {
      text: "PROVIDE ME WITH A DAILY CRYPTO MARKET ANALYSIS REPORT.",
      description: "Delivers AI-powered market insights across major cryptocurrencies",
      category: "defi"
    },
    {
      text: "OPTIMIZE MY DEFI LIQUIDITY STRATEGY FOR MAXIMUM YIELD.",
      description: "Analyzes current DeFi protocols and recommends optimal strategies",
      category: "defi" 
    },
    {
      text: "PREDICT BTC PRICE MOVEMENT FOR THE NEXT 24 HOURS.",
      description: "Uses historical data and market sentiment for short-term predictions",
      category: "trading"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-sm font-medium mb-4">
            <Command className="w-4 h-4 mr-1" />
            AI Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Intelligent Commands, <span className="text-blue-400">Powerful Results</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Sage AI understands natural language prompts to deliver complex blockchain operations, analytics, and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 mb-12">
          {examples.map((example, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 ${
                activePrompt === example.text ? 'bg-gray-900/80' : 'bg-gray-900/40'
              } backdrop-blur-sm hover:bg-gray-900/60 border border-gray-800 rounded-xl`}
              onClick={() => setActivePrompt(example.text === activePrompt ? null : example.text)}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-900/50 flex items-center justify-center mr-4">
                      <span className="text-blue-400 text-xs font-mono">&gt;</span>
                    </div>
                    <div>
                      <p className="font-mono text-lg text-white mb-2">{example.text}</p>
                      <p className="text-sm text-gray-400">{example.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 hover:bg-gray-800 hover:text-white text-sm"
                  >
                    Try It
                  </Button>
                </div>
              </div>
              
              {activePrompt === example.text && (
                <div className="px-6 pb-6 pt-1">
                  <div className="mt-2 p-4 bg-black/50 rounded-lg border border-gray-800">
                    <p className="text-sm font-mono text-green-400 mb-1">&gt; Processing command...</p>
                    <p className="text-xs font-mono text-gray-400">Sage AI is analyzing and executing your request.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center mt-12">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl -z-10"></div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Try Sage AI Yourself</h3>
                <div className="flex gap-2">
                  <Input 
                    className="bg-black/50 border-gray-800 focus:border-blue-500" 
                    placeholder="Enter your prompt..." 
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}