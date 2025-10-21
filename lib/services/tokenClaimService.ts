import { ethers } from 'ethers';
import { UTILITY_TOKEN_ADDRESS, UTILITY_TOKEN_ABI } from '../utilityToken';

export interface ClaimResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  amount?: number;
}

// Faucet contract ABI
const FAUCET_ABI = [
  'function claimTokens() external',
  'function canClaim(address user) external view returns (bool)',
  'function getTimeUntilNextClaim(address user) external view returns (uint256)',
  'function claimCount(address user) external view returns (uint256)',
  'event TokensClaimed(address indexed user, uint256 amount)'
];

export class TokenClaimService {
  private provider: ethers.JsonRpcProvider | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://dream-rpc.somnia.network';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    } catch (error) {
      console.error('Failed to initialize TokenClaimService:', error);
    }
  }

  public async claimTokens(userAddress: string, userSigner: ethers.Signer): Promise<ClaimResult> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '0x16061b1ac83ceb587B76Ceb5ad19e67067768C73';
      if (!faucetAddress) {
        throw new Error('Faucet contract address not configured');
      }

      // Check if contract exists
      const code = await this.provider.getCode(faucetAddress);
      if (code === '0x') {
        throw new Error('Faucet contract not found at this address');
      }

      // Create faucet contract instance with user's signer
      const faucetContract = new ethers.Contract(faucetAddress, FAUCET_ABI, userSigner);

      // Check if user can claim
      const canClaim = await faucetContract.canClaim(userAddress).catch(() => false);
      if (!canClaim) {
        const timeUntilNextClaim = await faucetContract.getTimeUntilNextClaim(userAddress).catch(() => 0);
        const hoursLeft = Math.ceil(Number(timeUntilNextClaim) / 3600);
        throw new Error(`You can claim again in ${hoursLeft} hours`);
      }

      // Call claimTokens function
      const tx = await faucetContract.claimTokens();
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        amount: 100 // 100 UTK tokens
      };
    } catch (error: any) {
      console.error('Error claiming tokens:', error);
      return {
        success: false,
        error: error.message || 'Failed to claim tokens'
      };
    }
  }

  public async checkClaimEligibility(userAddress: string): Promise<{
    canClaim: boolean;
    reason?: string;
    timeUntilNextClaim?: number;
    claimCount?: number;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '0x16061b1ac83ceb587B76Ceb5ad19e67067768C73';
      if (!faucetAddress) {
        console.error('NEXT_PUBLIC_FAUCET_ADDRESS not set in environment variables');
        return {
          canClaim: false,
          reason: 'Faucet contract not configured'
        };
      }

      if (!ethers.isAddress(userAddress)) {
        return {
          canClaim: false,
          reason: 'Invalid wallet address'
        };
      }

      const faucetContract = new ethers.Contract(faucetAddress, FAUCET_ABI, this.provider);
      
      // Check if contract exists
      const code = await this.provider.getCode(faucetAddress);
      if (code === '0x') {
        return {
          canClaim: false,
          reason: 'Faucet contract not found at this address'
        };
      }
      
      const [canClaim, timeUntilNextClaim, claimCount] = await Promise.all([
        faucetContract.canClaim(userAddress).catch(() => false),
        faucetContract.getTimeUntilNextClaim(userAddress).catch(() => 0),
        faucetContract.claimCount(userAddress).catch(() => 0)
      ]);

      return {
        canClaim,
        timeUntilNextClaim: Number(timeUntilNextClaim),
        claimCount: Number(claimCount),
        reason: canClaim ? undefined : `Next claim available in ${Math.ceil(Number(timeUntilNextClaim) / 3600)} hours`
      };
    } catch (error) {
      console.error('Error checking claim eligibility:', error);
      return {
        canClaim: false,
        reason: 'Error checking eligibility'
      };
    }
  }

  public async getClaimHistory(userAddress: string): Promise<{
    totalClaimed: number;
    claimCount: number;
    lastClaimTime?: Date;
  }> {
    try {
      const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS;
      if (!faucetAddress) {
        return { totalClaimed: 0, claimCount: 0 };
      }

      const faucetContract = new ethers.Contract(faucetAddress, FAUCET_ABI, this.provider);
      const claimCount = await faucetContract.claimCount(userAddress);
      
      return {
        totalClaimed: Number(claimCount) * 100, // 100 tokens per claim
        claimCount: Number(claimCount)
      };
    } catch (error) {
      console.error('Error getting claim history:', error);
      return {
        totalClaimed: 0,
        claimCount: 0
      };
    }
  }
}

// Singleton instance
export const tokenClaimService = new TokenClaimService();