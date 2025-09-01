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
  const [token, setToken] = useState('');
  const [chain, setChain] = useState('');
  const [sector, setSector] = useState('');
  const [model, setModel] = useState('llama3-70b-8192');
  const [analysis, setAnalysis] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const chains = [
    'Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon',
    'Avalanche', 'Arbitrum', 'Optimism', 'BlockDag', 'Other',
  ];
  const sectors = [
    'DeFi', 'NFT', 'GameFi', 'Infrastructure', 'DAO', 'SocialFi', 'Memecoin', 'Other',
  ];
  const models = [
    { label: 'LLaMA3-70B', value: 'llama3-70b-8192' },
    { label: 'LLaMA3.3-70B', value: 'llama-3.3-70b-versatile' },
    { label: 'Gemma-7B', value: 'gemma2-9b-it' },
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
    <div className="min-h-screen flex bg-gradient-to-br from-black via-[#181a22] to-blue-950 text-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-br from-[#181a22] via-[#16181d] to-[#23232a] border-r border-[#23232a] flex flex-col shadow-2xl z-10">
        {/* Logo Section */}
        <div className="px-6 pt-8 pb-4">
          <Link href="/" className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-500 drop-shadow-lg" />
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight select-none">BlockSynth AI</span>
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col flex-grow px-6 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-200">
            <FaChartLine /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-[#23232a] hover:text-purple-300 transition-all duration-200">
            <FaWallet /> Portfolio
          </a>
          <a href="#" className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-[#23232a] hover:text-purple-300 transition-all duration-200">
            <FaHistory /> Trade History
          </a>
          <a href="#" className="flex items-center gap-3 py-3 px-5 rounded-xl hover:bg-[#23232a] hover:text-purple-300 transition-all duration-200">
            <FaCog /> Settings
          </a>
        </nav>
        {/* Footer */}
        <footer className="px-6 py-6 mt-auto text-xs text-gray-500 border-t border-[#23232a]">
          © {new Date().getFullYear()} BlockSynthAI. All rights reserved.
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full px-4 md:px-0 pt-10 pb-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-700/80 via-purple-700/80 to-black/90 rounded-b-3xl shadow-xl mb-6">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 drop-shadow-lg">Pro Crypto Trading Assistant</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-4">Get instant, AI-powered trading recommendations for any token, chain, or sector. Analyze, strategize, and trade smarter with BlockSynth AI.</p>
            <div className="flex flex-wrap gap-3 justify-center mb-2">
              <span className="px-4 py-2 rounded-full bg-blue-600/80 text-white font-medium text-sm shadow">Live Price Ticker</span>
              <span className="px-4 py-2 rounded-full bg-purple-600/80 text-white font-medium text-sm shadow">Multi-Chain Support</span>
              <span className="px-4 py-2 rounded-full bg-pink-600/80 text-white font-medium text-sm shadow">AI Analysis</span>
            </div>
          </div>
        </section>

        {/* Top Bar with Price Ticker */}
        <header className="flex items-center justify-between bg-[#181a22] border-b border-[#23232a] px-10 py-4 shadow-lg rounded-t-3xl">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text select-none tracking-tight flex items-center gap-2">
            <FaChartLine className="text-blue-400" /> Market Ticker
          </h2>
          <div className="flex space-x-6 overflow-x-auto no-scrollbar max-w-xl">
            {prices.map(({ symbol, price, change }) => (
              <motion.div
                key={symbol}
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                className={`flex flex-col items-center min-w-[90px] px-4 py-2 rounded-xl shadow border 
                  ${change.startsWith('+')
                    ? 'bg-gradient-to-br from-green-800/40 to-green-900/80 border-green-700/30 text-green-300'
                    : 'bg-gradient-to-br from-red-800/40 to-red-900/80 border-red-700/30 text-red-300'
                  }`}
              >
                <span className="font-bold text-lg">{symbol}</span>
                <span className="text-base font-mono">{price} USD</span>
                <span className="text-xs">{change}</span>
              </motion.div>
            ))}
          </div>
        </header>

        {/* Main Dashboard Area */}
        <section className="flex-grow overflow-y-auto p-6 md:p-10 space-y-10 bg-gradient-to-br from-black via-[#181a22] to-blue-950 rounded-3xl">
          {/* Input Form Card */}
          <motion.form
            layout
            onSubmit={e => {
              e.preventDefault();
              if (!loading && token && chain && sector) handleSubmit();
            }}
            className="bg-gradient-to-br from-[#181a22] via-[#23232a] to-[#181a22] rounded-2xl shadow-2xl p-8 md:p-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border border-[#23232a]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Token Name */}
            <div className="flex flex-col">
              <label htmlFor="token" className="mb-2 text-base font-semibold text-blue-300">Token Name</label>
              <input
                id="token"
                type="text"
                list="token-list"
                className="px-4 py-3 rounded-lg bg-black/80 border border-[#23232a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Bitcoin, Uniswap"
                value={token}
                onChange={e => setToken(e.target.value)}
                required
                autoComplete="off"
              />
              <datalist id="token-list">
                <option value="Bitcoin" />
                <option value="Ethereum" />
                <option value="Solana" />
                <option value="Uniswap" />
                <option value="Chainlink" />
              </datalist>
            </div>
            {/* Blockchain */}
            <div className="flex flex-col">
              <label htmlFor="chain" className="mb-2 text-base font-semibold text-blue-300">Blockchain</label>
              <select
                id="chain"
                className="px-4 py-3 rounded-lg bg-black/80 border border-[#23232a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={chain}
                onChange={e => setChain(e.target.value)}
                required
              >
                <option value="" disabled>Select Chain</option>
                {chains.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Sector */}
            <div className="flex flex-col">
              <label htmlFor="sector" className="mb-2 text-base font-semibold text-blue-300">Sector</label>
              <select
                id="sector"
                className="px-4 py-3 rounded-lg bg-black/80 border border-[#23232a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={sector}
                onChange={e => setSector(e.target.value)}
                required
              >
                <option value="" disabled>Select Sector</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {/* Model */}
            <div className="flex flex-col md:col-span-1">
              <label htmlFor="model" className="mb-2 text-base font-semibold text-blue-300">LLM Model</label>
              <select
                id="model"
                className="px-4 py-3 rounded-lg bg-black/80 border border-[#23232a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            {/* Analysis (full width) */}
            <div className="md:col-span-3 flex flex-col">
              <label htmlFor="analysis" className="mb-2 text-base font-semibold text-blue-300">Your Analysis (Optional)</label>
              <textarea
                id="analysis"
                rows={4}
                className="px-4 py-3 rounded-lg bg-black/80 border border-[#23232a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                placeholder="Add your own technical analysis, tokenomics notes, or market observations..."
                value={analysis}
                onChange={e => setAnalysis(e.target.value)}
              />
            </div>
            {/* Submit Button (full width) */}
            <div className="md:col-span-3 flex justify-center mt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: loading ? 1 : 1.06 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                disabled={loading || !token || !chain || !sector}
                className={`w-full max-w-md py-4 rounded-xl font-bold shadow-xl transition-all duration-200 text-lg
                  ${
                    loading
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 cursor-not-allowed opacity-70 text-gray-200'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white cursor-pointer'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Generating Analysis...</span>
                  </span>
                ) : (
                  'Get Trading Recommendation'
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Output Panel */}
          {output && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#181a22] via-[#23232a] to-[#181a22] border border-[#23232a] rounded-2xl p-8 max-w-5xl mx-auto max-h-[400px] overflow-y-auto font-mono text-base whitespace-pre-wrap text-gray-100 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                Trading Recommendation
              </h2>
              <pre>{output}</pre>
            </motion.section>
          )}
        </section>
      </main>
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
