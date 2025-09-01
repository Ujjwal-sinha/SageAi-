"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, Coins, ExternalLink, Copy, CheckCircle, RefreshCw } from 'lucide-react';
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
      // Replace with your blockchain explorer URL
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
        className="border-blue-500/20 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300"
      >
        {isConnecting ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-green-500/20 hover:bg-green-500/10 text-green-400 hover:text-green-300 min-w-[180px]"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="flex flex-col items-start">
              <span className="text-xs">{shortenAddress(address!)}</span>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span className="text-xs">
                  {loading ? '...' : formatCredits(credits)} UTK
                </span>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-800">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Wallet Connected</span>
            <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-400">
              Active
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Address:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-white font-mono">
                  {shortenAddress(address!)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 hover:bg-gray-800"
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Credits:</span>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-white font-semibold">
                  {loading ? 'Loading...' : `${formatCredits(credits)} UTK`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={refreshCredits}
                  disabled={loading}
                  className="h-6 w-6 p-0 hover:bg-gray-800"
                >
                  <RefreshCw className={`w-3 h-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">
                {error}
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        <DropdownMenuItem onClick={openEtherscan} className="text-gray-300 hover:text-white hover:bg-gray-800">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => window.open('/pricing', '_blank')} 
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <Coins className="w-4 h-4 mr-2" />
          Get More Credits
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        <DropdownMenuItem 
          onClick={disconnectWallet} 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WalletConnection; 