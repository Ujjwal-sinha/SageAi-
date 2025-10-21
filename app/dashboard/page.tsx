'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Zap, 
  Gamepad2, 
  Code2, 
  TrendingUp, 
  Users, 
  FileCode, 
  Newspaper,
  Wallet,
  ArrowUp,
  ArrowDown,
  Star,
  Activity,
  Globe,
  Shield,
  Crown,
  Menu,
  X,
  Home,
  ArrowLeft,
  Server
} from 'lucide-react';
import Link from 'next/link';
import { useCredits } from '@/hooks/useCredits';
import { cryptoService, CryptoPrice, AICoin } from '@/lib/services/cryptoService';

// Professional Card Component
const ProfessionalCard = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  cost, 
  features, 
  disabled = false, 
  onClick 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  cost: string;
  features: string[];
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const CardComponent = onClick ? 'button' : 'div';
  
  return (
    <CardComponent
      className={`
        group relative overflow-hidden rounded-3xl border border-gray-700/30 
        bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm
        shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-600/50'}
        ${onClick ? 'focus:outline-none focus:ring-2 focus:ring-cyan-500/50' : ''}
      `}
      onClick={disabled ? undefined : onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-500`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            {icon}
          </div>
          <Badge className="bg-gradient-to-r from-cyan-500/90 to-purple-500/90 text-white border-0 shadow-md text-xs font-semibold px-3 py-1">
            {cost}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-200 mb-2 uppercase tracking-wide">Key Features</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex-shrink-0"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/40 group-hover:border-gray-600/60 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              {disabled ? 'Connect wallet to access' : 'Click to access'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
                {disabled ? 'Locked' : 'Available'}
              </span>
              <ArrowUp className={`w-3 h-3 transition-all duration-300 ${disabled ? 'text-gray-500' : 'text-cyan-400 group-hover:translate-y-1'}`} />
            </div>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

// Crypto Sidebar Component
const CryptoSidebar = ({ 
  cryptoPrices, 
  aiCoins, 
  cryptoLoading, 
  lastUpdated 
}: {
  cryptoPrices: CryptoPrice[];
  aiCoins: AICoin[];
  cryptoLoading: boolean;
  lastUpdated: Date;
}) => {
  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Live Crypto Prices - Horizontal */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Live Crypto Prices</h2>
          </div>
          
          <div className="space-y-3">
            {cryptoLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="w-12 h-3 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-2 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-3 bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="w-12 h-2 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : cryptoPrices.length > 0 ? (
              cryptoPrices.map((crypto) => {
                const isPositive = crypto.change_percentage_24h >= 0;
                return (
                  <div key={crypto.id} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <img 
                        src={crypto.logo} 
                        alt={crypto.name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${crypto.symbol}&background=0D9488&color=fff&size=24`;
                        }}
                      />
                      <div>
                        <h4 className="text-white font-semibold text-sm">{crypto.symbol}</h4>
                        <p className="text-xs text-gray-400">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">{cryptoService.formatPrice(crypto.price)}</p>
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                        <span className="text-xs">{isPositive ? '+' : ''}{crypto.change_percentage_24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-400">
                <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Configure API key for live data</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Last updated
              </div>
              <span>{lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </Card>


      {/* AI Coins - Horizontal */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">AI Coins</h2>
          </div>
          
          <div className="space-y-3">
            {cryptoLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      <div className="w-12 h-3 bg-gray-700 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-2 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-3 bg-gray-700 rounded animate-pulse mb-1"></div>
                    <div className="w-12 h-2 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : aiCoins.length > 0 ? (
              aiCoins.map((coin, index) => {
                const isPositive = coin.change_percentage_24h >= 0;
                return (
                  <div key={coin.id} className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-800/20 to-pink-800/20 hover:from-purple-700/30 hover:to-pink-700/30 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <img 
                        src={coin.logo} 
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${coin.symbol}&background=8B5CF6&color=fff&size=24`;
                        }}
                      />
                      <div>
                        <h4 className="text-white font-semibold text-sm">{coin.symbol}</h4>
                        <p className="text-xs text-gray-400">{coin.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">{cryptoService.formatPrice(coin.price)}</p>
                      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                        <span className="text-xs">{isPositive ? '+' : ''}{coin.change_percentage_24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-400">
                <Crown className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No AI coin data</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const { credits, isLoading: creditsLoading } = useCredits();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [aiCoins, setAiCoins] = useState<AICoin[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check wallet connection
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  // Fetch crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      setCryptoLoading(true);
      try {
        const [topCryptos, ai] = await Promise.all([
          cryptoService.getTopCryptos(3),
          cryptoService.getAICoins(5)
        ]);
        
        setCryptoPrices(topCryptos);
        setAiCoins(ai);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setCryptoLoading(false);
      }
    };

    fetchCryptoData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCryptoData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const isWalletConnected = () => {
    return walletAddress !== null;
  };

  const handleRestrictedClick = () => {
    toast.error('Please connect your wallet to access this feature');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

      <div className="relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
                <div className="flex items-center gap-3">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Sage AI</h1>
                  </div>
                  <Button
                    variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-gray-700/50"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>

        <div className="flex">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700/50 p-6 overflow-y-auto">
                <div className="max-h-full">
                  <CryptoSidebar 
                    cryptoPrices={cryptoPrices}
                    aiCoins={aiCoins}
                    cryptoLoading={cryptoLoading}
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 p-6">
            <div className="sticky top-6">
              <CryptoSidebar 
                cryptoPrices={cryptoPrices}
                aiCoins={aiCoins}
                cryptoLoading={cryptoLoading}
                lastUpdated={lastUpdated}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Landing
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sage AI Dashboard
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                Your intelligent Web3 assistant platform powered by AI and blockchain technology
              </p>
        </div>

            {/* Compact Balance Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-xl rounded-xl mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 shadow-md">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {creditsLoading ? '...' : credits.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">UTK Credits</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                    Buy Credits
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Services Grid */}
            <div className="space-y-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-cyan-500/20 mb-6">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">AI-Powered Services</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Services
                </h2>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                  Access powerful AI tools with your UTK credits. Each service is designed to enhance your Web3 experience with cutting-edge artificial intelligence.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Somnia Ecosystem */}
                {isWalletConnected() ? (
                  <Link href="/somnia">
                    <ProfessionalCard
                      title="Somnia Ecosystem"
                      description="Explore Somnia blockchain features, recent developments, and ecosystem insights"
                      icon={<Zap className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-cyan-500 to-blue-500"
                      cost="9 UTK"
                      features={["Blockchain Info", "Recent Updates", "Ecosystem News", "Technical Specs"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="Somnia Ecosystem"
                    description="Explore Somnia blockchain features, recent developments, and ecosystem insights"
                    icon={<Zap className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-cyan-500 to-blue-500"
                    cost="9 UTK"
                    features={["Blockchain Info", "Recent Updates", "Ecosystem News", "Technical Specs"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* Gaming Development Bot */}
                {isWalletConnected() ? (
                  <Link href="/gamingbot">
                    <ProfessionalCard
                      title="Gaming Development Bot"
                      description="Build blockchain games with expert guidance and Somnia ecosystem integration"
                      icon={<Gamepad2 className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-green-500 to-emerald-500"
                      cost="11 UTK"
                      features={["Game Design", "Smart Contracts", "NFT Integration", "P2E Models"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="Gaming Development Bot"
                    description="Build blockchain games with expert guidance and Somnia ecosystem integration"
                    icon={<Gamepad2 className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-green-500 to-emerald-500"
                    cost="11 UTK"
                    features={["Game Design", "Smart Contracts", "NFT Integration", "P2E Models"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* Web3 AI Chatbot */}
                {isWalletConnected() ? (
                  <Link href="/chatbot">
                    <ProfessionalCard
                      title="Web3 AI Chatbot"
                      description="Intelligent conversational AI for Web3 assistance and guidance"
                      icon={<Globe className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-blue-500 to-indigo-500"
                      cost="1 UTK"
                      features={["Web3 Support", "Smart Contracts", "DeFi Guidance", "Blockchain Help"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="Web3 AI Chatbot"
                    description="Intelligent conversational AI for Web3 assistance and guidance"
                    icon={<Globe className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-blue-500 to-indigo-500"
                    cost="1 UTK"
                    features={["Web3 Support", "Smart Contracts", "DeFi Guidance", "Blockchain Help"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* AI Trading Assistant */}
                {isWalletConnected() ? (
                  <Link href="/tradeassistant">
                    <ProfessionalCard
                      title="AI Trading Assistant"
                      description="Advanced trading insights and market analysis powered by AI"
                      icon={<TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-orange-500 to-red-500"
                      cost="3 UTK"
                      features={["Market Analysis", "Trading Signals", "Risk Assessment", "Portfolio Tips"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="AI Trading Assistant"
                    description="Advanced trading insights and market analysis powered by AI"
                    icon={<TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-orange-500 to-red-500"
                    cost="3 UTK"
                    features={["Market Analysis", "Trading Signals", "Risk Assessment", "Portfolio Tips"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* AI Smart Contracts */}
                {isWalletConnected() ? (
                  <Link href="/contract">
                    <ProfessionalCard
                      title="AI Smart Contracts"
                      description="Generate and audit smart contracts with AI assistance"
                      icon={<FileCode className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-indigo-500 to-purple-500"
                      cost="5 UTK"
                      features={["Contract Generator", "Security Audit", "Gas Optimization", "Best Practices"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="AI Smart Contracts"
                    description="Generate and audit smart contracts with AI assistance"
                    icon={<FileCode className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-indigo-500 to-purple-500"
                    cost="5 UTK"
                    features={["Contract Generator", "Security Audit", "Gas Optimization", "Best Practices"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* Infrastructure Agents */}
                {isWalletConnected() ? (
                  <Link href="/infrastructure">
                    <ProfessionalCard
                      title="Infrastructure Agents"
                      description="Build and manage robust infrastructure for Somnia ecosystem applications"
                      icon={<Server className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-indigo-500 to-cyan-500"
                      cost="13 UTK"
                      features={["Node Deployment", "Security Hardening", "Monitoring Setup", "Cloud Infrastructure"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="Infrastructure Agents"
                    description="Build and manage robust infrastructure for Somnia ecosystem applications"
                    icon={<Server className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-indigo-500 to-cyan-500"
                    cost="13 UTK"
                    features={["Node Deployment", "Security Hardening", "Monitoring Setup", "Cloud Infrastructure"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}

                {/* AI Web3 News */}
                {isWalletConnected() ? (
                  <Link href="/news">
                    <ProfessionalCard
                      title="AI Web3 News"
                      description="Curated Web3 news with AI-powered insights and analysis"
                      icon={<Newspaper className="w-6 h-6 lg:w-8 lg:h-8" />}
                      gradient="from-pink-500 to-rose-500"
                      cost="1 UTK"
                      features={["News Curation", "AI Insights", "Market Trends", "Real-time Updates"]}
                    />
                  </Link>
                ) : (
                  <ProfessionalCard
                    title="AI Web3 News"
                    description="Curated Web3 news with AI-powered insights and analysis"
                    icon={<Newspaper className="w-6 h-6 lg:w-8 lg:h-8" />}
                    gradient="from-pink-500 to-rose-500"
                    cost="1 UTK"
                    features={["News Curation", "AI Insights", "Market Trends", "Real-time Updates"]}
                    disabled={true}
                    onClick={handleRestrictedClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}