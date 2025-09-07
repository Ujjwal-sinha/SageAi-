'use client';

import { useState, useEffect } from 'react';
import { tradingAdvice } from '@/lib/ta';
import { motion } from 'framer-motion';
import { FaChartLine, FaWallet, FaHistory, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';

const mockPrices = [
  { symbol: 'BTC', price: '28,450.23', change: '+1.2%' },
  { symbol: 'ETH', price: '1,850.15', change: '-0.4%' },
  { symbol: 'SOL', price: '24.50', change: '+3.8%' },
  { symbol: 'BNB', price: '320.10', change: '+0.7%' },
];

const TradeAssistantContent = () => {
  const [token, setToken] = useState('Bitcoin');
  const [chain, setChain] = useState('Binance Smart Chain');
  const [sector, setSector] = useState('DeFi');
  const [model, setModel] = useState('gemma2-9b-it');
  const [analysis, setAnalysis] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const chains = [
    'Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon',
    'Avalanche', 'Arbitrum', 'Optimism', 'Somnia Blockchain', 'Other',
  ];
  const sectors = [
    'DeFi', 'NFT', 'GameFi', 'Infrastructure', 'DAO', 'SocialFi', 'Memecoin', 'Other',
  ];
  const models = [
      { label: 'Gemma-7B', value: 'gemma2-9b-it' },
    { label: 'LLaMA3.3-70B', value: 'llama-3.3-70b-versatile' },
    { label: 'kimi-k2-instruct', value: 'moonshotai/kimi-k2-instruct' },
  ];

  // Simulate real-time price ticker update
  const [prices, setPrices] = useState(mockPrices);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => {
          const changePercent = Number((Math.random() * 2 - 1).toFixed(2));
          const priceNum = parseFloat(p.price.replace(/,/g, ''));
          const newPrice = (priceNum * (1 + changePercent / 100)).toFixed(2);
          return {
            ...p,
            price: newPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            change: `${changePercent > 0 ? '+' : ''}${changePercent}%`,
          };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setOutput('');
    try {
      const inputData = `[Token]: ${token}
[Chain]: ${chain}
[Sector]: ${sector}

[Analysis] 
${analysis}`;
      const result = await tradingAdvice(inputData, model);
      setOutput(result);
    } catch (error) {
      setOutput('⚠️ Error: Could not fetch trading advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      {/* Header Navigation */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Sage AI
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/news" className="text-gray-300 hover:text-white transition-colors">News</Link>
              <Link href="/chatbot" className="text-gray-300 hover:text-white transition-colors">Chatbot</Link>
              <Link href="/tradeassistant" className="text-cyan-400 font-medium">Trade Assistant</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AI Trading Assistant
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get professional trading insights powered by advanced AI. Analyze market trends, assess risks, and make informed decisions.
          </p>
          
          {/* Live Market Ticker */}
          <div className="flex justify-center mb-8">
            <div className="bg-black/40 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-700">
              <div className="flex space-x-6">
                {prices.map(({ symbol, price, change }) => (
                  <motion.div
                    key={symbol}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-gray-400 text-sm">{symbol}</span>
                    <span className="text-white font-mono">${price}</span>
                    <span className={`text-xs ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {change}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Trading Form */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 px-8 py-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">Trading Analysis Form</h2>
            <p className="text-gray-400">Enter your trading parameters for AI-powered market insights</p>
          </div>

          {/* Form Content */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!loading && token && chain && sector) handleSubmit();
            }}
            className="p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Token Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  <FaChartLine className="inline mr-2" />
                  Token Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="token-list"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Bitcoin"
                    required
                  />
                  <datalist id="token-list">
                    <option value="Bitcoin" />
                    <option value="Ethereum" />
                    <option value="Solana" />
                    <option value="Uniswap" />
                    <option value="Chainlink" />
                  </datalist>
                </div>
              </div>

              {/* Blockchain */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  <FaWallet className="inline mr-2" />
                  Blockchain
                </label>
                <select
                  value={chain}
                  onChange={e => setChain(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  required
                >
                  <option value="" disabled>Select Blockchain</option>
                  {chains.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  <FaCog className="inline mr-2" />
                  Sector
                </label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  required
                >
                  <option value="" disabled>Select Sector</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* LLM Model */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400 mb-2">
                  <Bot className="inline mr-2" />
                  AI Model
                </label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                >
                  {models.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analysis Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-cyan-400 mb-3">
                <FaHistory className="inline mr-2" />
                Your Analysis (Optional)
              </label>
              <textarea
                value={analysis}
                onChange={e => setAnalysis(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="Add your own technical analysis, tokenomics notes, or market observations..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={loading || !token || !chain || !sector}
                className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  loading || !token || !chain || !sector
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105'
                }`}
                whileHover={loading ? {} : { scale: 1.05 }}
                whileTap={loading ? {} : { scale: 0.95 }}
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Analyzing Market...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaChartLine />
                    <span>Get Trading Recommendation</span>
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Output Section */}
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700 overflow-hidden mt-8"
          >
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 px-8 py-6 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Trading Recommendation</h3>
              <p className="text-gray-400">AI-powered market analysis and trading insights</p>
            </div>
            <div className="p-8">
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-600">
                <pre className="text-gray-100 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  {output}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default function ProCryptoTradingAssistant() {
  return (
    <FeatureGate feature={FeatureType.TRADE_ASSISTANT}>
      <TradeAssistantContent />
    </FeatureGate>
  );
}