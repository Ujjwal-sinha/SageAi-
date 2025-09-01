import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import pRetry from 'p-retry';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// Define the path for caching articles
const CACHE_FILE = path.join(process.cwd(), 'cache', 'articles.json');

// Ensure the cache directory exists
async function ensureCacheDir() {
  const cacheDir = path.dirname(CACHE_FILE);
  try {
    await fs.mkdir(cacheDir, { recursive: true });
  } catch (err: any) {
    console.error('Failed to create cache directory:', err.message);
  }
}

// Helper functions to read/write cache
async function readCache(): Promise<NewsArticle[]> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return [];
    }
    console.error('Failed to read cache:', err.message);
    return [];
  }
}

async function writeCache(articles: NewsArticle[]): Promise<void> {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(articles, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('Failed to write cache:', err.message);
  }
}

export interface NewsArticle {
  id: string;
  source: string;
  title: string;
  url: string;
  excerpt: string;
  date: string;
  category?: string;
  aiSummary?: string;
  aiAnalysis?: string;
  entities?: string[];
}

// Initialize ChatGroq with your API key
const grok = new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: 'mistral-saba-24b', // A suitable model for text generation
});

// Define prompt templates for summary and analysis
const summaryPrompt = ChatPromptTemplate.fromTemplate(
  `Summarize the following news article in 100 characters or less:

Title: {title}
Excerpt: {excerpt}

Summary:`
);

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  `Provide a brief analysis of the following news article, focusing on its implications for Web3. Keep it under 150 characters:

Title: {title}
Excerpt: {excerpt}

Analysis:`
);

async function generateAIInsights(title: string, excerpt: string): Promise<{ aiSummary: string; aiAnalysis: string }> {
  try {
    // Generate summary
    const summaryChain = summaryPrompt.pipe(grok);
    const summaryResponse = await summaryChain.invoke({ title, excerpt });
    const aiSummary = summaryResponse.content.toString().trim();

    // Generate analysis
    const analysisChain = analysisPrompt.pipe(grok);
    const analysisResponse = await analysisChain.invoke({ title, excerpt });
    const aiAnalysis = analysisResponse.content.toString().trim();

    return {
      aiSummary: aiSummary.length > 100 ? aiSummary.slice(0, 97) + '...' : aiSummary,
      aiAnalysis: aiAnalysis.length > 150 ? aiAnalysis.slice(0, 147) + '...' : aiAnalysis,
    };
  } catch (err: any) {
    console.error('Failed to generate AI insights:', err.message);
    // Fallback to default insights if Grok API fails
    return {
      aiSummary: `Summary: ${excerpt.slice(0, 97)}...`,
      aiAnalysis: `Analysis: This article highlights ${title.includes('DeFi') ? 'decentralized finance trends' : 'Web3 developments'}.`,
    };
  }
}

// Function to dynamically assign a category based on content
function assignCategory(title: string, excerpt: string): string {
  const content = (title + ' ' + excerpt).toLowerCase();
  if (content.includes('defi') || content.includes('decentralized finance')) return 'DeFi';
  if (content.includes('nft') || content.includes('non-fungible token')) return 'NFTs';
  if (content.includes('regulation') || content.includes('regulatory')) return 'Regulation';
  if (content.includes('dao') || content.includes('decentralized autonomous organization')) return 'DAOs';
  if (content.includes('gaming') || content.includes('gamefi')) return 'Gaming';
  if (content.includes('layer 2') || content.includes('l2')) return 'Layer 2';
  return 'Web3'; // Default category
}

async function scrapeWeb3News(): Promise<NewsArticle[]> {
  const parser = new Parser();
  const sources = [
    { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml', name: 'CoinDesk' },
    { url: 'https://cointelegraph.com/rss', name: 'CoinTelegraph' },
    { url: 'https://crypto.news/feed/', name: 'Crypto.News' },
    { url: 'https://www.theblock.co/rss', name: 'The Block' },
    { url: 'https://decrypt.co/feed', name: 'Decrypt' },
  ];

  const articles: NewsArticle[] = [];
  const seenUrls = new Set<string>(); // For deduplication

  await ensureCacheDir();

  try {
    const scrapedArticles: { title: string; url: string; source: string; excerpt: string; date: string }[] = [];

    // Fetch articles from all sources
    for (const source of sources) {
      try {
        const feed = await pRetry(
          async () => parser.parseURL(source.url),
          { retries: 3, minTimeout: 1000, maxTimeout: 5000 }
        );

        const items = feed.items.map((item) => ({
          title: item.title || 'No title available',
          url: item.link || '',
          source: source.name,
          excerpt: item.contentSnippet || item.content || 'No excerpt available',
          date: item.isoDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));

        // Add to scraped articles if URL hasn't been seen
        items.forEach((item) => {
          if (!seenUrls.has(item.url)) {
            seenUrls.add(item.url);
            scrapedArticles.push(item);
          }
        });
      } catch (err: any) {
        console.error(`Failed to fetch from ${source.name}:`, err.message);
      }
    }

    console.log('Scraped Articles:', scrapedArticles);

    const validArticles = await Promise.all(
      scrapedArticles
        .filter((article) => article.title !== 'No title available' && article.url && article.source !== 'Unknown')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
        .slice(0, 25) // Limit to 25 articles
        .map(async (article): Promise<NewsArticle> => {
          const category = assignCategory(article.title, article.excerpt); // Dynamically assign category
          const { aiSummary, aiAnalysis } = article.title !== 'No title available' && article.excerpt !== 'No excerpt available'
            ? await generateAIInsights(article.title, article.excerpt)
            : { aiSummary: '', aiAnalysis: '' };

          return {
            id: `${article.source}-${uuidv4()}`,
            source: article.source,
            title: article.title,
            url: article.url,
            excerpt: article.excerpt,
            date: article.date,
            category, // Use the dynamically assigned category
            entities: ['Web3', article.source],
            aiSummary,
            aiAnalysis,
          };
        })
    );

    console.log('Valid Articles:', validArticles);

    if (!validArticles.length) {
      const cachedArticles = await readCache();
      if (cachedArticles.length) {
        console.log('Returning cached articles:', cachedArticles);
        return cachedArticles;
      }
      throw new Error('No valid articles fetched from any source and no cached articles available');
    }

    articles.push(...validArticles);
    await writeCache(articles);
  } catch (err: any) {
    console.error('Error in scrapeWeb3News:', {
      message: err.message,
      stack: err.stack,
    });
    const cachedArticles = await readCache();
    if (cachedArticles.length) {
      console.log('Returning cached articles on error:', cachedArticles);
      return cachedArticles;
    }
    throw err;
  }

  return articles;
}

export async function GET() {
  console.log('API route /api/news hit');
  try {
    const articles = await scrapeWeb3News();
    console.log('Articles fetched:', articles.length);
    return NextResponse.json(articles);
  } catch (err: any) {
    console.error('News fetch error:', { message: err.message, stack: err.stack });
    return NextResponse.json({ error: `Failed to fetch news: ${err.message}` }, { status: 500 });
  }
}