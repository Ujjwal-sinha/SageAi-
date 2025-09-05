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
    <footer className="relative bg-gray-900 border-t border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Sage AI
              </span>
            </Link>
            
            <p className="text-gray-400 leading-relaxed text-sm">
              Revolutionizing decentralized intelligence with advanced AI capabilities 
              built on the Somnia Blockchain ecosystem.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Platform
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Features</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Technology</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">API</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Developers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Tutorials</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Community</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Whitepaper</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4 text-sm">Get the latest updates and insights delivered to your inbox.</p>
            <div className="space-y-3">
              <Input 
                className="bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-400 text-sm" 
                placeholder="Enter your email" 
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Sage AI. All rights reserved. Powered by Somnia Blockchain.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms of Service</Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}