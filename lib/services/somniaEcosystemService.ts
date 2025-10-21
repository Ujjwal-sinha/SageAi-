import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from "langchain/chains";

const groq = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

export interface SomniaEcosystemInfo {
  recentUpdates: string[];
  keyFeatures: string[];
  technicalSpecs: {
    consensus: string;
    tps: string;
    finality: string;
    gasModel: string;
  };
  developerTools: string[];
  gamingFeatures: string[];
  ecosystemProjects: string[];
  partnerships: string[];
  roadmap: string[];
  communityStats: {
    developers: string;
    projects: string;
    transactions: string;
    activeUsers: string;
  };
}

export interface SomniaNewsItem {
  title: string;
  summary: string;
  category: 'technical' | 'partnership' | 'ecosystem' | 'gaming' | 'governance';
  impact: 'high' | 'medium' | 'low';
  date: string;
  source: string;
  url?: string;
}

export interface SomniaAnalysis {
  marketPosition: string;
  competitiveAdvantages: string[];
  challenges: string[];
  futureOutlook: string;
  recommendations: string[];
}

// Prompt template for Somnia ecosystem information
const somniaEcosystemPrompt = new PromptTemplate({
  template: `You are a Somnia blockchain expert. Provide comprehensive information about the Somnia blockchain ecosystem based on the user's query: "{query}".

Focus on:
- Recent developments and updates in the Somnia ecosystem
- Technical specifications and capabilities
- Gaming-focused features and tools
- Developer resources and documentation
- Ecosystem projects and partnerships
- Community growth and adoption metrics
- Roadmap and future plans

Provide accurate, up-to-date information about Somnia's unique positioning in the blockchain gaming space.`,
  inputVariables: ["query"],
});

const somniaEcosystemChain = new LLMChain({
  llm: groq,
  prompt: somniaEcosystemPrompt,
});

// Prompt template for Somnia news analysis
const somniaNewsPrompt = new PromptTemplate({
  template: `Analyze the latest news and developments in the Somnia blockchain ecosystem. Based on the query: "{query}", provide:

1. Recent news items with categorization (technical, partnership, ecosystem, gaming, governance)
2. Impact assessment for each news item
3. Market sentiment analysis
4. Key developments that affect developers and gamers
5. Upcoming events or milestones

Focus on news that would be relevant to developers building on Somnia or gamers using Somnia-based applications.`,
  inputVariables: ["query"],
});

const somniaNewsChain = new LLMChain({
  llm: groq,
  prompt: somniaNewsPrompt,
});

// Prompt template for Somnia ecosystem analysis
const somniaAnalysisPrompt = new PromptTemplate({
  template: `Provide a comprehensive analysis of the Somnia blockchain ecosystem based on: "{query}".

Include:
1. Market position and competitive advantages
2. Technical strengths and unique features
3. Current challenges and limitations
4. Future outlook and growth potential
5. Recommendations for developers and users
6. Comparison with other gaming-focused blockchains

Be objective and provide actionable insights for both developers and end-users interested in the Somnia ecosystem.`,
  inputVariables: ["query"],
});

const somniaAnalysisChain = new LLMChain({
  llm: groq,
  prompt: somniaAnalysisPrompt,
});

export class SomniaEcosystemService {
  public async getEcosystemInfo(query: string): Promise<string> {
    try {
      const response = await somniaEcosystemChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error fetching Somnia ecosystem info:", error);
      throw new Error("Failed to fetch Somnia ecosystem information");
    }
  }

  public async getRecentNews(query: string): Promise<string> {
    try {
      const response = await somniaNewsChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error fetching Somnia news:", error);
      throw new Error("Failed to fetch Somnia news");
    }
  }

  public async getEcosystemAnalysis(query: string): Promise<string> {
    try {
      const response = await somniaAnalysisChain.call({ query });
      return response.text;
    } catch (error) {
      console.error("Error analyzing Somnia ecosystem:", error);
      throw new Error("Failed to analyze Somnia ecosystem");
    }
  }

  public async getGamingFeatures(): Promise<string> {
    const query = "What are the key gaming features and capabilities of the Somnia blockchain?";
    return this.getEcosystemInfo(query);
  }

  public async getDeveloperResources(): Promise<string> {
    const query = "What developer tools, SDKs, and resources are available for building on Somnia?";
    return this.getEcosystemInfo(query);
  }

  public async getTechnicalSpecs(): Promise<string> {
    const query = "What are the technical specifications of Somnia blockchain including consensus mechanism, TPS, and gas model?";
    return this.getEcosystemInfo(query);
  }

  public async getEcosystemProjects(): Promise<string> {
    const query = "What are the notable projects and applications currently built on the Somnia blockchain?";
    return this.getEcosystemInfo(query);
  }

  public async getPartnerships(): Promise<string> {
    const query = "What are the recent partnerships and collaborations in the Somnia ecosystem?";
    return this.getRecentNews(query);
  }

  public async getRoadmap(): Promise<string> {
    const query = "What is the current roadmap and upcoming milestones for Somnia blockchain?";
    return this.getEcosystemInfo(query);
  }

  public async getCommunityStats(): Promise<string> {
    const query = "What are the current community statistics and growth metrics for Somnia?";
    return this.getEcosystemInfo(query);
  }

  public async getMarketAnalysis(): Promise<string> {
    const query = "Provide a market analysis of Somnia's position in the blockchain gaming space";
    return this.getEcosystemAnalysis(query);
  }

  public async getCompetitiveAnalysis(): Promise<string> {
    const query = "How does Somnia compare to other gaming-focused blockchains like Immutable X, Polygon, and others?";
    return this.getEcosystemAnalysis(query);
  }

  public async getFutureOutlook(): Promise<string> {
    const query = "What is the future outlook and potential for Somnia blockchain in the gaming industry?";
    return this.getEcosystemAnalysis(query);
  }
}

// Singleton instance
export const somniaEcosystemService = new SomniaEcosystemService();
