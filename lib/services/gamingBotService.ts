import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from "langchain/chains";

const groq = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export interface GameDevelopmentGuide {
  gameType: string;
  platform: string;
  features: string[];
  technicalRequirements: string[];
  somniaIntegration: string[];
  developmentSteps: string[];
  estimatedTimeline: string;
  resources: string[];
  challenges: string[];
  bestPractices: string[];
}

export interface SomniaGameFeature {
  name: string;
  description: string;
  implementation: string;
  benefits: string[];
  codeExample?: string;
  documentation?: string;
}

export interface GameArchitecture {
  frontend: string[];
  backend: string[];
  blockchain: string[];
  database: string[];
  deployment: string[];
  monitoring: string[];
}

// Prompt template for general gaming development guidance
const gamingDevelopmentPrompt = new PromptTemplate({
  template: `You are an expert game developer specializing in blockchain gaming and the Somnia ecosystem. Help the user with their game development query: "{query}".

Provide comprehensive guidance on:
- Game design and architecture for blockchain games
- Somnia blockchain integration strategies
- Smart contract development for gaming
- NFT and token mechanics
- Player onboarding and UX considerations
- Performance optimization for Web3 games
- Security best practices for gaming contracts
- Testing and deployment strategies

Focus on practical, actionable advice that leverages Somnia's gaming-focused features.`,
  inputVariables: ["query"],
});

const gamingDevelopmentChain = new LLMChain({
  llm: groq,
  prompt: gamingDevelopmentPrompt,
});

// Prompt template for Somnia-specific gaming features
const somniaGamingPrompt = new PromptTemplate({
  template: `You are a Somnia blockchain gaming expert. Explain how to use Somnia's ecosystem for game development based on: "{query}".

Cover:
- Somnia's gaming-specific features and capabilities
- Smart contract patterns for games
- NFT standards and implementations
- Token economics for gaming
- Cross-game asset interoperability
- Player progression and achievements
- Marketplace and trading mechanics
- Gas optimization for gaming transactions
- Integration with popular game engines
- Community and social features

Provide code examples and implementation details where relevant.`,
  inputVariables: ["query"],
});

const somniaGamingChain = new LLMChain({
  llm: groq,
  prompt: somniaGamingPrompt,
});

// Prompt template for game architecture and technical guidance
const gameArchitecturePrompt = new PromptTemplate({
  template: `You are a technical architect for blockchain games. Provide detailed technical guidance for: "{query}".

Include:
- System architecture recommendations
- Technology stack suggestions
- Database design for game state
- API design for game-client communication
- Caching strategies for performance
- Security considerations
- Scalability planning
- Monitoring and analytics
- Testing strategies
- Deployment and DevOps

Focus on building robust, scalable gaming applications that integrate well with Somnia blockchain.`,
  inputVariables: ["query"],
});

const gameArchitectureChain = new LLMChain({
  llm: groq,
  prompt: gameArchitecturePrompt,
});

// Prompt template for game monetization and tokenomics
const gameMonetizationPrompt = new PromptTemplate({
  template: `You are a game economy and monetization expert. Provide guidance on: "{query}".

Cover:
- Token design and distribution
- NFT mechanics and rarity systems
- Play-to-earn models
- In-game marketplace design
- Player retention strategies
- Economic balance and inflation control
- Revenue sharing models
- Governance and DAO integration
- Regulatory considerations
- Community-driven economies

Focus on sustainable and engaging economic models for Somnia-based games.`,
  inputVariables: ["query"],
});

const gameMonetizationChain = new LLMChain({
  llm: groq,
  prompt: gameMonetizationPrompt,
});

export class GamingBotService {
  public async getGameDevelopmentGuidance(query: string): Promise<string> {
    try {
      const response = await gamingDevelopmentChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error getting game development guidance:", error);
      throw new Error("Failed to get game development guidance");
    }
  }

  public async getSomniaIntegrationGuide(query: string): Promise<string> {
    try {
      const response = await somniaGamingChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error getting Somnia integration guide:", error);
      throw new Error("Failed to get Somnia integration guide");
    }
  }

  public async getGameArchitectureAdvice(query: string): Promise<string> {
    try {
      const response = await gameArchitectureChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error getting game architecture advice:", error);
      throw new Error("Failed to get game architecture advice");
    }
  }

  public async getMonetizationStrategy(query: string): Promise<string> {
    try {
      const response = await gameMonetizationChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error getting monetization strategy:", error);
      throw new Error("Failed to get monetization strategy");
    }
  }

  // Specific helper methods for common gaming queries
  public async getGameTypeGuidance(gameType: string): Promise<string> {
    const query = `How do I develop a ${gameType} game on Somnia blockchain?`;
    return this.getGameDevelopmentGuidance(query);
  }

  public async getSmartContractGuidance(): Promise<string> {
    const query = "What are the best practices for developing gaming smart contracts on Somnia?";
    return this.getSomniaIntegrationGuide(query);
  }

  public async getNFTImplementationGuide(): Promise<string> {
    const query = "How do I implement NFTs and in-game assets using Somnia blockchain?";
    return this.getSomniaIntegrationGuide(query);
  }

  public async getPlayerOnboardingGuide(): Promise<string> {
    const query = "How do I create a smooth player onboarding experience for Web3 games?";
    return this.getGameDevelopmentGuidance(query);
  }

  public async getPerformanceOptimizationGuide(): Promise<string> {
    const query = "How do I optimize game performance for blockchain integration?";
    return this.getGameArchitectureAdvice(query);
  }

  public async getSecurityBestPractices(): Promise<string> {
    const query = "What are the security best practices for gaming smart contracts?";
    return this.getSomniaIntegrationGuide(query);
  }

  public async getTestingStrategy(): Promise<string> {
    const query = "How do I test blockchain games and smart contracts effectively?";
    return this.getGameArchitectureAdvice(query);
  }

  public async getDeploymentGuide(): Promise<string> {
    const query = "How do I deploy and launch a game on Somnia blockchain?";
    return this.getGameArchitectureAdvice(query);
  }

  public async getCommunityFeaturesGuide(): Promise<string> {
    const query = "How do I implement community and social features in blockchain games?";
    return this.getSomniaIntegrationGuide(query);
  }

  public async getCrossGameInteroperability(): Promise<string> {
    const query = "How do I enable cross-game asset interoperability on Somnia?";
    return this.getSomniaIntegrationGuide(query);
  }

  public async getGameEconomyDesign(): Promise<string> {
    const query = "How do I design a sustainable game economy with tokens and NFTs?";
    return this.getMonetizationStrategy(query);
  }

  public async getPlayToEarnModels(): Promise<string> {
    const query = "What are the best play-to-earn models for Somnia-based games?";
    return this.getMonetizationStrategy(query);
  }

  public async getGovernanceIntegration(): Promise<string> {
    const query = "How do I integrate governance and DAO features into games?";
    return this.getSomniaIntegrationGuide(query);
  }
}

// Singleton instance
export const gamingBotService = new GamingBotService();
