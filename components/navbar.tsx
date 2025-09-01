"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transition } from "@headlessui/react";
import { WalletConnection } from "@/components/WalletConnection";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-gray-800/60 shadow-md shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-purple-400/40 hover:scale-105 transition-transform duration-200">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <span
                onClick={() => router.push("/")}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer select-none"
              >
                BlockSynth AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:space-x-6">
            <NavDropdown
              title="Our Ecosystem"
              icon={<Layers className="w-4 h-4 mr-1" />}
              items={[
                { label: "Web3 AI ChatBot ", href: "/dashboard" },
                { label: "Smart Contract Generator", href: "/dashboard" },
                {label:"AI Web3 News",href:"/dashboard"},
                {label:"BlockSynthAi",href:"/about"}
              ]}
            />

            <NavDropdown
              title="Solutions"
              icon={null}
              items={[
                { label: "Smart Contract Generator", href: "/dashboard" },
                { label: "Web3 AI ChatBot ", href: "/dashboard" },
                { label: "AI Trading Assistant", href: "/dashboard" },
                {label:"Ask Crypto People",href:"/dashboard"},
                {label:"AI Web3 News",href:"/dashboard"},
                { label: "DeFi Analytics", href: "#" },
                { label: "NFT Generation", href: "#" },
              ]}
            />

            <NavDropdown
              title="Developers"
              icon={<Code className="w-4 h-4 mr-1" />}
              items={[
                { label: "Documentation", href: "#" },
                { label: "API", href: "#" },
                { label: "SDK", href: "#" },
              ]}
            />

            <NavLink href="#" icon={<BookOpen className="w-4 h-4 mr-1" />}>
              Learn
            </NavLink>

            <NavDropdown
              title="Community"
              icon={<Users className="w-4 h-4 mr-1" />}
              items={[
                
                { label: "Discord", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "Telegram", href: "#" },
                {label:"Ask Crypto People",href:"/dashboard"},
              ]}
            />

            <NavLink href="#" icon={<Mail className="w-4 h-4 mr-1" />}>
              Contact us
            </NavLink>
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center gap-3">
            <WalletConnection />
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg border border-blue-500/30 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-500/30 transition-all duration-200">
                LAUNCH DAPP
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu with Transition */}
      <Transition
  show={mobileMenuOpen}
  enter="transition duration-200 ease-out"
  enterFrom="transform scale-y-0 opacity-0"
  enterTo="transform scale-y-100 opacity-100"
  leave="transition duration-150 ease-in"
  leaveFrom="transform scale-y-100 opacity-100"
  leaveTo="transform scale-y-0 opacity-0"
>
  <div className="origin-top md:hidden bg-black/95 border-b border-gray-800 shadow-md shadow-purple-500/10">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <MobileNavLink href="#">Our Ecosystem</MobileNavLink>
      <MobileNavLink href="#">Solutions</MobileNavLink>
      <MobileNavLink href="#">Developers</MobileNavLink>
      <MobileNavLink href="#">Learn</MobileNavLink>
      <MobileNavLink href="#">Community</MobileNavLink>
      <MobileNavLink href="#">Contact us</MobileNavLink>

      <div className="pt-2 space-y-2">
        <div className="px-3">
          <WalletConnection />
        </div>
        <Link href="/dashboard">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            LAUNCH DAPP
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
      className={cn(
        "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
        "text-gray-300 hover:text-white hover:bg-gray-800/50 hover:shadow-md hover:shadow-purple-500/20"
      )}
    >
      {icon}
      {children}
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
        <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors duration-200">
          {icon}
          {title}
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 border border-gray-800 shadow-lg shadow-purple-500/10 animate-fade-in">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              href={item.href}
              className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors duration-150"
    >
      {children}
    </Link>
  );
}
