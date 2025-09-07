'use client';

import { useState, useEffect } from 'react';
import { tradingAdvice } from '@/lib/ta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Bot, 
  TrendingUp, 
  BarChart3, 
  History, 
  Settings, 
  Copy, 
  Save, 
  Sparkles,
  ArrowLeft,
  Brain,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';

const mockPrices = [
  { symbol: 'BTC', price: '28,450.23', change: '+1.2%', trend: 'up' },
  { symbol: 'ETH', price: '1,850.15', change: '-0.4%', trend: 'down' },
  { symbol: 'SOL', price: '24.50', change: '+3.8%', trend: 'up' },
  { symbol: 'BNB', price: '320.10', change: '+0.7%', trend: 'up' },
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

  const chains = [
    'Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon',
    'Avalanche', 'Arbitrum', 'Optimism', 'Somnia Blockchain'
  ];
  const sectors = [
    'DeFi', 'NFT', 'GameFi', 'Infrastructure', 'DAO', 'SocialFi', 'Memecoin'
  ];
  const models = [
    { label: 'Gemma-7B (Fast)', value: 'gemma2-9b-it', description: 'Quick analysis for immediate insights' },
    { label: 'LLaMA3.3-70B (Advanced)', value: 'llama-3.3-70b-versatile', description: 'Deep analysis with complex reasoning' },
    { label: 'Kimi K2 (Financial)', value: 'moonshotai/kimi-k2-instruct', description: 'Specialized for financial markets' },
  ];

  // Real-time price updates
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
            price: newPrice.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','),
            change: `${changePercent > 0 ? '+' : ''}${changePercent}%`,
            trend: changePercent > 0 ? 'up' : 'down'
          };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !chain || !sector || loading) return;
    
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
      setOutput('⚠️ Unable to generate analysis. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-4 w-px bg-border" />
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                AI Trading Assistant
              </h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History ({savedAnalyses.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 overflow-hidden">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Sidebar */}
          <div className="col-span-12 xl:col-span-3 space-y-6">
            {/* Market Overview */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Prices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prices.map(({ symbol, price, change, trend }) => (
                  <div key={symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-semibold">{symbol}</div>
                      <div className="text-sm text-muted-foreground">${price}</div>
                    </div>
                    <div className={`text-sm font-bold ${
                      trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {change}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">💡 Better Analysis</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Add your own market observations for more personalized insights
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">📊 Model Selection</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Use LLaMA for complex strategies, Gemma for quick insights
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 xl:col-span-9 flex flex-col min-h-0">
            {/* Configuration Form */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Analysis Setup
                </CardTitle>
                <p className="text-muted-foreground">
                  Configure your trading analysis parameters for AI-powered insights
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Token/Asset</label>
                      <Input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="e.g., Bitcoin, Ethereum"
                        className="w-full h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Blockchain</label>
                      <select
                        value={chain}
                        onChange={(e) => setChain(e.target.value)}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        {chains.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sector</label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        {sectors.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI Model</label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {models.map((m) => (
                          <option key={m.value} value={m.value} title={m.description}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Analysis */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Market Analysis (Optional)</label>
                    <textarea
                      value={analysis}
                      onChange={(e) => setAnalysis(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Share your thoughts on current market conditions, technical patterns, or any specific insights you'd like the AI to consider..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 items-center">
                    <Button
                      type="submit"
                      disabled={loading || !token || !chain || !sector}
                      className="gap-2 h-11 px-8"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Analysis
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground flex-1">
                      {models.find(m => m.value === model)?.description}
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            {output && (
              <Card className="flex-1 min-h-0 flex flex-col mt-6">
                <CardHeader className="flex-shrink-0 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      AI Analysis Results
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const timestamp = new Date().toLocaleDateString();
                          setSavedAnalyses(prev => [...prev, `${token} (${timestamp}): ${output}`]);
                        }}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Based on {token} analysis using {models.find(m => m.value === model)?.label}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                  <div className="h-full min-h-[400px] max-h-[500px] overflow-y-auto border rounded-lg bg-muted/30">
                    <div className="p-4">
                      <pre className="text-sm whitespace-pre-wrap leading-relaxed text-foreground font-mono">
                        {output}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className="fixed inset-y-0 right-0 w-1/3 min-w-96 max-w-lg bg-card border-l shadow-2xl z-50">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                <h3 className="text-lg font-semibold">Analysis History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {savedAnalyses.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg">No saved analyses yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Generate your first analysis to see it here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedAnalyses.map((analysis, index) => {
                        const [title, content] = analysis.split(': ');
                        return (
                          <Card key={index} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="text-sm font-medium mb-2">{title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-4 mb-3">
                              {content?.substring(0, 200)}...
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(content)}
                                className="h-8 px-3 text-xs"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSavedAnalyses([])}
                          className="w-full"
                        >
                          Clear All History
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
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