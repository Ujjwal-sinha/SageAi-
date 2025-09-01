import axios from 'axios';

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

export async function scrapeWeb3News(): Promise<NewsArticle[]> {
  try {
    const response = await axios.get('/api/news');
    return response.data;
  } catch (err: any) {
    console.error('API fetch error:', {
      message: err.message,
      status: err.response?.status,
    });
    throw new Error(`Failed to fetch news from API: ${err.message}`);
  }
}