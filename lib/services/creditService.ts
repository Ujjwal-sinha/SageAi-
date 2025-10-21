import { web3Service } from '../web3';

export enum FeatureType {
  CHATBOT = 'CHATBOT',
  SMART_CONTRACT_GENERATOR = 'SMART_CONTRACT_GENERATOR',
  TRADE_ASSISTANT = 'TRADE_ASSISTANT',
  ASK_PEOPLE = 'ASK_PEOPLE',
  AI_NFT_GENERATOR = 'AI_NFT_GENERATOR',
  BLOCKCHAIN_ARCHITECT = 'BLOCKCHAIN_ARCHITECT',
  DEFI_PROTOCOL_DESIGNER = 'DEFI_PROTOCOL_DESIGNER',
  TOKEN_DESIGNER = 'TOKEN_DESIGNER',
  NEWS_AI_INSIGHTS = 'NEWS_AI_INSIGHTS',
  PREMIUM_ANALYTICS = 'PREMIUM_ANALYTICS',
  SOMNIA_ECOSYSTEM = 'SOMNIA_ECOSYSTEM',
  GAMING_BOT = 'GAMING_BOT'
}

export interface FeatureAccess {
  hasAccess: boolean;
  requiredCredits: number;
  currentCredits: number;
  feature: FeatureType;
}

export interface CreditThresholds {
  [key: string]: number;
}

export class CreditService {
  private thresholds: CreditThresholds = {};
  consumeFeature: any;

  constructor() {
    this.loadThresholds();
  }

  private loadThresholds(): void {
    // Load thresholds from environment variables
    this.thresholds = {
      [FeatureType.CHATBOT]: Number(process.env.NEXT_PUBLIC_THRESHOLD_CHATBOT) || 1,
      [FeatureType.SMART_CONTRACT_GENERATOR]: Number(process.env.NEXT_PUBLIC_THRESHOLD_CONTRACT_GENERATOR) || 5,
      [FeatureType.TRADE_ASSISTANT]: Number(process.env.NEXT_PUBLIC_THRESHOLD_TRADE_ASSISTANT) || 3,
      [FeatureType.ASK_PEOPLE]: Number(process.env.NEXT_PUBLIC_THRESHOLD_ASK_PEOPLE) || 2,
      [FeatureType.AI_NFT_GENERATOR]: Number(process.env.NEXT_PUBLIC_THRESHOLD_NFT_GENERATOR) || 10,
      [FeatureType.BLOCKCHAIN_ARCHITECT]: Number(process.env.NEXT_PUBLIC_THRESHOLD_BLOCKCHAIN_ARCHITECT) || 15,
      [FeatureType.DEFI_PROTOCOL_DESIGNER]: Number(process.env.NEXT_PUBLIC_THRESHOLD_DEFI_DESIGNER) || 20,
      [FeatureType.TOKEN_DESIGNER]: Number(process.env.NEXT_PUBLIC_THRESHOLD_TOKEN_DESIGNER) || 8,
      [FeatureType.NEWS_AI_INSIGHTS]: Number(process.env.NEXT_PUBLIC_THRESHOLD_NEWS_INSIGHTS) || 1,
      [FeatureType.PREMIUM_ANALYTICS]: Number(process.env.NEXT_PUBLIC_THRESHOLD_PREMIUM_ANALYTICS) || 25,
      [FeatureType.SOMNIA_ECOSYSTEM]: Number(process.env.NEXT_PUBLIC_THRESHOLD_SOMNIA_ECOSYSTEM) || 9,
      [FeatureType.GAMING_BOT]: Number(process.env.NEXT_PUBLIC_THRESHOLD_GAMING_BOT) || 11
    };
  }

  public async checkFeatureAccess(
    userAddress: string, 
    feature: FeatureType
  ): Promise<FeatureAccess> {
    try {
      if (!web3Service.isValidAddress(userAddress)) {
        throw new Error('Invalid wallet address');
      }

      const currentCredits = parseFloat(await web3Service.getTokenBalance(userAddress));
      const requiredCredits = this.thresholds[feature] || 0;

      return {
        hasAccess: currentCredits >= requiredCredits,
        requiredCredits,
        currentCredits,
        feature
      };
    } catch (error) {
      console.error(`Error checking feature access for ${feature}:`, error);
      return {
        hasAccess: false,
        requiredCredits: this.thresholds[feature] || 0,
        currentCredits: 0,
        feature
      };
    }
  }

  public async checkMultipleFeatures(
    userAddress: string, 
    features: FeatureType[]
  ): Promise<FeatureAccess[]> {
    try {
      const currentCredits = parseFloat(await web3Service.getTokenBalance(userAddress));
      
      return features.map(feature => ({
        hasAccess: currentCredits >= (this.thresholds[feature] || 0),
        requiredCredits: this.thresholds[feature] || 0,
        currentCredits,
        feature
      }));
    } catch (error) {
      console.error('Error checking multiple features:', error);
      return features.map(feature => ({
        hasAccess: false,
        requiredCredits: this.thresholds[feature] || 0,
        currentCredits: 0,
        feature
      }));
    }
  }

  public getRequiredCredits(feature: FeatureType): number {
    return this.thresholds[feature] || 0;
  }

  public getAllThresholds(): CreditThresholds {
    return { ...this.thresholds };
  }

  public async getUserCredits(userAddress: string): Promise<number> {
    try {
      if (!web3Service.isValidAddress(userAddress)) {
        throw new Error('Invalid wallet address');
      }
      
      const balance = await web3Service.getTokenBalance(userAddress);
      return parseFloat(balance);
    } catch (error) {
      console.error('Error fetching user credits:', error);
      return 0;
    }
  }

  public formatCredits(credits: number): string {
    return credits.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  }
}

// Singleton instance
export const creditService = new CreditService(); 