'use client';

import NewsCard from '@/components/NewsCard';
import { scrapeWeb3News, NewsArticle } from '@/lib/services/web3NewsService';
import { FiSearch, FiRefreshCw, FiMenu, FiX, FiArrowUp, FiFilter } from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import pRetry from 'p-retry';
import Link from 'next/link';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { Brain, TrendingUp, Zap, Shield } from 'lucide-react';

const Web3NewsContent = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const categories = ['all', 'DeFi', 'NFTs', 'Regulation', 'DAOs', 'Gaming', 'Layer 2'];

  useEffect(() => {
    setIsClient(true);
    setDarkMode(true); // Force dark mode for Web3 aesthetic

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError('');
        const freshNews = await pRetry(scrapeWeb3News, {
          retries: 3,
          minTimeout: 1000,
          maxTimeout: 5000,
        });
        if (freshNews.length === 0) {
          throw new Error('No news items returned');
        }
        setNews(freshNews);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cachedNews', JSON.stringify(freshNews));
        }
      } catch (err: any) {
        console.error('News fetch error:', {
          message: err.message,
          stack: err.stack,
        });
        setError(`Failed to load news: ${err.message}. Please try refreshing or check your network connection.`);
        if (typeof window !== 'undefined') {
          const cachedNews = JSON.parse(localStorage.getItem('cachedNews') || '[]');
          setNews(cachedNews);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const refreshNews = async () => {
    try {
      setLoading(true);
      setError('');
      const freshNews = await pRetry(scrapeWeb3News, {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000,
      });
      if (freshNews.length === 0) {
        throw new Error('No news items returned');
      }
      setNews(freshNews);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cachedNews', JSON.stringify(freshNews));
      }
    } catch (err: any) {
      console.error('News refresh error:', {
        message: err.message,
        stack: err.stack,
      });
      setError(`Failed to refresh news: ${err.message}. Please try again or check your network connection.`);
      if (typeof window !== 'undefined') {
        const cachedNews = JSON.parse(localStorage.getItem('cachedNews') || '[]');
        setNews(cachedNews);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    const filtered = news.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (article.excerpt || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (article.entities || []).some((e) =>
          e.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      const matchesCategory =
        activeCategory === 'all' ||
        (article.category || 'Web3').toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
    return filtered;
  }, [news, debouncedSearchQuery, activeCategory]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isClient || darkMode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="loading-dots text-cyan-400 text-2xl">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="text-xl font-cyber text-cyan-400 tracking-wider">Loading Sage AI...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-10" />
        <div className="hex-pattern opacity-5" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="blockchain-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out glass-strong border-r border-cyan-500/20 flex flex-col neon-glow-purple`}
      >
        {/* Animated border */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-pulse" />
        
        <div className="p-8 flex items-center justify-between border-b border-cyan-500/20">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-white/5 transition-all duration-300 hover-lift">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="h-8 w-px bg-white/20" />
          </div>
          <h1 className="text-2xl font-display tracking-tight">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Brain className="w-8 h-8 text-cyan-400 group-hover:animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              </div>
              <span className="text-holographic group-hover:text-glow">
                Sage AI
              </span>
            </Link>
          </h1>
          <button
            className="md:hidden p-3 rounded-full glass border border-cyan-500/30 hover:neon-glow-cyan transition-all"
            onClick={toggleSidebar}
          >
            <FiX size={20} className="text-cyan-400" />
          </button>
        </div>
        
        <div className="p-8 flex-1 flex flex-col gap-6">
          {/* Enhanced search */}
          <div className="relative">
            <FiSearch className="absolute left-4 top-4 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Web3 news..."
              className="w-full pl-12 pr-4 py-4 rounded-xl glass border border-cyan-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-cyber"
            />
          </div>
          
          {/* Enhanced navigation */}
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 text-left px-6 py-4 rounded-xl text-sm font-cyber tracking-wider transition-all duration-300 hover-lift ${
                  activeCategory === category
                    ? 'btn-holographic border-2 border-cyan-500/50 neon-glow-cyan'
                    : 'glass border border-gray-700 hover:border-cyan-500/30 text-gray-300 hover:text-white'
                }`}
              >
                <FiFilter size={16} className={activeCategory === category ? 'text-cyan-400' : ''} />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-8 border-t border-cyan-500/20">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-cyber glass border border-cyan-500/30 text-cyan-400 hover:text-white hover:neon-glow-cyan transition-all"
          >
            🌙 CYBER MODE
          </button>
        </div>
      </aside>

      {/* Enhanced overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col md:ml-80">
        <header className="sticky top-0 z-10 p-6 glass backdrop-blur-sm border-b border-cyan-500/20 flex items-center justify-between md:justify-end neon-glow-cyan">
          <button
            className="md:hidden p-3 rounded-full glass border border-cyan-500/30 hover:neon-glow-cyan transition-all"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} className="text-cyan-400" />
          </button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display md:hidden text-holographic">
              Sage AI
            </h1>
            <button
              onClick={refreshNews}
              disabled={loading}
              className={`p-3 rounded-full glass border border-cyan-500/30 hover:neon-glow-cyan transition-all ${
                loading ? 'animate-spin' : 'hover-lift'
              }`}
            >
              <FiRefreshCw size={20} className="text-cyan-400" />
            </button>
          </div>
        </header>

        <main className="container-web3 p-8 flex-1">
          {/* Enhanced error display */}
          {error && (
            <div className="mb-8 glass-card border border-red-500/30 rounded-2xl p-6 bg-red-500/10 hover-glow animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-400 animate-pulse" />
                <h3 className="font-display text-red-400 text-lg">Connection Error</h3>
              </div>
              <p className="text-red-300 font-cyber mb-4">{error}</p>
              <button
                onClick={refreshNews}
                className="btn-holographic px-6 py-3 font-cyber tracking-wider hover-lift"
              >
                RETRY CONNECTION
              </button>
            </div>
          )}

          {/* Enhanced loading state */}
          {loading ? (
            <div className="web3-grid">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card border border-cyan-500/20 p-8 rounded-2xl loading-shimmer hover-lift"
                >
                  <div className="space-y-4">
                    <div className="h-6 w-1/3 rounded-full glass" />
                    <div className="h-5 w-full rounded-full glass" />
                    <div className="h-5 w-5/6 rounded-full glass" />
                    <div className="h-5 w-2/3 rounded-full glass" />
                    <div className="h-4 w-1/4 rounded-full glass" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="web3-grid animate-fade-in">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} darkMode={darkMode} />
              ))}
            </div>
          ) : (
            <div className="glass-card border border-cyan-500/20 rounded-3xl p-16 text-center hover-glow animate-fade-in">
              <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-6 animate-pulse" />
              <p className="text-gray-400 text-xl font-cyber tracking-wide mb-6">
                No news found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="btn-holographic px-8 py-4 font-cyber tracking-wider hover-lift"
              >
                SHOW ALL NEWS
              </button>
            </div>
          )}
        </main>

        {/* Enhanced Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 rounded-full glass-strong border border-cyan-500/30 neon-glow-cyan text-cyan-400 hover:text-white transition-all hover-lift z-50"
          >
            <FiArrowUp size={20} />
          </button>
        )}

        {/* Enhanced Footer */}
        <footer className="p-6 text-center text-sm glass border-t border-cyan-500/20 font-cyber tracking-wider">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-gray-400">© {new Date().getFullYear()} Sage AI. All rights reserved.</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function Web3News() {
  return (
    <FeatureGate feature={FeatureType.NEWS_AI_INSIGHTS}>
      <Web3NewsContent />
    </FeatureGate>
  );
}