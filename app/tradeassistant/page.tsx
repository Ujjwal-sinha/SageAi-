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
  { symbol: 'BTC', price: '28,450.23', change: '+1.2%', volume: '$2.1B', high24h: '29,100.00', low24h: '27,800.00' },
  { symbol: 'ETH', price: '1,850.15', change: '-0.4%', volume: '$980M', high24h: '1,890.50', low24h: '1,820.00' },
  { symbol: 'SOL', price: '24.50', change: '+3.8%', volume: '$145M', high24h: '25.20', low24h: '23.10' },
  { symbol: 'BNB', price: '320.10', change: '+0.7%', volume: '$67M', high24h: '325.80', low24h: '315.20' },
  { symbol: 'ADA', price: '0.85', change: '+2.1%', volume: '$89M', high24h: '0.88', low24h: '0.82' },
  { symbol: 'AVAX', price: '42.30', change: '-1.3%', volume: '$78M', high24h: '44.50', low24h: '41.80' },
];

const TradeAssistantContent = () => {
  const [token, setToken] = useState('Bitcoin');
  const [chain, setChain] = useState('Binance Smart Chain');
  const [sector, setSector] = useState('DeFi');
  const [model, setModel] = useState('gemma2-9b-it');
  const [analysis, setAnalysis] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Medium');

  const chains = [
    'Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon',
    'Avalanche', 'Arbitrum', 'Optimism', 'Somnia Blockchain', 'Other',
  ];
  const sectors = [
    'DeFi', 'NFT', 'GameFi', 'Infrastructure', 'DAO', 'SocialFi', 'Memecoin', 'Other',
  ];
  const models = [
    { label: 'Gemma-7B', value: 'gemma2-9b-it', description: 'Fast & efficient for quick analysis' },
    { label: 'LLaMA3.3-70B', value: 'llama-3.3-70b-versatile', description: 'Advanced reasoning for complex strategies' },
    { label: 'kimi-k2-instruct', value: 'moonshotai/kimi-k2-instruct', description: 'Specialized for financial insights' },
  ];
  const riskLevels = ['Low', 'Medium', 'High', 'Aggressive'];

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

[Risk Level]: ${riskLevel}

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Header Navigation */}
      <header className="relative z-10 bg-black/30 backdrop-blur-xl border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Bot className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg group-hover:bg-cyan-400/30 transition-all duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Sage AI
              </span>
            </Link>
            <nav className="hidden md:flex space-x-1">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/news", label: "News" },
                { href: "/chatbot", label: "Chatbot" },
                { href: "/tradeassistant", label: "Trade Assistant", active: true }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    item.active
                      ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 font-medium border border-cyan-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/30"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full mb-6">
                <FaChartLine className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-cyan-300 text-sm font-medium">Professional Trading Analysis</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                  AI Trading
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Harness the power of advanced artificial intelligence to analyze market trends, 
                assess trading risks, and make data-driven investment decisions with confidence.
              </p>
            </motion.div>
            
            {/* Enhanced Market Ticker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center mb-12"
            >
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-2xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Live Market Data</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {prices.map(({ symbol, price, change, volume, high24h, low24h }, index) => (
                    <motion.div
                      key={symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-lg group-hover:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 border border-gray-600/50 rounded-xl p-3 hover:border-cyan-500/30 transition-all duration-300 group">
                        <div className="text-center">
                          <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{symbol}</div>
                          <div className="text-white font-bold text-base font-mono">${price}</div>
                          <div className={`text-xs font-semibold mb-2 ${
                            change.startsWith('+') 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {change}
                          </div>
                          
                          {/* Additional Info - Shown on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500 space-y-1">
                            <div>Vol: {volume}</div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-green-400">H: ${high24h}</span>
                              <span className="text-red-400">L: ${low24h}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {[
                { icon: "🤖", text: "AI-Powered Analysis" },
                { icon: "📊", text: "Real-time Data" },
                { icon: "🔒", text: "Risk Assessment" },
                { icon: "⚡", text: "Instant Insights" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-900/40 backdrop-blur-lg border border-gray-700/50 rounded-full px-6 py-3 hover:bg-gray-800/40 transition-all duration-300"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Trading Form */}
      <section className="relative max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Form Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
            {/* Form Header with Enhanced Design */}
            <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-gray-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10"></div>
              <div className="relative px-8 py-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                        <FaChartLine className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Trading Analysis Engine
                      </h2>
                    </div>
                    <p className="text-gray-400 text-lg">
                      Configure your analysis parameters for precision AI-powered market insights
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>AI Engine Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Form Content */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!loading && token && chain && sector) handleSubmit();
              }}
              className="p-8 space-y-8"
            >
              {/* Form Fields Grid with Enhanced Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  {
                    id: 'token',
                    label: 'Token Name',
                    icon: FaChartLine,
                    type: 'input',
                    value: token,
                    onChange: setToken,
                    placeholder: 'Bitcoin',
                    list: 'token-list',
                    gradient: 'from-cyan-500/20 to-blue-500/20',
                    border: 'border-cyan-500/30'
                  },
                  {
                    id: 'chain',
                    label: 'Blockchain',
                    icon: FaWallet,
                    type: 'select',
                    value: chain,
                    onChange: setChain,
                    options: chains,
                    placeholder: 'Select Blockchain',
                    gradient: 'from-blue-500/20 to-purple-500/20',
                    border: 'border-blue-500/30'
                  },
                  {
                    id: 'sector',
                    label: 'Sector',
                    icon: FaCog,
                    type: 'select',
                    value: sector,
                    onChange: setSector,
                    options: sectors,
                    placeholder: 'Select Sector',
                    gradient: 'from-purple-500/20 to-pink-500/20',
                    border: 'border-purple-500/30'
                  },
                  {
                    id: 'model',
                    label: 'AI Model',
                    icon: Bot,
                    type: 'select',
                    value: model,
                    onChange: setModel,
                    options: models,
                    isModel: true,
                    gradient: 'from-pink-500/20 to-cyan-500/20',
                    border: 'border-pink-500/30'
                  },
                  {
                    id: 'risk',
                    label: 'Risk Level',
                    icon: FaCog,
                    type: 'select',
                    value: riskLevel,
                    onChange: setRiskLevel,
                    options: riskLevels,
                    gradient: 'from-orange-500/20 to-red-500/20',
                    border: 'border-orange-500/30'
                  }
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${field.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                    <div className="relative space-y-3">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                        <div className={`p-1.5 bg-gradient-to-r ${field.gradient} rounded-lg ${field.border} border`}>
                          <field.icon className="w-4 h-4 text-white" />
                        </div>
                        <span>{field.label}</span>
                      </label>
                      
                      {field.type === 'input' ? (
                        <div className="relative">
                          <input
                            type="text"
                            list={field.list}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-gray-800/80"
                            placeholder={field.placeholder}
                            required
                          />
                          {field.list && (
                            <datalist id={field.list}>
                              <option value="Bitcoin" />
                              <option value="Ethereum" />
                              <option value="Solana" />
                              <option value="Uniswap" />
                              <option value="Chainlink" />
                            </datalist>
                          )}
                        </div>
                      ) : (
                        <select
                          value={field.value}
                          onChange={e => field.onChange(e.target.value)}
                          className="w-full px-4 py-4 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 hover:bg-gray-800/80"
                          required={field.id !== 'model'}
                        >
                          {!field.isModel && <option value="" disabled>{field.placeholder}</option>}
                          {field.isModel ? 
                            (field.options as typeof models).map((m) => (
                              <option key={m.value} value={m.value} title={m.description}>{m.label}</option>
                            )) :
                            (field.options as string[]).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))
                          }
                        </select>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Analysis Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                    <div className="p-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
                      <FaHistory className="w-4 h-4 text-white" />
                    </div>
                    <span>Your Analysis (Optional)</span>
                    <span className="text-xs text-gray-500 bg-gray-800/40 px-2 py-1 rounded-full">Enhanced with AI</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={analysis}
                      onChange={e => setAnalysis(e.target.value)}
                      rows={6}
                      className="w-full px-6 py-4 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none hover:bg-gray-800/80"
                      placeholder="🔍 Add your technical analysis, tokenomics insights, market sentiment, or any observations that could enhance the AI recommendation..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {analysis.length}/1000 characters
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center pt-4"
              >
                <motion.button
                  type="submit"
                  disabled={loading || !token || !chain || !sector}
                  className={`group relative px-16 py-5 rounded-2xl font-bold text-lg transition-all duration-500 ${
                    loading || !token || !chain || !sector
                      ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-2xl hover:shadow-cyan-500/25'
                  }`}
                  whileHover={loading || !token || !chain || !sector ? {} : { 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)"
                  }}
                  whileTap={loading || !token || !chain || !sector ? {} : { scale: 0.98 }}
                >
                  {/* Button Background Effect */}
                  {!(loading || !token || !chain || !sector) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  )}
                  
                  <div className="relative flex items-center space-x-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                        <span>Analyzing Market Data...</span>
                      </>
                    ) : (
                      <>
                        <FaChartLine className="group-hover:rotate-12 transition-transform duration-300" />
                        <span>Generate Trading Recommendation</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-cyan-300"
                        >
                          ⚡
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Enhanced Output Section */}
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-12"
          >
            {/* Output Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-black/90 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
              {/* Output Header with Success Animation */}
              <div className="relative bg-gradient-to-r from-green-900/40 via-blue-900/40 to-purple-900/40 border-b border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10"></div>
                <div className="relative px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <FaChartLine className="w-6 h-6 text-green-400" />
                          </motion.div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                          AI Trading Recommendation
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Analysis complete • Generated in real-time
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Analysis Complete</span>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-800/40 px-3 py-1 rounded-full">
                        Confidence: High
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Output Content */}
              <div className="p-8">
                <div className="relative">
                  {/* Content Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/50 rounded-2xl"></div>
                  
                  <div className="relative bg-gray-800/20 border border-gray-600/40 rounded-2xl p-6 backdrop-blur-sm">
                    {/* Content Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                        <span className="text-gray-300 font-medium">Market Analysis Results</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>📊</span>
                        <span>Real-time Data</span>
                      </div>
                    </div>
                    
                    {/* Formatted Output */}
                    <div className="space-y-4">
                      <div className="bg-gray-900/40 border border-gray-600/30 rounded-xl p-6">
                        <pre className="text-gray-100 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto selection:bg-cyan-500/20">
                          {output}
                        </pre>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-600/30">
                        <button 
                          onClick={() => navigator.clipboard.writeText(output)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
                        >
                          <span>📋</span>
                          <span className="text-sm">Copy Analysis</span>
                        </button>
                        <button 
                          onClick={() => {
                            setSavedAnalyses([...savedAnalyses, `${token} - ${new Date().toLocaleDateString()}: ${output}`]);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
                        >
                          <span>💾</span>
                          <span className="text-sm">Save Report</span>
                        </button>
                        <button 
                          onClick={() => setShowHistory(!showHistory)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300"
                        >
                          <span>📊</span>
                          <span className="text-sm">View History ({savedAnalyses.length})</span>
                        </button>
                        <button 
                          onClick={handleSubmit}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600/50 to-blue-600/50 hover:from-cyan-500/50 hover:to-blue-500/50 border border-cyan-500/50 rounded-lg text-cyan-300 hover:text-white transition-all duration-300"
                        >
                          <span>🔄</span>
                          <span className="text-sm">Refresh Analysis</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mt-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
              <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-gray-700/50">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-blue-600/10"></div>
                <div className="relative px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/30">
                        <FaHistory className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Analysis History</h3>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        {savedAnalyses.length} saved
                      </span>
                    </div>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors duration-300"
                    >
                      <span className="text-gray-400 hover:text-white text-lg">✕</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {savedAnalyses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">No saved analyses yet</div>
                    <div className="text-gray-500 text-sm">Save your first analysis to see it here</div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {savedAnalyses.map((analysis, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-800/30 border border-gray-600/30 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-gray-400">
                            Analysis #{savedAnalyses.length - index}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigator.clipboard.writeText(analysis)}
                              className="text-gray-500 hover:text-cyan-400 transition-colors duration-300"
                              title="Copy to clipboard"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => {
                                const newAnalyses = savedAnalyses.filter((_, i) => i !== index);
                                setSavedAnalyses(newAnalyses);
                              }}
                              className="text-gray-500 hover:text-red-400 transition-colors duration-300"
                              title="Delete analysis"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-200 text-sm bg-gray-900/40 rounded-lg p-3 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                            {analysis}
                          </pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {savedAnalyses.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setSavedAnalyses([])}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-300 hover:text-red-200 transition-all duration-300"
                    >
                      <span>🗑️</span>
                      <span className="text-sm">Clear All History</span>
                    </button>
                  </div>
                )}
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