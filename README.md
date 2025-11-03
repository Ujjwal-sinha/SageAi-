# Sage AI - Your Intelligent Web3 Assistant Platform

## Overview
Sage AI is a comprehensive Web3-powered AI platform natively built for the Somnia blockchain ecosystem. The platform combines artificial intelligence with blockchain technology to provide a suite of intelligent tools and services. Using an ERC20 utility token (UTK) to gate features based on user token balance, Sage AI ensures fair access to premium features while maintaining a sustainable ecosystem. Currently live on Somnia Testnet with seamless integration to Somnia's high-performance infrastructure.

## Key Features

### 🌟 Somnia Native Agents (Priority)
- **Somnia Ecosystem Explorer**: AI-powered agent specializing in Somnia ecosystem knowledge, network context, and guidance (9 UTK)
- **Gaming Development Bot**: Expert assistant for game design, NFT/token mechanics, and smart contract patterns on Somnia (11 UTK)
- **Infrastructure Agents**: Comprehensive runbooks and guidance for node setup, monitoring, security, and scaling on Somnia (13 UTK)

### 🤖 AI-Powered Tools
- **Chatbot**: General-purpose Web3 AI assistant with contextual knowledge (1 UTK)
- **News Insights**: Real-time aggregation and AI analysis of blockchain and crypto news (1 UTK)
- **Ask People**: Community-style Q&A platform with AI moderation and expert simulation (2 UTK)
- **Trade Assistant**: AI-powered trading insights, risk assessment, and market strategies (3 UTK)
- **Smart Contract Generator**: Automated Solidity code generation with security best practices (5 UTK)

### 🔐 Security & Access Control
- Web3 wallet integration for secure authentication via MetaMask and compatible wallets
- Token-based access control system with transparent on-chain verification
- ERC20 UTK token gating for fair and transparent feature access
- Somnia Testnet integration with faucet for easy token claiming

## Technology Stack

- **Frontend**: Next.js 13+, TypeScript, TailwindCSS
- **Blockchain**: Solidity, Hardhat, Web3.js, Somnia Network
- **AI/ML**: Groq LLM API
- **UI Components**: Radix UI, Shadcn
- **Authentication**: Web3 Wallet Integration (MetaMask compatible)
- **State Management**: React Hooks
- **Testing**: Hardhat Test Suite


### Blockchain Configuration
```bash
# RPC URL for your blockchain network
NEXT_PUBLIC_RPC_URL="https://dream-rpc.somnia.network/"

# Blockchain explorer URL for transaction viewing
NEXT_PUBLIC_EXPLORER_URL="https://shannon-explorer.somnia.network/"

# Somnia network chain ID (Testnet)
NEXT_PUBLIC_CHAIN_ID="50312"

# Faucet contract (for UTK claims)
NEXT_PUBLIC_FAUCET_ADDRESS="0x16061b1ac83ceb587B76Ceb5ad19e67067768C73"

# Your deployed UtilityToken contract address
NEXT_PUBLIC_UTILITY_TOKEN_ADDRESS="0x8270bc03a46ADC2b21EAB599cF077Ce16Af9f5cb"
```

## Getting Started

### Prerequisites
- Node.js 16.x or later
- Git
- Web3 wallet (MetaMask recommended)
- Yarn or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ujjwal-sinha/SageAi-.git
cd sageai
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Set up environment variables by creating a `.env.local` file in the root directory:

```bash
# Somnia Network Configuration
NEXT_PUBLIC_RPC_URL="https://dream-rpc.somnia.network/"
NEXT_PUBLIC_EXPLORER_URL="https://shannon-explorer.somnia.network/"
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_FAUCET_ADDRESS=0x16061b1ac83ceb587B76Ceb5ad19e67067768C73
# Utility Token Configuration
NEXT_PUBLIC_UTILITY_TOKEN_ADDRESS=0x8270bc03a46ADC2b21EAB599cF077Ce16Af9f5cb
# CoinMarketCap API Configuration (Required for real crypto data)
# Get your API key from: https://coinmarketcap.com/api/
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here

# Groq API Configuration (Required for AI features)
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here



# Credit Thresholds (Optional - defaults will be used if not set)
NEXT_PUBLIC_THRESHOLD_CHATBOT=1
NEXT_PUBLIC_THRESHOLD_CONTRACT_GENERATOR=5
NEXT_PUBLIC_THRESHOLD_TRADE_ASSISTANT=3
NEXT_PUBLIC_THRESHOLD_ASK_PEOPLE=2
NEXT_PUBLIC_THRESHOLD_NFT_GENERATOR=10
NEXT_PUBLIC_THRESHOLD_BLOCKCHAIN_ARCHITECT=15
NEXT_PUBLIC_THRESHOLD_DEFI_DESIGNER=20
NEXT_PUBLIC_THRESHOLD_TOKEN_DESIGNER=8
NEXT_PUBLIC_THRESHOLD_NEWS_INSIGHTS=1
NEXT_PUBLIC_THRESHOLD_PREMIUM_ANALYTICS=25
NEXT_PUBLIC_THRESHOLD_SOMNIA_ECOSYSTEM=9
NEXT_PUBLIC_THRESHOLD_GAMING_BOT=11
NEXT_PUBLIC_THRESHOLD_INFRASTRUCTURE_AGENTS=13
```

**Note**: The CoinMarketCap API key is required for real crypto data. Without it, the dashboard will show empty sections with appropriate messages.

## How It Works

1. **Token Contract**: Deploy the UtilityToken.sol contract to your blockchain
2. **Feature Gating**: Each feature is wrapped with a `FeatureGate` component
3. **Balance Checking**: The system checks user's UTK balance via Web3 calls
4. **Access Control**: Users can only access features if their balance meets the threshold

## Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[User Interface] --> B[Navbar with Wallet Connection]
        A --> C[Feature Pages]
        C --> D[FeatureGate Component]
        B --> E[WalletConnection Component]
    end
    
    subgraph "Hooks & Services"
        D --> F[useCredits Hook]
        E --> F
        F --> G[CreditService]
        G --> H[Web3Service]
    end
    
    subgraph "Blockchain Layer"
        H --> I[Web3 Provider]
        I --> J[Somnia Network RPC]
        J --> K[UtilityToken Contract]
        K --> L[ERC20 Token Balance]
    end
    
    subgraph "Feature Access Flow"
        M[User Visits Feature] --> N{Wallet Connected?}
        N -->|No| O[Show Connect Wallet]
        N -->|Yes| P[Check UTK Balance]
        P --> Q{Balance >= Threshold?}
        Q -->|No| R[Show Insufficient Credits]
        Q -->|Yes| S[Grant Feature Access]
    end
    
    subgraph "Token Thresholds"
        T[Basic Features: 1-2 UTK]
        U[Advanced Features: 3-5 UTK]
        V[Somnia Agents: 9-13 UTK]
    end
    
    style K fill:#e1f5fe
    style L fill:#e8f5e8
```

## Somnia Network Setup

- Network Name: Somnia Testnet
- RPC URL: https://dream-rpc.somnia.network
- Chain ID: 50312
- Currency Symbol: SOM
- Block Explorer: https://shannon-explorer.somnia.network

Notes:
- You need a small amount of SOM for gas to claim UTK from the faucet.
- Ensure your wallet is connected to Somnia Testnet before using `/claim`.

## Feature-Specific Architecture Diagrams

### Somnia Agents Architecture (Priority)

#### Somnia Ecosystem Agent

```mermaid
graph TB
    subgraph "Somnia Ecosystem UI"
        A[Somnia Page] --> B[Prompt Input]
        A --> C[Conversation History]
        B --> D[Submit Query]
    end

    subgraph "Access Control"
        D --> E[FeatureGate Check]
        E --> F{"UTK >= Threshold (Somnia)"}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Process Somnia Query]
    end

    subgraph "AI Processing"
        H --> I[Context Build: ecosystem, specs, news]
        I --> J[Groq LLM]
        J --> K[Structured Answer]
    end

    subgraph "External Sources"
        L[Somnia RPC - dream-rpc] 
        M[Somnia Explorer - shannon-explorer]
        N[Official Docs]
    end

    I -.-> L
    I -.-> M
    I -.-> N

    style F fill:#e1f5fe
    style G fill:#ffebee
    style K fill:#e8f5e8
```

#### Gaming Development Agent (Somnia)

```mermaid
graph TB
    subgraph "Gaming Bot UI"
        A[Gaming Bot Page] --> B[Topic Shortcuts]
        A --> C[Prompt Input]
        C --> D[Submit]
    end

    subgraph "Access Control"
        D --> E[FeatureGate Check]
        E --> F{"UTK >= Threshold (Gaming)"}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Build Gaming Context]
    end

    subgraph "AI Pipelines"
        H --> I[Design & Architecture]
        H --> J[Smart Contract Patterns]
        H --> K[NFT/Token Mechanics]
        H --> L[Perf & Security]
        I --> M[Groq LLM]
        J --> M
        K --> M
        L --> M
        M --> N[Actionable Guidance]
    end

    subgraph "Somnia Integrations"
        O[RPC / Explorer]
        P[Tooling & SDKs]
        Q[Docs & Examples]
    end

    H -.-> O
    H -.-> P
    H -.-> Q

    style F fill:#e1f5fe
    style G fill:#ffebee
    style N fill:#e8f5e8
```

#### Infrastructure Agents (Somnia)

```mermaid
graph TB
    subgraph "Infra UI"
        A[Infrastructure Page] --> B[Preset Topics]
        A --> C[Freeform Query]
        C --> D[Submit]
    end

    subgraph "Access Control"
        D --> E[FeatureGate Check]
        E --> F{"UTK >= Threshold (Infra)"}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Process Infra Query]
    end

    subgraph "Infra Engine"
        H --> I[Node Setup & Networking]
        H --> J[Monitoring & Logging]
        H --> K[Security & Hardening]
        H --> L[Scaling & Cost]
        I --> M[Groq LLM]
        J --> M
        K --> M
        L --> M
        M --> N[Runbooks, Steps, Commands]
    end

    subgraph "Somnia Ops"
        O[RPC / Chain Config]
        P[Explorer API]
        Q[Cloud/K8s]
    end

    I -.-> O
    J -.-> P
    L -.-> Q

    style F fill:#e1f5fe
    style G fill:#ffebee
    style N fill:#e8f5e8
```


### 1. Web3 AI Chatbot Architecture (1 UTK Required)

```mermaid
graph TB
    subgraph "Chatbot Frontend"
        A[Chat Interface] --> B[Message Input]
        A --> C[Chat History Display]
        B --> D[Send Message Handler]
    end
    
    subgraph "Access Control"
        D --> E[FeatureGate Check]
        E --> F{UTK Balance >= 1?}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Process Message]
    end
    
    subgraph "AI Processing"
        H --> I[Message Preprocessing]
        I --> J[Context Enhancement]
        J --> K[Web3 Knowledge Injection]
        K --> L[GROQ API Call]
    end
    
    subgraph "Response Generation"
        L --> M[AI Response]
        M --> N[Web3 Context Validation]
        N --> O[Response Formatting]
        O --> P[Display in Chat]
    end
    
    subgraph "External Services"
        Q[GROQ LLM API]
        R[Web3 Knowledge Base]
        S[Blockchain Data]
    end
    
    L -.-> Q
    K -.-> R
    N -.-> S
    
    style F fill:#e1f5fe
    style G fill:#ffebee
    style P fill:#e8f5e8
```

### 2. Trading Assistant Architecture (3 UTK Required)

```mermaid
graph TB
    subgraph "Trading Interface"
        A[Trading Dashboard] --> B[Market Analysis Panel]
        A --> C[Trade Suggestion Panel]
        A --> D[Portfolio Overview]
    end
    
    subgraph "Access Control"
        A --> E[FeatureGate Check]
        E --> F{UTK Balance >= 3?}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Load Trading Features]
    end
    
    subgraph "Market Data Processing"
        H --> I[Real-time Price Feeds]
        I --> J[Technical Analysis]
        J --> K[Market Sentiment Analysis]
        K --> L[Risk Assessment]
    end
    
    subgraph "AI Analysis Engine"
        L --> M[GROQ AI Processing]
        M --> N[Trading Pattern Recognition]
        N --> O[Strategy Recommendations]
        O --> P[Risk-Reward Calculations]
    end
    
    subgraph "Output Generation"
        P --> Q[Trade Suggestions]
        Q --> R[Market Insights]
        R --> S[Portfolio Recommendations]
        S --> T[Display Results]
    end
    
    subgraph "External APIs"
        U[Price Data APIs]
        V[Market News APIs]
        W[GROQ LLM API]
    end
    
    I -.-> U
    K -.-> V
    M -.-> W
    
    style F fill:#e1f5fe
    style G fill:#ffebee
    style T fill:#e8f5e8
```

### 3. Ask Crypto People Architecture (2 UTK Required)

```mermaid
graph TB
    subgraph "Question Interface"
        A[Question Input Form] --> B[Topic Selection]
        A --> C[Question Text Area]
        B --> D[Submit Question]
    end
    
    subgraph "Access Control"
        D --> E[FeatureGate Check]
        E --> F{UTK Balance >= 2?}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Process Question]
    end
    
    subgraph "Question Processing"
        H --> I[Question Analysis]
        I --> J[Topic Categorization]
        J --> K[Expertise Matching]
        K --> L[Context Enrichment]
    end
    
    subgraph "AI Response Generation"
        L --> M[Multi-Perspective Analysis]
        M --> N[Expert Opinion Simulation]
        N --> O[Community Insights]
        O --> P[GROQ API Processing]
    end
    
    subgraph "Response Compilation"
        P --> Q[Answer Synthesis]
        Q --> R[Source Attribution]
        R --> S[Confidence Scoring]
        S --> T[Format Response]
    end
    
    subgraph "Knowledge Sources"
        U[Crypto Expert Profiles]
        V[Community Discussions]
        W[Technical Documentation]
        X[GROQ LLM API]
    end
    
    K -.-> U
    O -.-> V
    L -.-> W
    P -.-> X
    
    style F fill:#e1f5fe
    style G fill:#ffebee
    style T fill:#e8f5e8
```

### 4. AI Smart Contract Generator Architecture (5 UTK Required)

```mermaid
graph TB
    subgraph "Contract Builder Interface"
        A[Contract Specification Form] --> B[Contract Type Selection]
        A --> C[Parameter Configuration]
        A --> D[Feature Selection]
        D --> E[Generate Contract Button]
    end
    
    subgraph "Access Control"
        E --> F[FeatureGate Check]
        F --> G{UTK Balance >= 5?}
        G -->|No| H[Show Insufficient Credits]
        G -->|Yes| I[Process Generation Request]
    end
    
    subgraph "Code Generation Pipeline"
        I --> J[Requirement Analysis]
        J --> K[Template Selection]
        K --> L[Security Pattern Injection]
        L --> M[Custom Logic Generation]
    end
    
    subgraph "AI Processing"
        M --> N[GROQ AI Code Generation]
        N --> O[Solidity Syntax Validation]
        O --> P[Security Best Practices]
        P --> Q[Gas Optimization]
    end
    
    subgraph "Output & Validation"
        Q --> R[Generated Contract Code]
        R --> S[Compilation Check]
        S --> T[Security Audit Suggestions]
        T --> U[Deployment Instructions]
    end
    
    subgraph "Code Templates & Standards"
        V[OpenZeppelin Libraries]
        W[Security Patterns]
        X[Gas Optimization Patterns]
        Y[GROQ LLM API]
    end
    
    K -.-> V
    L -.-> W
    Q -.-> X
    N -.-> Y
    
    style G fill:#e1f5fe
    style H fill:#ffebee
    style U fill:#e8f5e8
```

### 5. AI Web3 News Architecture (1 UTK Required)

```mermaid
graph TB
    subgraph "News Interface"
        A[News Dashboard] --> B[Category Filters]
        A --> C[Search Functionality]
        A --> D[News Feed Display]
    end
    
    subgraph "Access Control"
        A --> E[FeatureGate Check]
        E --> F{UTK Balance >= 1?}
        F -->|No| G[Show Insufficient Credits]
        F -->|Yes| H[Load News Features]
    end
    
    subgraph "News Aggregation"
        H --> I[Multi-Source News Fetching]
        I --> J[Content Deduplication]
        J --> K[Relevance Filtering]
        K --> L[Sentiment Analysis]
    end
    
    subgraph "AI Enhancement"
        L --> M[GROQ AI Processing]
        M --> N[Content Summarization]
        N --> O[Impact Analysis]
        O --> P[Trend Identification]
    end
    
    subgraph "Personalization"
        P --> Q[User Interest Matching]
        Q --> R[Priority Scoring]
        R --> S[Content Ranking]
        S --> T[Personalized Feed]
    end
    
    subgraph "External Data Sources"
        U[Crypto News APIs]
        V[Social Media Feeds]
        W[Blockchain Analytics]
        X[GROQ LLM API]
    end
    
    I -.-> U
    L -.-> V
    O -.-> W
    M -.-> X
    
    style F fill:#e1f5fe
    style G fill:#ffebee
    style T fill:#e8f5e8
```

### Feature Integration Flow

```mermaid
graph LR
    subgraph "Common Components"
        A[FeatureGate] --> B[useCredits Hook]
        B --> C[Web3Service]
        C --> D[UTK Balance Check]
    end
    
    subgraph "Feature-Specific Components"
        E[Chatbot: 1 UTK]
        F[News: 1 UTK]
        G[Ask People: 2 UTK]
        H[Trade Assistant: 3 UTK]
        I[Contract Generator: 5 UTK]
    end
    
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    
    style E fill:#c8e6c9
    style F fill:#c8e6c9
    style G fill:#fff3e0
    style H fill:#e3f2fd
    style I fill:#f3e5f5
```
```

### System Flow Steps

1. **User Authentication**
   - User connects MetaMask or compatible wallet
   - System detects wallet address and network

2. **Balance Verification**
   - Web3Service queries UtilityToken contract
   - Retrieves current UTK balance for user address
   - Caches balance for performance

3. **Feature Access Control**
   - FeatureGate component wraps each premium feature
   - Compares user balance against feature threshold
   - Grants or denies access based on token holdings

4. **Real-time Updates**
   - Balance updates when user performs transactions
   - UI reflects current access permissions
   - Automatic refresh on wallet events

5. **Transaction Monitoring**
   - Links to Somnia Explorer for transaction history
   - Real-time balance updates after token transfers
   - Error handling for network issues
``` 
## Project Structure

```
├── app/                  # Next.js application pages
├── components/           # Reusable UI components
├── contracts/           # Smart contract source files
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── public/             # Static assets
├── scripts/            # Deployment and utility scripts
├── test/              # Test files
└── types/             # TypeScript type definitions
```
## Usage

### Deploy Token Contract
```bash
npx hardhat run scripts/deploy.js --network primordial
```

### Wrap Features with FeatureGate
```typescript
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';

export default function MyFeaturePage() {
  return (
    <FeatureGate feature={FeatureType.CHATBOT}>
      <MyFeatureContent />
    </FeatureGate>
  );
}
```

### Check User Credits Programmatically
```typescript
import { useCredits } from '@/hooks/useCredits';

function MyComponent() {
  const { credits, checkFeatureAccess } = useCredits();
  
  const handleAction = async () => {
    const access = await checkFeatureAccess(FeatureType.SMART_CONTRACT_GENERATOR);
    if (access.hasAccess) {
      // User has sufficient credits
    } else {
      // Show insufficient credits message
    }
  };
}
```

## Components

- **FeatureGate**: Wraps features and blocks access if insufficient credits
- **WalletConnection**: Shows wallet status and UTK balance in navbar
- **Web3Service**: Handles blockchain interactions and token balance checking
- **CreditService**: Manages feature access logic and thresholds

## Features Implemented

All feature pages now have token-gated access:
- ✅ AI Chatbot (`/chatbot`) - 1 UTK
- ✅ Smart Contract Generator (`/contract`) - 5 UTK  
- ✅ Trading Assistant (`/tradeassistant`) - 3 UTK
- ✅ Ask Crypto People (`/askpeople`) - 2 UTK
- ✅ Web3 News AI (`/news`) - 1 UTK
 - ✅ Somnia Ecosystem Explorer (`/somnia`) - 9 UTK
 - ✅ Gaming Development Bot (`/gamingbot`) - 11 UTK
 - ✅ Infrastructure Agents (`/infrastructure`) - 13 UTK
 - ✅ Token Faucet Claim (`/claim`) - Claim 100 UTK (requires SOM gas)
 