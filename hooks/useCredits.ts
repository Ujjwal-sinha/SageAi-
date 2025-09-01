import { useState, useEffect, useCallback } from 'react';
import { creditService, FeatureType, FeatureAccess } from '@/lib/services/creditService';
import { useWallet } from './useWallet';

interface CreditsState {
  credits: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useCredits() {
  const { address, isConnected } = useWallet();
  const [creditsState, setCreditsState] = useState<CreditsState>({
    credits: 0,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const refreshCredits = useCallback(async () => {
    if (!address || !isConnected) {
      setCreditsState({
        credits: 0,
        loading: false,
        error: null,
        lastUpdated: null
      });
      return;
    }

    setCreditsState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const credits = await creditService.getUserCredits(address);
      setCreditsState({
        credits,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error: any) {
      setCreditsState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch credits'
      }));
    }
  }, [address, isConnected]);

  // Auto-refresh credits when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      refreshCredits();
    }
  }, [address, isConnected, refreshCredits]);

  const checkFeatureAccess = useCallback(async (feature: FeatureType): Promise<FeatureAccess> => {
    if (!address || !isConnected) {
      return {
        hasAccess: false,
        requiredCredits: creditService.getRequiredCredits(feature),
        currentCredits: 0,
        feature
      };
    }

    return await creditService.checkFeatureAccess(address, feature);
  }, [address, isConnected]);

  const checkMultipleFeatures = useCallback(async (features: FeatureType[]): Promise<FeatureAccess[]> => {
    if (!address || !isConnected) {
      return features.map(feature => ({
        hasAccess: false,
        requiredCredits: creditService.getRequiredCredits(feature),
        currentCredits: 0,
        feature
      }));
    }

    return await creditService.checkMultipleFeatures(address, features);
  }, [address, isConnected]);

  const formatCredits = useCallback((credits: number) => {
    return creditService.formatCredits(credits);
  }, []);

  return {
    ...creditsState,
    refreshCredits,
    checkFeatureAccess,
    checkMultipleFeatures,
    formatCredits,
    isWalletConnected: isConnected
  };
}

export function useFeatureAccess(feature: FeatureType) {
  const { address, isConnected } = useWallet();
  const [accessState, setAccessState] = useState<FeatureAccess>({
    hasAccess: false,
    requiredCredits: 0,
    currentCredits: 0,
    feature
  });
  const [loading, setLoading] = useState(false);

  const checkAccess = useCallback(async () => {
    if (!address || !isConnected) {
      setAccessState({
        hasAccess: false,
        requiredCredits: creditService.getRequiredCredits(feature),
        currentCredits: 0,
        feature
      });
      return;
    }

    setLoading(true);
    try {
      const access = await creditService.checkFeatureAccess(address, feature);
      setAccessState(access);
    } catch (error) {
      console.error(`Error checking access for ${feature}:`, error);
      setAccessState({
        hasAccess: false,
        requiredCredits: creditService.getRequiredCredits(feature),
        currentCredits: 0,
        feature
      });
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, feature]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    ...accessState,
    loading,
    refreshAccess: checkAccess
  };
} 