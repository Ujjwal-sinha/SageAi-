'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, BarChart3, Zap, Brain, Target, DollarSign, Activity,
  Sparkles, ChevronDown, RefreshCw, Star, Layers, Globe, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { tradingAdvice } from '@/lib/ta';

// Define interfaces for type safety
interface Price {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changeType: 'positive' | 'negative';
  marketCap: string;
}

interface Chain {
  name: string;
  icon: string;
  color: string;
}

interface Sector {
  name: string;
  icon: string;
  description: string;
}

interface Model {
  label: string;
  value: string;
  description: string;
  recommended?: boolean;
}


// Define mockPrices to fix TS2304
const mockPrices: Price[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '28,450.23', change: '+1.2%', changeType: 'positive', marketCap: '554.2B' },
  { symbol: 'ETH', name: 'Ethereum', price: '1,850.15', change: '-0.4%', changeType: 'negative', marketCap: '222.4B' },
  { symbol: 'SOL', name: 'Solana', price: '24.50', change: '+3.8%', changeType: 'positive', marketCap: '11.2B' },
  { symbol: 'BNB', name: 'BNB', price: '320.10', change: '+0.7%', changeType: 'positive', marketCap: '48.7B' },
  { symbol: 'ADA', name: 'Cardano', price: '0.485', change: '-2.1%', changeType: 'negative', marketCap: '17.2B' },
  { symbol: 'AVAX', name: 'Avalanche', price: '12.45', change: '+5.2%', changeType: 'positive', marketCap: '5.1B' },
];

const chains: Chain[] = [
  { name: 'Ethereum', icon: '⟠', color: 'text-blue-400' },
  { name: 'Solana', icon: '◎', color: 'text-purple-400' },
  { name: 'Binance Smart Chain', icon: '🟡', color: 'text-yellow-400' },
  { name: 'Polygon', icon: '⬟', color: 'text-purple-500' },
  { name: 'Avalanche', icon: '🔺', color: 'text-red-400' },
  { name: 'Arbitrum', icon: '🌀', color: 'text-cyan-400' },
  { name: 'Optimism', icon: '🔴', color: 'text-red-500' },
  { name: 'Somnia Blockchain', icon: '✦', color: 'text-green-400' },
  { name: 'Other', icon: '⚡', color: 'text-gray-400' },
];

const sectors: Sector[] = [
  { name: 'DeFi', icon: '🏦', description: 'Decentralized Finance' },
  { name: 'NFT', icon: '🖼️', description: 'Non-Fungible Tokens' },
  { name: 'GameFi', icon: '🎮', description: 'Gaming & Finance' },
  { name: 'Infrastructure', icon: '🏗️', description: 'Blockchain Infrastructure' },
  { name: 'DAO', icon: '🏛️', description: 'Decentralized Organizations' },
  { name: 'SocialFi', icon: '👥', description: 'Social Finance' },
  { name: 'Memecoin', icon: '🐸', description: 'Meme Cryptocurrencies' },
  { name: 'AI', icon: '🤖', description: 'Artificial Intelligence' },
  { name: 'Other', icon: '📊', description: 'Other Sectors' },
];

const models: Model[] = [
  { 
    label: 'LLaMA 3.3-70B', 
    value: 'llama-3.3-70b-versatile',
    description: 'Most powerful model for complex analysis',
    recommended: true
  },
  { 
    label: 'Gemma-9B', 
    value: 'gemma2-9b-it',
    description: 'Fast and efficient for quick insights'
  },
  { 
    label: 'Kimi K2', 
    value: 'moonshotai/kimi-k2-instruct',
    description: 'Specialized in market analysis'
  },
];

// Client-only AnimatedBackground component to avoid hydration mismatch
const AnimatedBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-400/10 blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
};

const TradeAssistantContent = () => {
  const [token, setToken] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [model, setModel] = useState<string>('llama-3.3-70b-versatile');
  const [analysis, setAnalysis] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [prices, setPrices] = useState<Price[]>(mockPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => {
          const volatility = p.symbol === 'BTC' ? 0.5 : p.symbol === 'ETH' ? 0.8 : 2.0;
          const changePercent = Number((Math.random() * volatility * 2 - volatility).toFixed(2));
          const priceNum = parseFloat(p.price.replace(/,/g, ''));
          const newPrice = Math.max(0.001, priceNum * (1 + changePercent / 100));
          const formattedPrice = newPrice < 1 ? newPrice.toFixed(3) : newPrice.toFixed(2);
          
          return {
            ...p,
            price: formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            change: `${changePercent > 0 ? '+' : ''}${changePercent}%`,
            changeType: changePercent > 0 ? 'positive' : 'negative',
          };
        })
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const refreshPrices = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('');
    console.log('Submitting with:', { token, chain, sector, model, analysis });
    try {
      const inputData = `[Token]: ${token}
[Chain]: ${chain}
[Sector]: ${sector}

[Analysis] 
${analysis}`;
      const result = await tradingAdvice(inputData, model);
      console.log('API response:', result);
      setOutput(result);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setOutput('⚠️ Error: Could not fetch trading advice. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-white/5 gap-2 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    AI Trading Assistant
                  </h1>
                  <p className="text-sm text-gray-400">Advanced market analysis powered by AI</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={refreshPrices}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className={`w-5 h-5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Market Ticker */}
      <div className="relative z-40 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-cyan-400 tracking-wider">LIVE MARKET DATA</span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Real-time updates</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {prices.map(({ symbol, name, price, change, changeType, marketCap }, index) => (
              <motion.div
                key={symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{symbol}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      changeType === 'positive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {change}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-mono text-white group-hover:text-cyan-400 transition-colors">
                    ${price}
                  </div>
                  <div className="text-xs text-gray-400">{name}</div>
                  <div className="text-xs text-gray-500">MC: ${marketCap}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-30 max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-16 h-16 text-cyan-400" />
              </motion.div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Next-Gen Trading Intelligence
                </h2>
                <p className="text-xl text-gray-400 mt-2">Harness the power of advanced AI for superior market insights</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: Zap, text: 'Lightning Fast', color: 'from-yellow-400 to-orange-400' },
                { icon: Target, text: 'Precision Analysis', color: 'from-cyan-400 to-blue-400' },
                { icon: Globe, text: 'Multi-Chain', color: 'from-purple-400 to-pink-400' },
                { icon: Sparkles, text: 'AI Powered', color: 'from-green-400 to-emerald-400' }
              ].map(({ icon: Icon, text, color }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${color} bg-opacity-20 border border-white/20 rounded-full backdrop-blur-sm`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trading Analysis Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Market Analysis</h3>
                  <p className="text-gray-400">Get AI-powered insights for any cryptocurrency</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!loading && token && chain && sector) {
                    console.log('Form submitted');
                    handleSubmit();
                  } else {
                    console.log('Form submission blocked:', { loading, token, chain, sector });
                  }
                }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-cyan-300 tracking-wider">
                      🪙 TOKEN / CRYPTOCURRENCY
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        list="token-list"
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all backdrop-blur-sm ${
                          !token && !loading ? 'border-red-500/50' : 'border-white/20'
                        }`}
                        placeholder="e.g. Bitcoin, Ethereum, Solana..."
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        required
                      />
                      {!token && !loading && (
                        <p className="text-xs text-red-400 mt-1">Token is required</p>
                      )}
                      <datalist id="token-list">
                        <option value="Bitcoin" />
                        <option value="Ethereum" />
                        <option value="Solana" />
                        <option value="Uniswap" />
                        <option value="Chainlink" />
                        <option value="Polygon" />
                        <option value="Avalanche" />
                      </datalist>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-cyan-300 tracking-wider">
                      ⛓️ BLOCKCHAIN NETWORK
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all backdrop-blur-sm appearance-none ${
                          !chain && !loading ? 'border-red-500/50' : 'border-white/20'
                        }`}
                        value={chain}
                        onChange={e => setChain(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Network</option>
                        {chains.map((c) => (
                          <option key={c.name} value={c.name} className="bg-gray-900">
                            {c.icon} {c.name}
                          </option>
                        ))}
                      </select>
                      {!chain && !loading && (
                        <p className="text-xs text-red-400 mt-1">Chain is required</p>
                      )}
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-cyan-300 tracking-wider">
                      🏢 MARKET SECTOR
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all backdrop-blur-sm appearance-none ${
                          !sector && !loading ? 'border-red-500/50' : 'border-white/20'
                        }`}
                        value={sector}
                        onChange={e => setSector(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Sector</option>
                        {sectors.map((s) => (
                          <option key={s.name} value={s.name} className="bg-gray-900">
                            {s.icon} {s.name}
                          </option>
                        ))}
                      </select>
                      {!sector && !loading && (
                        <p className="text-xs text-red-400 mt-1">Sector is required</p>
                      )}
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Toggling showAdvanced:', !showAdvanced);
                      setShowAdvanced(!showAdvanced);
                    }}
                    className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Layers className="w-5 h-5" />
                    <span className="font-semibold">Advanced Options</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 1, height: 'auto' }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-6"
                      >
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300 tracking-wider">
                            🤖 AI MODEL
                          </label>
                          {models.length === 0 ? (
                            <p className="text-red-400">No models available</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {models.map((model_option) => (
                                <motion.button
                                  key={model_option.value}
                                  type="button"
                                  onClick={() => {
                                    console.log('Selected model:', model_option.value);
                                    setModel(model_option.value);
                                  }}
                                  className={`p-4 rounded-xl border transition-all text-left ${
                                    model === model_option.value
                                      ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300'
                                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold">{model_option.label}</span>
                                    {model_option.recommended && (
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400">{model_option.description}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300 tracking-wider">
                            📝 YOUR ANALYSIS (OPTIONAL)
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none transition-all backdrop-blur-sm"
                            placeholder="Share your technical analysis, market observations, specific questions, or trading strategy..."
                            value={analysis}
                            onChange={e => setAnalysis(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-center pt-6">
                  <motion.button
                    type="submit"
                    disabled={loading || !token || !chain || !sector}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-4 ${
                      loading || !token || !chain || !sector
                        ? 'bg-gray-600/50 cursor-not-allowed opacity-50 text-gray-400'
                        : 'bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-cyan-500/25'
                    }`}
                    whileHover={!loading && token && chain && sector ? { scale: 1.05 } : {}}
                    whileTap={!loading && token && chain && sector ? { scale: 0.95 } : {}}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                        <span>Analyzing Market Data...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-6 h-6" />
                        <span>Generate AI Trading Analysis</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div 
                      className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <DollarSign className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        AI Trading Analysis
                      </h3>
                      <p className="text-gray-400">
                        Powered by {models.find(m => m.value === model)?.label ?? 'Unknown Model'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                    <pre className="whitespace-pre-wrap text-gray-100 text-sm leading-relaxed font-mono">
                      {output}
                    </pre>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>This is AI-generated analysis. Please do your own research.</span>
                    </div>
                    <Button
                      onClick={() => navigator.clipboard.writeText(output)}
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Copy Analysis
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function ProCryptoTradingAssistant() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FeatureGate feature={FeatureType.TRADE_ASSISTANT}>
        <TradeAssistantContent />
      </FeatureGate>
    </>
  );
}