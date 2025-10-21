export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: number;
  change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  rank: number;
  logo?: string;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  change_percentage_24h: number;
  price: number;
  rank: number;
  logo?: string;
}

export interface AICoin {
  id: string;
  name: string;
  symbol: string;
  change_percentage_24h: number;
  price: number;
  rank: number;
  logo?: string;
  category: string;
}

class CryptoService {
  private async makeRequest(type: string, limit: number = 10): Promise<any> {
    try {
      const response = await fetch(`/api/crypto?type=${type}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn(`Crypto API request failed for ${type}, using fallback data:`, error);
      return null;
    }
  }

  async getTopCryptos(limit: number = 10): Promise<CryptoPrice[]> {
    try {
      const data = await this.makeRequest('top', limit);

      if (!data || !data.data) {
        return this.getFallbackTopCryptos();
      }

      return data.data.map((crypto: any) => ({
        id: crypto.id.toString(),
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        change_24h: crypto.quote.USD.volume_change_24h,
        change_percentage_24h: crypto.quote.USD.percent_change_24h,
        market_cap: crypto.quote.USD.market_cap,
        volume_24h: crypto.quote.USD.volume_24h,
        rank: crypto.cmc_rank,
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
      }));
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      return this.getFallbackTopCryptos();
    }
  }

  async getTrendingCoins(limit: number = 5): Promise<TrendingCoin[]> {
    try {
      const data = await this.makeRequest('trending', limit);

      if (!data || !data.data) {
        return this.getFallbackTrendingCoins();
      }

      return data.data.map((crypto: any) => ({
        id: crypto.id.toString(),
        name: crypto.name,
        symbol: crypto.symbol,
        change_percentage_24h: crypto.quote.USD.percent_change_24h,
        price: crypto.quote.USD.price,
        rank: crypto.cmc_rank,
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
      }));
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return this.getFallbackTrendingCoins();
    }
  }

  async getAICoins(limit: number = 5): Promise<AICoin[]> {
    try {
      const data = await this.makeRequest('ai', limit);

      if (!data || !data.data) {
        return this.getFallbackAICoins();
      }

      const allCoins: AICoin[] = [];
      Object.values(data.data).forEach((crypto: any) => {
        allCoins.push({
          id: crypto.id.toString(),
          name: crypto.name,
          symbol: crypto.symbol,
          change_percentage_24h: crypto.quote.USD.percent_change_24h,
          price: crypto.quote.USD.price,
          rank: crypto.cmc_rank,
          logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png`,
          category: 'AI',
        });
      });

      // If no coins found, return fallback
      if (allCoins.length === 0) {
        return this.getFallbackAICoins();
      }

      // Sort by market cap and return top results
      return allCoins
        .sort((a, b) => a.rank - b.rank)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching AI coins:', error);
      return this.getFallbackAICoins();
    }
  }

  private getFallbackTopCryptos(): CryptoPrice[] {
    // Return empty array when API fails - no hardcoded data
    return [];
  }

  private getFallbackTrendingCoins(): TrendingCoin[] {
    // Return empty array when API fails - no hardcoded data
    return [];
  }

  private getFallbackAICoins(): AICoin[] {
    // Return empty array when API fails - no hardcoded data
    return [];
  }

  formatPrice(price: number): string {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  }
}

export const cryptoService = new CryptoService();
