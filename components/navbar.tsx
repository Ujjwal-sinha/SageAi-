"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Layers,
  Code,
  BookOpen,
  Users,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  Brain,
  Shield,
  Cpu,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transition } from "@headlessui/react";
import { WalletConnection } from "@/components/WalletConnection";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="particles">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "glass-strong border-b border-cyan-500/20 neon-glow-blue backdrop-blur-3xl" 
          : "glass border-b border-white/5 backdrop-blur-2xl"
      )}>
        {/* Animated border */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-px top-0 animate-web3-flow" />
        
        <div className="container-web3">
          <div className="flex justify-between h-20 items-center">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="relative">
                  {/* Rotating ring */}
                  <div className="absolute inset-0 w-14 h-14 border-2 border-cyan-500/30 rounded-xl animate-spin" />
                  <div className="absolute inset-1 w-12 h-12 border border-purple-500/30 rounded-lg animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
                  
                  {/* Main logo */}
                  <div className="relative w-14 h-14 btn-holographic rounded-xl flex items-center justify-center hover-glow group-hover:neon-glow-cyan transition-all duration-500">
                    <Layers className="h-8 w-8 text-cyan-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  {/* Floating nodes */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-3xl font-display text-holographic group-hover:text-glow transition-all duration-300">
                    Sage AI
                  </span>
                  <span className="text-xs font-cyber text-cyan-400/80 tracking-wider">
                    DECENTRALIZED INTELLIGENCE
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:space-x-2">
              <NavDropdown
                title="Ecosystem"
                icon={<Brain className="w-4 h-4 mr-2 text-cyan-400" />}
                items={[
                  { label: "AI Chatbot", href: "/dashboard", icon: "🤖" },
                  { label: "Smart Contracts", href: "/dashboard", icon: "📜" },
                  { label: "Web3 News AI", href: "/dashboard", icon: "📰" },
                  { label: "About Sage AI", href: "/about", icon: "ℹ️" }
                ]}
              />

              <NavDropdown
                title="AI Tools"
                icon={<Cpu className="w-4 h-4 mr-2 text-purple-400" />}
                items={[
                  { label: "Contract Generator", href: "/dashboard", icon: "⚡" },
                  { label: "Trading Assistant", href: "/dashboard", icon: "📈" },
                  { label: "Ask Crypto Experts", href: "/dashboard", icon: "👥" },
                  { label: "DeFi Analytics", href: "#", icon: "🏦" },
                  { label: "NFT Generator", href: "#", icon: "🎨" },
                ]}
              />

              <NavDropdown
                title="Developers"
                icon={<Code className="w-4 h-4 mr-2 text-green-400" />}
                items={[
                  { label: "Documentation", href: "#", icon: "📚" },
                  { label: "API Reference", href: "#", icon: "🔗" },
                  { label: "SDK & Tools", href: "#", icon: "🛠️" },
                  { label: "GitHub", href: "#", icon: "💻" },
                ]}
              />

              <NavLink href="#" icon={<BookOpen className="w-4 h-4 mr-2 text-yellow-400" />}>
                Learn
              </NavLink>

              <NavDropdown
                title="Community"
                icon={<Users className="w-4 h-4 mr-2 text-pink-400" />}
                items={[
                  { label: "Discord Server", href: "#", icon: "💬" },
                  { label: "Twitter/X", href: "#", icon: "🐦" },
                  { label: "Telegram", href: "#", icon: "📱" },
                  { label: "Ask Experts", href: "/dashboard", icon: "🧠" },
                ]}
              />
            </div>

            {/* Right Side Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <WalletConnection />
              <Link href="/dashboard">
                <Button 
                  variant="default" 
                  size="lg"
                  className="btn-holographic font-bold text-lg px-8 py-3 hover-lift relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    LAUNCH DAPP
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-3">
              <WalletConnection />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="glass border border-cyan-500/30 hover:neon-glow-cyan"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-cyan-400" />
                ) : (
                  <Menu className="h-6 w-6 text-cyan-400" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition duration-300 ease-out"
          enterFrom="transform scale-y-0 opacity-0"
          enterTo="transform scale-y-100 opacity-100"
          leave="transition duration-200 ease-in"
          leaveFrom="transform scale-y-100 opacity-100"
          leaveTo="transform scale-y-0 opacity-0"
        >
          <div className="origin-top lg:hidden glass-strong border-b border-cyan-500/20 neon-glow-purple">
            <div className="px-6 pt-6 pb-8 space-y-4">
              <MobileNavLink href="/dashboard" icon={<Brain className="w-5 h-5 text-cyan-400" />}>
                AI Ecosystem
              </MobileNavLink>
              <MobileNavLink href="/dashboard" icon={<Cpu className="w-5 h-5 text-purple-400" />}>
                AI Tools
              </MobileNavLink>
              <MobileNavLink href="#" icon={<Code className="w-5 h-5 text-green-400" />}>
                Developers
              </MobileNavLink>
              <MobileNavLink href="#" icon={<BookOpen className="w-5 h-5 text-yellow-400" />}>
                Learn
              </MobileNavLink>
              <MobileNavLink href="/dashboard" icon={<Users className="w-5 h-5 text-pink-400" />}>
                Community
              </MobileNavLink>

              <div className="pt-6 border-t border-white/10">
                <Link href="/dashboard">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full btn-holographic font-bold text-lg py-4"
                  >
                    <span className="flex items-center gap-2">
                      LAUNCH DAPP
                      <Zap className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Transition>
      </nav>
    </>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function NavLink({ href, children, icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:glass hover:neon-glow-blue group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {icon && <span className="group-hover:text-cyan-400 transition-colors relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

interface NavDropdownProps {
  title: string;
  items: { label: string; href: string; icon?: string }[];
  icon?: React.ReactNode;
}

function NavDropdown({ title, items, icon }: NavDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:glass hover:neon-glow-purple group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {icon && <span className="group-hover:text-purple-400 transition-colors relative z-10">{icon}</span>}
          <span className="relative z-10">{title}</span>
          <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180 duration-300 relative z-10" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-strong border border-cyan-500/20 neon-glow-purple animate-scale-in min-w-[240px] p-2">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={item.href}
              className="cursor-pointer hover:glass hover:neon-glow-cyan rounded-lg px-4 py-3 transition-all duration-300 hover:text-cyan-400 flex items-center gap-3 group"
            >
              {item.icon && <span className="text-lg group-hover:animate-pulse">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-6 py-4 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:glass transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {icon && <span className="group-hover:text-cyan-400 transition-colors relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}