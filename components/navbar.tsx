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
import { useRouter } from "next/navigation";
import {
  Layers,
  Code,
  BookOpen,
  Users,
  Mail,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transition } from "@headlessui/react";
import { WalletConnection } from "@/components/WalletConnection";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "glass-strong border-b border-accent/20 shadow-glow-blue backdrop-blur-3xl" 
        : "glass border-b border-white/5 backdrop-blur-2xl"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 btn-web3 rounded-xl flex items-center justify-center shadow-glow-blue hover:shadow-glow-purple group-hover:scale-110 transition-all duration-300">
                  <Layers className="h-7 w-7 text-white relative z-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black gradient-text tracking-tight group-hover:text-glow transition-all duration-300">
                  Sage AI
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Web3 Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:space-x-1">
            <NavDropdown
              title="Ecosystem"
              icon={<Sparkles className="w-4 h-4 mr-2" />}
              items={[
                { label: "Web3 AI ChatBot", href: "/dashboard" },
                { label: "Smart Contract Generator", href: "/dashboard" },
                { label: "AI Web3 News", href: "/dashboard" },
                { label: "About Sage AI", href: "/about" }
              ]}
            />

            <NavDropdown
              title="Solutions"
              icon={<Zap className="w-4 h-4 mr-2" />}
              items={[
                { label: "Smart Contract Generator", href: "/dashboard" },
                { label: "Web3 AI ChatBot", href: "/dashboard" },
                { label: "AI Trading Assistant", href: "/dashboard" },
                { label: "Ask Crypto People", href: "/dashboard" },
                { label: "AI Web3 News", href: "/dashboard" },
                { label: "DeFi Analytics", href: "#" },
                { label: "NFT Generation", href: "#" },
              ]}
            />

            <NavDropdown
              title="Developers"
              icon={<Code className="w-4 h-4 mr-2" />}
              items={[
                { label: "Documentation", href: "#" },
                { label: "API Reference", href: "#" },
                { label: "SDK & Tools", href: "#" },
              ]}
            />

            <NavLink href="#" icon={<BookOpen className="w-4 h-4 mr-2" />}>
              Learn
            </NavLink>

            <NavDropdown
              title="Community"
              icon={<Users className="w-4 h-4 mr-2" />}
              items={[
                { label: "Discord Server", href: "#" },
                { label: "Twitter/X", href: "#" },
                { label: "Telegram", href: "#" },
                { label: "Ask Crypto People", href: "/dashboard" },
              ]}
            />
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center gap-4">
            <WalletConnection />
            <Link href="/dashboard">
              <Button 
                variant="default" 
                size="lg"
               
                className="font-bold"
              >
                LAUNCH DAPP
                <Zap className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <WalletConnection />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="glass border border-white/10"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu with enhanced styling */}
      <Transition
        show={mobileMenuOpen}
        enter="transition duration-300 ease-out"
        enterFrom="transform scale-y-0 opacity-0"
        enterTo="transform scale-y-100 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform scale-y-100 opacity-100"
        leaveTo="transform scale-y-0 opacity-0"
      >
        <div className="origin-top md:hidden glass-strong border-b border-accent/20 shadow-glow-purple">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <MobileNavLink href="/dashboard" icon={<Sparkles className="w-4 h-4" />}>
              Our Ecosystem
            </MobileNavLink>
            <MobileNavLink href="/dashboard" icon={<Zap className="w-4 h-4" />}>
              Solutions
            </MobileNavLink>
            <MobileNavLink href="#" icon={<Code className="w-4 h-4" />}>
              Developers
            </MobileNavLink>
            <MobileNavLink href="#" icon={<BookOpen className="w-4 h-4" />}>
              Learn
            </MobileNavLink>
            <MobileNavLink href="/dashboard" icon={<Users className="w-4 h-4" />}>
              Community
            </MobileNavLink>

            <div className="pt-4 border-t border-white/10">
              <Link href="/dashboard">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full font-bold"
                  
                >
                  LAUNCH DAPP
                  <Zap className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
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
      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-all duration-300 hover:bg-accent/10 hover:shadow-glow-blue group"
    >
      {icon && <span className="group-hover:text-accent transition-colors">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}

interface NavDropdownProps {
  title: string;
  items: { label: string; href: string }[];
  icon?: React.ReactNode;
}

function NavDropdown({ title, items, icon }: NavDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl transition-all duration-300 hover:bg-accent/10 hover:shadow-glow-blue group">
          {icon && <span className="group-hover:text-accent transition-colors">{icon}</span>}
          <span>{title}</span>
          <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-strong border border-accent/20 shadow-glow-purple animate-scale-in min-w-[200px]">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={item.href}
              className="cursor-pointer hover:bg-accent/10 focus:bg-accent/10 rounded-lg px-3 py-2 transition-all duration-200 hover:text-accent"
            >
              {item.label}
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
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-300 group"
    >
      {icon && <span className="group-hover:text-accent transition-colors">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}
