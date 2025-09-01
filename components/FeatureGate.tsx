"use client";

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Lock, Coins, ExternalLink, RefreshCw } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useCredits';
import { useWallet } from '@/hooks/useWallet';
import { FeatureType } from '@/lib/services/creditService';

interface FeatureGateProps {
  feature: FeatureType;
  children: ReactNode;
  fallback?: ReactNode;
  showPreview?: boolean;
  className?: string;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showPreview = true,
  className = '' 
}: FeatureGateProps) {
  const { hasAccess, requiredCredits, currentCredits, loading, refreshAccess } = useFeatureAccess(feature);
  const { isConnected, connectWallet, isConnecting, error: walletError } = useWallet();

  const featureNames: Record<FeatureType, string> = {
    [FeatureType.CHATBOT]: 'AI Chatbot',
    [FeatureType.SMART_CONTRACT_GENERATOR]: 'Smart Contract Generator',
    [FeatureType.TRADE_ASSISTANT]: 'AI Trading Assistant',
    [FeatureType.ASK_PEOPLE]: 'Ask Crypto Experts',
    [FeatureType.AI_NFT_GENERATOR]: 'AI NFT Generator',
    [FeatureType.BLOCKCHAIN_ARCHITECT]: 'Blockchain Architect',
    [FeatureType.DEFI_PROTOCOL_DESIGNER]: 'DeFi Protocol Designer',
    [FeatureType.TOKEN_DESIGNER]: 'Token Designer',
    [FeatureType.NEWS_AI_INSIGHTS]: 'News AI Insights',
    [FeatureType.PREMIUM_ANALYTICS]: 'Premium Analytics'
  };

  // If user has access, render the feature
  if (hasAccess && isConnected) {
    return <div className={className}>{children}</div>;
  }

  // If a custom fallback is provided, use it
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }

  // Default access denied UI
  return (
    <div className={`${className} flex items-center justify-center min-h-[400px] p-4`}>
      <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl text-white">
            {featureNames[feature]} Access Required
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <Alert className="border-blue-500/20 bg-blue-500/10">
                <Wallet className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-100">
                  Connect your wallet to check your credit balance and access this feature.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
              
              {walletError && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertDescription className="text-red-100">
                    {walletError}
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-100">
                  <Coins className="w-3 h-3 mr-1" />
                  Insufficient Credits
                </Badge>
                
                <div className="text-sm text-gray-300">
                  <div>Required: <span className="text-white font-semibold">{requiredCredits} UTK</span></div>
                  <div>Your Balance: <span className="text-white font-semibold">{currentCredits} UTK</span></div>
                  <div className="text-red-400 mt-1">
                    Need {(requiredCredits - currentCredits).toFixed(2)} more UTK
                  </div>
                </div>
              </div>

              <Alert className="border-yellow-500/20 bg-yellow-500/10">
                <Coins className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-100">
                  You need more UtilityToken (UTK) credits to access this feature. 
                  Purchase or earn more tokens to unlock this functionality.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={refreshAccess} 
                  disabled={loading}
                  variant="outline"
                  className="flex-1 border-gray-600 hover:bg-gray-800"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                
                <Button 
                  onClick={() => window.open('/pricing', '_blank')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Credits
                </Button>
              </div>
            </>
          )}

          {showPreview && (
            <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400 mb-2">Feature Preview:</div>
              <div className="text-sm text-gray-300">
                {featureNames[feature]} provides advanced AI-powered capabilities for blockchain development and analysis.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FeatureGate; 