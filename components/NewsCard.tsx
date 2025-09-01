import Link from 'next/link';
import { NewsArticle } from '@/lib/services/web3NewsService';

interface NewsCardProps {
  article: NewsArticle;
  darkMode: boolean;
}

export default function NewsCard({ article, darkMode }: NewsCardProps) {
  return (
    <div
      className={`p-5 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {article.category || 'Web3'}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {article.date}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-2">
        <Link
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {article.title}
        </Link>
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
        {article.excerpt}
      </p>
      {article.aiSummary && (
        <p className={`text-sm italic ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          <strong>AI Summary:</strong> {article.aiSummary}
        </p>
      )}
      {article.aiAnalysis && (
        <p className={`text-sm italic ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
          <strong>AI Analysis:</strong> {article.aiAnalysis}
        </p>
      )}
      <div className="flex justify-between items-center">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {article.source}
        </span>
        <div className="flex gap-2">
          {article.entities?.map((entity, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {entity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}