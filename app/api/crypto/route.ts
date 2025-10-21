import { NextRequest, NextResponse } from 'next/server';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'top';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!COINMARKETCAP_API_KEY) {
    return NextResponse.json({ error: 'CoinMarketCap API key not configured' }, { status: 500 });
  }

  try {
    let endpoint = '';
    let params: Record<string, string> = {};

    switch (type) {
      case 'top':
        endpoint = '/cryptocurrency/listings/latest';
        params = {
          start: '1',
          limit: limit.toString(),
          convert: 'USD',
          sort: 'market_cap',
          sort_dir: 'desc',
        };
        break;
      case 'trending':
        endpoint = '/cryptocurrency/trending/most-visited';
        params = {
          limit: limit.toString(),
          time_period: '24h',
          convert: 'USD',
        };
        break;
      case 'ai':
        // For AI coins, we'll search for specific AI-related cryptocurrencies
        endpoint = '/cryptocurrency/quotes/latest';
        params = {
          symbol: 'FET,AGIX,OCEAN,RNDR,GRT',
          convert: 'USD',
        };
        break;
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 });
  }
}
