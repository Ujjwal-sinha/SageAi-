'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bitcoin, Network, DollarSign, ChevronRight, MessageSquare, Bot, Users, FileCode, TrendingUp, Gift, LogOut, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCredits } from '@/hooks/useCredits';
import { UTILITY_TOKEN_ADDRESS, UTILITY_TOKEN_ABI } from '@/lib/utilityToken';

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false); // Added connecting state
  const { credits, loading: creditsLoading, refreshCredits } = useCredits();
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (walletAddress && typeof window.ethereum !== 'undefined' && UTILITY_TOKEN_ADDRESS && UTILITY_TOKEN_ADDRESS !== 'YOUR_DEPLOYED_UTILITY_TOKEN_ADDRESS') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(UTILITY_TOKEN_ADDRESS, UTILITY_TOKEN_ABI, provider);
          const balance = await contract.balanceOf(walletAddress);
          const decimals = await contract.decimals();
          setTokenBalance(ethers.formatUnits(balance, decimals));
        } catch (error) {
          setTokenBalance('0');
        }
      } else {
        setTokenBalance('0');
      }
    };
    fetchTokenBalance();
  }, [walletAddress]);

  useEffect(() => {
    // Check if wallet is already connected on mount
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_accounts', []);
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          // Optionally handle error
        }
      }
    };
    checkWalletConnection();
  }, []);

  const [cryptoPrices] = useState([
    {
      name: 'BTC',
      fullName: 'BITCOIN',
      price: '1,05,000.19',
      change: '+0.27%',
      currency: 'USDT',
      icon: <Bitcoin className="w-8 h-8 text-orange-500" />,
    },
    {
      name: 'ETH',
      fullName: 'ETHEREUM',
      price: '2,493.38',
      change: '+7.48%',
      currency: 'USDT',
      icon: <Network className="w-8 h-8 text-blue-500" />,
    },
    {
      name: 'USDT',
      fullName: 'TETHER',
      price: '1.00',
      change: '+0.00%',
      currency: 'USDT',
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
    },
  ]);

  const [trendingCoins] = useState([
    { name: 'BabyDoge', symbol: 'BABY', change: '+15.65%' },
    { name: 'WIF', symbol: 'DOGWIFHAT', change: '+28.17%' },
    { name: 'MUBARAK', symbol: 'MUBA', change: '+7.47%' },
    { name: 'XAI', symbol: 'XAI', change: '+34.24%' },
    { name: 'AUCTION', symbol: 'BOUNCE', change: '+14.86%' },
  ]);

  const [topAICoins] = useState([
    { name: 'CGPT', symbol: 'CHAINGPT', change: '+2.17%' },
    { name: 'COOKIE', symbol: 'COOKIE', change: '+4.53%' },
    { name: 'AITECH', symbol: 'SOLIDUS', change: '+5.86%' },
    { name: 'DCK', symbol: 'DEXCHECK', change: '+12.83%' },
    { name: 'GTAI', symbol: 'GT PROTOCOL', change: '+7.71%' },
  ]);

  const isWalletConnected = () => {
    return walletAddress !== null;
  };

  const handleRestrictedClick = () => {
    toast.error('Please connect your wallet to access this feature');
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnecting(true); // Set connecting state to true
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        toast.success('Wallet connected successfully!');
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
          toast.error('Please connect to MetaMask.');
        } else {
          toast.error('Error connecting to MetaMask');
          console.error('Error connecting to MetaMask:', error);
        }
      } finally {
        setConnecting(false); // Reset connecting state
      }
    } else {
      toast.error('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    toast.success('Wallet disconnected successfully');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <Bot className="w-8 h-8 text-cyan-400" />
                <span className="text-xl font-bold text-white">Sage AI</span>
              </Link>
              <nav className="hidden md:flex space-x-4">
                {isWalletConnected() ? (
                  <Link href="/chatbot">
                    <Button variant="ghost" className="text-white hover:text-purple-200">AI Tools</Button>
                  </Link>
                ) : (
                  <Button variant="ghost" className="text-white hover:text-purple-200" onClick={handleRestrictedClick}>
                    AI Tools
                  </Button>
                )}
                <Link href="/pricing">
                  <Button variant="ghost" className="text-white hover:text-purple-200">Pricing</Button>
                </Link>
                {isWalletConnected() ? (
                  <Link href="/hub">
                    <Button variant="ghost" className="text-white hover:text-purple-200">Hub</Button>
                  </Link>
                ) : (
                  <Button variant="ghost" className="text-white hover:text-purple-200" onClick={handleRestrictedClick}>
                    Hub
                  </Button>
                )}
                <Button variant="ghost" className="text-white hover:text-purple-200">Developers</Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-cyan-400 bg-gray-800 px-3 py-1 rounded-full font-mono">
                    {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-cyan-400 hover:text-cyan-200 hover:bg-gray-800"
                    onClick={disconnectWallet}
                    aria-label="Disconnect Wallet"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-6 py-2 font-bold"
                  onClick={connectWallet}
                  disabled={connecting}
                  aria-label="Connect Wallet"
                >
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Crypto Prices */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cryptoPrices.map((crypto, index) => (
                <Card key={index} className="bg-gray-800 border border-gray-700 shadow-lg p-4 min-w-[240px] flex items-center gap-3">
                  {crypto.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-lg">{crypto.name}</span>
                      <span className="text-xs text-gray-400">{crypto.fullName}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">{crypto.price}</span>
                      <span className="text-green-400 text-sm">{crypto.change}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Balance Card */}
            <Card className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight text-center drop-shadow-lg">Your Balance</h2>
              <div className="flex flex-col items-center gap-5 w-full">
                <div className="flex items-center gap-4 mb-2">
                  <Gift className="w-8 h-8 text-cyan-400" />
                  <span className="text-xl text-white font-semibold tracking-wide">CREDITS</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-5xl font-extrabold text-white drop-shadow-lg">{creditsLoading ? '...' : credits}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-cyan-300 hover:text-cyan-100 hover:bg-gray-700 ml-1"
                    onClick={refreshCredits}
                    aria-label="Refresh Balance"
                    disabled={creditsLoading}
                  >
                    <RefreshCw className={`w-7 h-7 ${creditsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <Link href="/pricing" className="w-full flex justify-center">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-8 py-3 text-lg font-bold tracking-wide mt-2 w-full max-w-xs">
                    Buy More Credits
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Quick Access */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-2">AI Chat Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {isWalletConnected() ? (
                  <Link href="/chatbot">
                    <QuickAccessCard
                      title="Web3 AI Chatbot"
                      icon={<Bot className="w-6 h-6" />}
                    />
                  </Link>
                ) : (
                  <QuickAccessCard
                    title="Web3 AI Chatbot"
                    icon={<Bot className="w-6 h-6" />}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
                {isWalletConnected() ? (
                  <Link href="/askpeople">
                    <QuickAccessCard
                      title="Ask Crypto People"
                      icon={<Users className="w-6 h-6" />}
                    />
                  </Link>
                ) : (
                  <QuickAccessCard
                    title="Ask Crypto People"
                    icon={<Users className="w-6 h-6" />}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
                {isWalletConnected() ? (
                  <Link href="/contract">
                    <QuickAccessCard
                      title="AI Smart Contracts"
                      icon={<FileCode className="w-6 h-6" />}
                      buttons={['AUDITOR', 'GENERATOR']}
                    />
                  </Link>
                ) : (
                  <QuickAccessCard
                    title="AI Smart Contracts"
                    icon={<FileCode className="w-6 h-6" />}
                    buttons={['AUDITOR', 'GENERATOR']}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
                {isWalletConnected() ? (
                  <Link href="/tradeassistant">
                    <QuickAccessCard
                      title="AI Trading Assistant (TA)"
                      icon={<TrendingUp className="w-6 h-6" />}
                    />
                  </Link>
                ) : (
                  <QuickAccessCard
                    title="AI Trading Assistant (TA)"
                    icon={<TrendingUp className="w-6 h-6" />}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
                {isWalletConnected() ? (
                  <Link href="/news">
                    <QuickAccessCard
                      title="AI Web3 News "
                      icon={<TrendingUp className="w-6 h-6" />}
                    />
                  </Link>
                ) : (
                  <QuickAccessCard
                    title="AI Web3 News"
                    icon={<TrendingUp className="w-6 h-6" />}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Chat Interface */}
            <Card className="bg-gray-800 border border-gray-700 shadow-lg p-8 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-6">
                <h2 className="text-xl font-semibold text-white">Chat with AI Web3</h2>
                <Button variant="ghost" size="icon" className="text-white hover:text-cyan-400">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-center">
                  <Bot className="w-24 h-24 text-cyan-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-white">Choose the mode</h3>
                  <p className="text-sm text-white">Select your preferred AI interaction mode</p>
                </div>
                {isWalletConnected() ? (
                  <Link href="/chatbot">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold py-3 rounded-xl mt-2">
                      Go to Chatbot
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full bg-gray-600 text-white opacity-50 cursor-not-allowed text-lg font-semibold py-3 rounded-xl mt-2"
                    disabled
                    onClick={handleRestrictedClick}
                  >
                    Connect Wallet to Access
                  </Button>
                )}
              </div>
            </Card>

            {/* Trending Coins */}
            <Card className="bg-gray-800 border border-gray-700 shadow-lg p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Top Trending Coins</h2>
              <div className="space-y-4">
                {trendingCoins.map((coin, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{coin.name}</span>
                      <span className="text-xs text-gray-400">{coin.symbol}</span>
                    </div>
                    <span className="text-green-400 font-semibold">{coin.change}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top AI Coins */}
            <Card className="bg-gray-800 border border-gray-700 shadow-lg p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Top AI Coins</h2>
              <div className="space-y-4">
                {topAICoins.map((coin, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{coin.name}</span>
                      <span className="text-xs text-gray-400">{coin.symbol}</span>
                    </div>
                    <span className="text-green-400 font-semibold">{coin.change}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickAccessCard({
  title,
  icon,
  buttons,
  disabled = false,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  buttons?: string[];
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={`bg-gray-800 border-gray-600 p-6 transition-colors group ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 cursor-pointer'
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 ${
          disabled ? 'text-gray-500' : 'text-white group-hover:text-cyan-400'
        }`}>
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {!buttons && <ChevronRight className={`w-5 h-5 ${
          disabled ? 'text-gray-500' : 'text-cyan-400 group-hover:text-cyan-200'
        }`} />}
      </div>
      {buttons && (
        <div className="flex gap-2">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`text-xs border-gray-600 ${
                disabled ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'
              }`}
              disabled={disabled}
            >
              {button}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}