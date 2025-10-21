'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { useCredits } from '@/hooks/useCredits';
import { web3Service } from '@/lib/web3';
import { creditService, FeatureType } from '@/lib/services/creditService';
import { tokenClaimService } from '@/lib/services/tokenClaimService';
import { featureTestService } from '@/lib/services/featureTestService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Coins, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Zap, 
  Bot, 
  FileText, 
  TrendingUp, 
  Users, 
  Image, 
  Building, 
  Layers, 
  CircleDollarSign, 
  Newspaper, 
  BarChart3,
  Gift
} from 'lucide-react';

const CLAIM_AMOUNT = 100; // UTK tokens to claim
const FEATURES = [
  {
    type: FeatureType.CHATBOT,
    name: 'AI Chatbot',
    description: 'Interactive AI assistant for blockchain queries',
    icon: Bot,
    color: 'bg-blue-500'
  },
  {
    type: FeatureType.SMART_CONTRACT_GENERATOR,
    name: 'Smart Contract Generator',
    description: 'Generate smart contracts with AI assistance',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    type: FeatureType.TRADE_ASSISTANT,
    name: 'Trade Assistant',
    description: 'AI-powered trading insights and analysis',
    icon: TrendingUp,
    color: 'bg-yellow-500'
  },
  {
    type: FeatureType.ASK_PEOPLE,
    name: 'Ask People',
    description: 'Community-driven Q&A platform',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    type: FeatureType.AI_NFT_GENERATOR,
    name: 'AI NFT Generator',
    description: 'Create NFTs with AI assistance',
    icon: Image,
    color: 'bg-pink-500'
  },
  {
    type: FeatureType.BLOCKCHAIN_ARCHITECT,
    name: 'Blockchain Architect',
    description: 'Design blockchain solutions',
    icon: Building,
    color: 'bg-indigo-500'
  },
  {
    type: FeatureType.DEFI_PROTOCOL_DESIGNER,
    name: 'DeFi Protocol Designer',
    description: 'Design DeFi protocols and strategies',
    icon: Layers,
    color: 'bg-cyan-500'
  },
  {
    type: FeatureType.TOKEN_DESIGNER,
    name: 'Token Designer',
    description: 'Design and deploy custom tokens',
    icon: CircleDollarSign,
    color: 'bg-orange-500'
  },
  {
    type: FeatureType.NEWS_AI_INSIGHTS,
    name: 'News AI Insights',
    description: 'AI-powered news analysis and insights',
    icon: Newspaper,
    color: 'bg-red-500'
  },
  {
    type: FeatureType.PREMIUM_ANALYTICS,
    name: 'Premium Analytics',
    description: 'Advanced blockchain analytics and reporting',
    icon: BarChart3,
    color: 'bg-gray-500'
  }
];

export default function ClaimPage() {
  const { address, isConnected, connectWallet, isConnecting, error: walletError } = useWallet();
  const { credits, loading: creditsLoading, refreshCredits, formatCredits } = useCredits();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [featureAccess, setFeatureAccess] = useState<Record<string, any>>({});
  const [testingFeature, setTestingFeature] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Check feature access when credits change
  useEffect(() => {
    if (address && isConnected) {
      checkAllFeatureAccess();
    }
  }, [address, isConnected, credits]);

  const checkAllFeatureAccess = async () => {
    const access: Record<string, any> = {};
    for (const feature of FEATURES) {
      try {
        const accessInfo = await creditService.checkFeatureAccess(address!, feature.type);
        access[feature.type] = accessInfo;
      } catch (error) {
        console.error(`Error checking access for ${feature.type}:`, error);
        access[feature.type] = {
          hasAccess: false,
          requiredCredits: creditService.getRequiredCredits(feature.type),
          currentCredits: credits,
          feature: feature.type
        };
      }
    }
    setFeatureAccess(access);
  };

  const handleClaimTokens = async () => {
    if (!address || !isConnected) {
      setClaimError('Please connect your wallet first');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);
    setClaimSuccess(false);

    try {
      // Check if user is eligible to claim
      const eligibility = await tokenClaimService.checkClaimEligibility(address);
      if (!eligibility.canClaim) {
        setClaimError(eligibility.reason || 'You are not eligible to claim tokens');
        return;
      }

      // Get user's signer from MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Claim tokens using user's wallet
        const result = await tokenClaimService.claimTokens(address, signer);
        
        if (result.success) {
          // Refresh credits after claiming
          await refreshCredits();
          setClaimSuccess(true);
        } else {
          setClaimError(result.error || 'Failed to claim tokens');
        }
      } else {
        setClaimError('Please install MetaMask');
      }
    } catch (error: any) {
      setClaimError(error.message || 'Failed to claim tokens');
    } finally {
      setIsClaiming(false);
    }
  };

  const testFeature = async (featureType: FeatureType) => {
    if (!address) return;
    
    setTestingFeature(featureType);
    try {
      const result = await featureTestService.testFeature(address, featureType);
      
      setTestResults(prev => ({
        ...prev,
        [featureType]: result
      }));
      
      // Refresh credits after testing (simulate credit consumption)
      if (result.success) {
        await refreshCredits();
      }
    } catch (error) {
      console.error('Error testing feature:', error);
      setTestResults(prev => ({
        ...prev,
        [featureType]: {
          success: false,
          message: 'Failed to test feature'
        }
      }));
    } finally {
      setTestingFeature(null);
    }
  };

  const getFeatureIcon = (featureType: FeatureType) => {
    const feature = FEATURES.find(f => f.type === featureType);
    return feature ? feature.icon : Bot;
  };

  const getFeatureColor = (featureType: FeatureType) => {
    const feature = FEATURES.find(f => f.type === featureType);
    return feature ? feature.color : 'bg-gray-500';
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="glass-strong border border-cyan-500/20 neon-glow-blue rounded-2xl p-8 backdrop-blur-3xl">
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 btn-holographic rounded-2xl flex items-center justify-center mb-6 hover-glow">
                  <Wallet className="w-10 h-10 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-display text-holographic mb-3">
                  Connect Your Wallet
                </h1>
                <p className="text-gray-300 text-lg">
                  Connect your wallet to claim UTK tokens and access our AI-powered blockchain services
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={connectWallet} 
                  disabled={isConnecting}
                  className="w-full btn-holographic font-bold text-lg py-4 hover-lift relative overflow-hidden group"
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Connect Wallet
                      </>
                    )}
                  </span>
                </Button>
                
                {walletError && (
                  <div className="glass border border-red-500/30 neon-glow-red rounded-xl p-4">
                    <div className="flex items-center gap-3 text-red-400">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">{walletError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 btn-holographic rounded-2xl flex items-center justify-center hover-glow">
              <Gift className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-5xl font-display text-holographic mb-2">
                Claim UTK Tokens
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get free UTK tokens to test and access our AI-powered blockchain services
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="claim" className="space-y-8">
          <div className="flex justify-center">
            <div className="glass border border-cyan-500/20 neon-glow-blue rounded-2xl p-2 backdrop-blur-3xl">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value="claim" 
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:neon-glow-cyan text-gray-300 hover:text-white transition-all duration-300"
                >
                  Claim Tokens
                </TabsTrigger>
                <TabsTrigger 
                  value="services"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:neon-glow-purple text-gray-300 hover:text-white transition-all duration-300"
                >
                  Test Services
                </TabsTrigger>
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:neon-glow-green text-gray-300 hover:text-white transition-all duration-300"
                >
                  Feature Access
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Claim Tokens Tab */}
          <TabsContent value="claim" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Claim Card */}
              <div className="glass-strong border border-green-500/20 neon-glow-green rounded-2xl p-8 backdrop-blur-3xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                      <Gift className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display text-holographic">Claim Free Tokens</h3>
                      <p className="text-gray-300">Get {CLAIM_AMOUNT} UTK tokens to start using our services</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="glass border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Claim Amount</p>
                        <p className="text-3xl font-bold text-green-400">{CLAIM_AMOUNT} UTK</p>
                      </div>
                      <div className="w-16 h-16 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                        <Coins className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleClaimTokens}
                    disabled={isClaiming || claimSuccess}
                    className="w-full btn-holographic font-bold text-lg py-4 hover-lift relative overflow-hidden group"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isClaiming ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Claiming Tokens...
                        </>
                      ) : claimSuccess ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Tokens Claimed!
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Claim Tokens
                        </>
                      )}
                    </span>
                  </Button>

                  {claimError && (
                    <div className="glass border border-red-500/30 neon-glow-red rounded-xl p-4">
                      <div className="flex items-center gap-3 text-red-400">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">{claimError}</span>
                      </div>
                    </div>
                  )}

                  {claimSuccess && (
                    <div className="glass border border-green-500/30 neon-glow-green rounded-xl p-4">
                      <div className="flex items-center gap-3 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          Successfully claimed {CLAIM_AMOUNT} UTK tokens! You can now access our services.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Balance Card */}
              <div className="glass-strong border border-blue-500/20 neon-glow-blue rounded-2xl p-8 backdrop-blur-3xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                      <Wallet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display text-holographic">Your Balance</h3>
                      <p className="text-gray-300">Current UTK token balance</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="glass border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">UTK Balance</p>
                        <p className="text-3xl font-bold text-blue-400">
                          {creditsLoading ? (
                            <RefreshCw className="w-8 h-8 animate-spin" />
                          ) : (
                            formatCredits(credits)
                          )}
                        </p>
                      </div>
                      <div className="w-16 h-16 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                        <Coins className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={refreshCredits}
                    disabled={creditsLoading}
                    variant="outline"
                    className="w-full glass border border-blue-500/30 text-blue-400 hover:neon-glow-blue hover:text-white transition-all duration-300"
                    size="lg"
                  >
                    {creditsLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Balance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Test Services Tab */}
          <TabsContent value="services" className="space-y-8">
            <div className="glass-strong border border-purple-500/20 neon-glow-purple rounded-2xl p-8 backdrop-blur-3xl">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-holographic">Test Our Services</h3>
                    <p className="text-gray-300">Try out our AI-powered blockchain services with your UTK tokens</p>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature) => {
                  const access = featureAccess[feature.type];
                  const Icon = feature.icon;
                  const canAccess = access?.hasAccess || false;
                  const isTesting = testingFeature === feature.type;

                  return (
                    <div 
                      key={feature.type} 
                      className={`glass border rounded-2xl p-6 backdrop-blur-3xl transition-all duration-300 relative overflow-hidden ${
                        canAccess 
                          ? 'border-cyan-500/30 hover:neon-glow-cyan hover:border-cyan-500/50 cursor-pointer hover-lift' 
                          : 'border-gray-500/20 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {canAccess ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-display text-lg text-holographic mb-2">{feature.name}</h3>
                          <p className="text-sm text-gray-300 mb-4">{feature.description}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Required:</span>
                            <span className="font-medium text-cyan-400">{access?.requiredCredits || 0} UTK</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Your Balance:</span>
                            <span className="font-medium text-blue-400">{formatCredits(access?.currentCredits || 0)} UTK</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => testFeature(feature.type)}
                          disabled={!canAccess || isTesting}
                          size="sm"
                          className={`w-full ${
                            canAccess 
                              ? 'btn-holographic hover-lift' 
                              : 'glass border border-gray-500/30 text-gray-500'
                          }`}
                        >
                          {isTesting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : canAccess ? (
                            'Test Service'
                          ) : (
                            'Insufficient Credits'
                          )}
                        </Button>

                        {/* Test Results */}
                        {testResults[feature.type] && (
                          <div className={`p-3 rounded-xl text-sm ${
                            testResults[feature.type].success 
                              ? 'glass border border-green-500/30 text-green-400' 
                              : 'glass border border-red-500/30 text-red-400'
                          }`}>
                            <div className="flex items-center gap-2">
                              {testResults[feature.type].success ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              <span className="font-medium">{testResults[feature.type].message}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Test Results */}
              {Object.keys(testResults).length > 0 && (
                <div className="mt-8 glass-strong border border-purple-500/20 neon-glow-purple rounded-2xl p-8 backdrop-blur-3xl">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display text-holographic">Test Results</h3>
                        <p className="text-gray-300">Detailed results from your feature tests</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {Object.entries(testResults).map(([featureType, result]) => {
                      const feature = FEATURES.find(f => f.type === featureType);
                      const Icon = feature?.icon || Bot;
                      
                      return (
                        <div key={featureType} className="glass border border-purple-500/30 rounded-2xl p-6 backdrop-blur-3xl">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-display text-lg text-holographic">{feature?.name || featureType}</h4>
                              <p className="text-sm text-gray-300">{feature?.description}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              result.success 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {result.success ? "Success" : "Failed"}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <p className="text-gray-300">{result.message}</p>
                            {result.data && (
                              <div className="glass border border-gray-500/30 rounded-xl p-4">
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </div>
                            )}
                            {result.creditsUsed && (
                              <p className="text-sm text-gray-400">
                                Credits used: <span className="text-cyan-400 font-medium">{result.creditsUsed} UTK</span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Feature Access Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="glass-strong border border-green-500/20 neon-glow-green rounded-2xl p-8 backdrop-blur-3xl">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-holographic">Feature Access Overview</h3>
                    <p className="text-gray-300">Detailed breakdown of your access to all features</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {FEATURES.map((feature) => {
                  const access = featureAccess[feature.type];
                  const Icon = feature.icon;
                  const canAccess = access?.hasAccess || false;
                  const progress = access ? (access.currentCredits / access.requiredCredits) * 100 : 0;

                  return (
                    <div key={feature.type} className="glass border border-green-500/30 rounded-2xl p-6 backdrop-blur-3xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 btn-holographic rounded-xl flex items-center justify-center hover-glow">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-display text-lg text-holographic">{feature.name}</h3>
                            <p className="text-sm text-gray-300">{feature.description}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                          canAccess 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {canAccess ? "Accessible" : "Locked"}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress to unlock</span>
                          <span className="text-cyan-400 font-medium">
                            {formatCredits(access?.currentCredits || 0)} / {access?.requiredCredits || 0} UTK
                          </span>
                        </div>
                        <div className="glass border border-gray-500/30 rounded-xl p-2">
                          <Progress 
                            value={Math.min(progress, 100)} 
                            className="h-3"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
