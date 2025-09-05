"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, Coins, ExternalLink, Copy, CheckCircle, RefreshCw, Zap, Shield } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';

export function WalletConnection() {
  const { isConnected, address, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { credits, loading, error, refreshCredits, formatCredits } = useCredits();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEtherscan = () => {
    if (address) {
      const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://primordial.bdagscan.com';
      window.open(`${explorerUrl}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        variant="outline"
        className="btn-cyber hover-lift font-cyber tracking-wider"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            CONNECTING...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            CONNECT WALLET
          </span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="glass-card border-cyan-500/30 hover:neon-glow-cyan text-cyan-400 hover:text-white min-w-[200px] hover-lift group"
        >
          <div className="flex items-center gap-3">
            <div className="status-online w-3 h-3 rounded-full" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-cyber tracking-wider">{shortenAddress(address!)}</span>
              <div className="flex items-center gap-2">
                <Coins className="w-3 h-3" />
                <span className="text-xs font-cyber">
                  {loading ? (
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    `${formatCredits(credits)} UTK`
                  )}
                </span>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 glass-strong border border-cyan-500/20 neon-glow-purple p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-display text-white">Wallet Status</span>
            <Badge className="glass border border-green-500/30 bg-green-500/10 text-green-400 font-cyber">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              CONNECTED
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-xs text-gray-400 font-cyber">ADDRESS:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white font-cyber">
                  {shortenAddress(address!)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 hover:neon-glow-cyan"
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 glass rounded-lg">
              <span className="text-xs text-gray-400 font-cyber">CREDITS:</span>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-xs text-white font-cyber font-bold">
                  {loading ? 'LOADING...' : `${formatCredits(credits)} UTK`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={refreshCredits}
                  disabled={loading}
                  className="h-6 w-6 p-0 hover:neon-glow-cyan"
                >
                  <RefreshCw className={`w-3 h-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-cyber">
                {error}
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-cyan-500/20 my-4" />
        
        <DropdownMenuItem onClick={openEtherscan} className="text-gray-300 hover:text-white hover:glass rounded-lg p-3 font-cyber">
          <ExternalLink className="w-4 h-4 mr-3" />
          VIEW ON EXPLORER
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => window.open('/pricing', '_blank')} 
          className="text-gray-300 hover:text-cyan-400 hover:glass rounded-lg p-3 font-cyber"
        >
          <Coins className="w-4 h-4 mr-3" />
          GET MORE CREDITS
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-cyan-500/20 my-4" />
        
        <DropdownMenuItem 
          onClick={disconnectWallet} 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg p-3 font-cyber"
        >
          <Wallet className="w-4 h-4 mr-3" />
          DISCONNECT WALLET
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WalletConnection;