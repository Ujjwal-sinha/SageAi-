import Link from 'next/link';
import { NewsArticle } from '@/lib/services/web3NewsService';
import { Brain, TrendingUp, ExternalLink, Calendar, Tag } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  darkMode: boolean;
}

export default function NewsCard({ article, darkMode }: NewsCardProps) {
  return (
    <div className="glass-card border border-cyan-500/20 hover:border-cyan-500/40 hover:neon-glow-cyan transition-all duration-500 hover-lift rounded-2xl overflow-hidden group relative">
      {/* Holographic overlay */}
      <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
      
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 rounded-full glass border border-cyan-500/30 text-cyan-400 text-xs font-cyber tracking-wider">
            {article.category || 'WEB3'}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-cyber">
            <Calendar className="w-3 h-3" />
            {article.date}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-display text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-glow transition-all flex items-start gap-2"
          >
            {article.title}
            <ExternalLink className="w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {article.excerpt}
        </p>
        
        {/* AI Insights */}
        {article.aiSummary && (
          <div className="mb-4 p-4 glass rounded-xl border border-cyan-500/20 hover-glow">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-cyber text-cyan-400 tracking-wider">AI SUMMARY</span>
            </div>
            <p className="text-sm text-gray-300 italic leading-relaxed">{article.aiSummary}</p>
          </div>
        )}
        
        {article.aiAnalysis && (
          <div className="mb-6 p-4 glass rounded-xl border border-purple-500/20 hover-glow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs font-cyber text-purple-400 tracking-wider">AI ANALYSIS</span>
            </div>
            <p className="text-sm text-gray-300 italic leading-relaxed">{article.aiAnalysis}</p>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-cyber tracking-wide">
            {article.source}
          </span>
          <div className="flex gap-2">
            {article.entities?.map((entity, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full glass border border-gray-600 text-gray-400 font-cyber"
              >
                {entity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}