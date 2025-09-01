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

const Web3NewsContent = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null); // Start as null to indicate uninitialized
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if we're on the client

  const categories = ['all', 'DeFi', 'NFTs', 'Regulation', 'DAOs', 'Gaming', 'Layer 2'];

  useEffect(() => {
    // Set client flag and initialize darkMode
    setIsClient(true);

    // Initialize darkMode on client only
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
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

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    console.log('Filtered News:', filtered);
    return filtered;
  }, [news, debouncedSearchQuery, activeCategory]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render until darkMode is initialized and we're on the client
  if (!isClient || darkMode === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-medium text-gray-600">Loading BlockSynth AI...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out ${
          darkMode ? 'bg-gray-800/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
        } border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col shadow-lg`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <Link href="/">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              BlockSynth AI
            </span>
            </Link>
          </h1>
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div className="relative">
            <FiSearch
              className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl ${
                darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
              aria-label="Search news articles"
            />
          </div>
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  activeCategory === category
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-700'
                } transition-all duration-200`}
                aria-pressed={activeCategory === category}
              >
                <FiFilter size={16} />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-5 border-t border-gray-700">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition-all duration-200`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header
          className={`sticky top-0 z-10 p-4 ${
            darkMode ? 'bg-gray-800/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'
          } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between md:justify-end shadow-sm`}
        >
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold md:hidden">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                BlockSynth AI
              </span>
            </h1>
            <button
              onClick={refreshNews}
              disabled={loading}
              className={`p-2 rounded-full ${
                loading ? 'animate-spin' : 'hover:scale-110'
              } ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-transform duration-200`}
              aria-label="Refresh news"
            >
              <FiRefreshCw size={20} />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 flex-1">
          {error && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
              } border shadow-sm animate-fade-in`}
              role="alert"
            >
              <p className={`${darkMode ? 'text-red-300' : 'text-red-700'} font-medium`}>{error}</p>
              <button
                onClick={refreshNews}
                className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} animate-pulse shadow-md`}
                >
                  <div className={`h-6 w-1/3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}></div>
                  <div className={`h-5 w-full rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
                  <div className={`h-5 w-5/6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}></div>
                  <div className={`h-5 w-2/3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}></div>
                  <div className={`h-4 w-1/4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} darkMode={darkMode} />
              ))}
            </div>
          ) : (
            <div
              className={`p-8 text-center rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md animate-fade-in`}
            >
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg font-medium`}>
                No news found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
              >
                Show All News
              </button>
            </div>
          )}
        </main>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white transition-all duration-200 hover:scale-110`}
            aria-label="Scroll to top"
          >
            <FiArrowUp size={20} />
          </button>
        )}

        {/* Footer */}
        <footer
          className={`p-4 text-center text-sm ${
            darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
          } border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner`}
        >
          <p>© {new Date().getFullYear()} BlockSynth AI. All rights reserved.</p>
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