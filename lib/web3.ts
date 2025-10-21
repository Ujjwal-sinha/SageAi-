import { ethers } from 'ethers';

// ERC20 ABI for balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export interface TokenConfig {
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}

export class Web3Service {
  [x: string]: any;
  private provider: ethers.JsonRpcProvider | null = null;
  private tokenContract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Use environment variable for RPC URL, fallback to localhost
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    } catch (error) {
      console.error('Failed to initialize Web3 provider:', error);
    }
  }

  public async initializeTokenContract(tokenAddress: string): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    this.tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      this.provider
    );
  }

  public async getTokenBalance(userAddress: string, tokenAddress?: string): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      // Use provided token address or default from environment
      const contractAddress = tokenAddress || process.env.NEXT_PUBLIC_UTILITY_TOKEN_ADDRESS;
      
      if (!contractAddress) {
        console.warn('Token contract address not provided, returning 0');
        return '0';
      }

      // Check if contract exists
      const code = await this.provider.getCode(contractAddress);
      if (code === '0x') {
        console.warn('Token contract not found at address, returning 0');
        return '0';
      }

      const contract = new ethers.Contract(contractAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(userAddress).catch(() => 0);
      const decimals = await contract.decimals().catch(() => 18);
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  }

  public async getTokenInfo(tokenAddress: string): Promise<TokenConfig> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      
      const [decimals, symbol, name] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name()
      ]);

      return {
        contractAddress: tokenAddress,
        decimals: Number(decimals),
        symbol,
        name
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  public isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  public async checkConnection(): Promise<boolean> {
    try {
      if (!this.provider) return false;
      await this.provider.getNetwork();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const web3Service = new Web3Service(); 