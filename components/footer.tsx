/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Send, 
  Globe,
  Layers,
  Brain,
  Zap,
  Shield,
  Cpu
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-10" />
        <div className="hex-pattern opacity-5" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="web3-gradient opacity-10 blur-3xl" />
      </div>
      
      <div className="glass-strong border-t border-cyan-500/20">
        <div className="container-web3 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Enhanced Logo and description */}
            <div className="md:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="w-12 h-12 glass-strong rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:neon-glow-cyan transition-all">
                    <Layers className="h-7 w-7 text-cyan-400 group-hover:animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-2xl font-display text-holographic group-hover:text-glow">
                  Sage AI
                </span>
              </Link>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                A native generative AI layer built directly into Somnia Blockchain's ecosystem to 
                revolutionize decentralized intelligence with adaptive, self-learning capabilities.
              </p>
              
              {/* Enhanced social links */}
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="glass border border-cyan-500/30 hover:neon-glow-cyan text-gray-400 hover:text-cyan-400">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass border border-purple-500/30 hover:neon-glow-purple text-gray-400 hover:text-purple-400">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass border border-green-500/30 hover:neon-glow-cyan text-gray-400 hover:text-green-400">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="glass border border-yellow-500/30 hover:neon-glow-cyan text-gray-400 hover:text-yellow-400">
                  <Globe className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Enhanced Navigation */}
            <div>
              <h3 className="text-lg font-display mb-6 text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Platform
              </h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-cyber text-sm tracking-wide">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-cyber text-sm tracking-wide">Technology</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors font-cyber text-sm tracking-wide">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-cyber text-sm tracking-wide">API</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-cyber text-sm tracking-wide">Developers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-display mb-6 text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Resources
              </h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors font-cyber text-sm tracking-wide">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors font-cyber text-sm tracking-wide">Tutorials</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors font-cyber text-sm tracking-wide">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors font-cyber text-sm tracking-wide">Community</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors font-cyber text-sm tracking-wide">Whitepaper</Link></li>
              </ul>
            </div>
            
            {/* Enhanced Newsletter */}
            <div>
              <h3 className="text-lg font-display mb-6 text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                Stay Updated
              </h3>
              <p className="text-gray-400 mb-6 text-sm font-cyber">Subscribe to our newsletter for the latest updates and features.</p>
              <div className="flex gap-3">
                <Input 
                  className="glass border-cyan-500/30 focus:border-cyan-500 font-cyber text-sm" 
                  placeholder="your@email.com" 
                />
                <Button className="btn-holographic hover-lift">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Enhanced bottom section */}
          <div className="border-t border-cyan-500/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-cyber tracking-wide">
              &copy; {new Date().getFullYear()} Sage AI. All rights reserved. Powered by Somnia Blockchain.
            </p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm font-cyber tracking-wide transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm font-cyber tracking-wide transition-colors">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm font-cyber tracking-wide transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}