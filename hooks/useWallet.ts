import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '@/lib/web3';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          setWalletState({
            address: null,
            isConnected: false,
            isConnecting: false,
            error: null
          });
        } else {
          // User switched accounts
          setWalletState(prev => ({
            ...prev,
            address: accounts[0],
            isConnected: true,
            error: null
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletState({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null
          });
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'Please install MetaMask or another Web3 wallet'
      }));
      return;
    }

    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null
    }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null
        });
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet
  };
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
} 