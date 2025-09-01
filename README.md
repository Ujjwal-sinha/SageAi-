# BlockSynth AI - Credit System Setup

## Overview
BlockSynth AI uses an ERC20 utility token (UTK) to gate features based on user token balance. Users must hold a minimum amount of tokens to access premium features.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Blockchain Configuration
```bash
# RPC URL for your blockchain network
NEXT_PUBLIC_RPC_URL=https://rpc.primordial.bdagscan.com

# Your deployed UtilityToken contract address
NEXT_PUBLIC_UTILITY_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890

# Blockchain explorer URL for transaction viewing
NEXT_PUBLIC_EXPLORER_URL=https://primordial.bdagscan.com
```

### Feature Credit Thresholds (in UTK tokens)
```bash
# Basic features
NEXT_PUBLIC_THRESHOLD_CHATBOT=1
NEXT_PUBLIC_THRESHOLD_NEWS_INSIGHTS=1
NEXT_PUBLIC_THRESHOLD_ASK_PEOPLE=2

# Advanced features  
NEXT_PUBLIC_THRESHOLD_CONTRACT_GENERATOR=5
NEXT_PUBLIC_THRESHOLD_TRADE_ASSISTANT=3
NEXT_PUBLIC_THRESHOLD_TOKEN_DESIGNER=8

# Premium features
NEXT_PUBLIC_THRESHOLD_NFT_GENERATOR=10
NEXT_PUBLIC_THRESHOLD_BLOCKCHAIN_ARCHITECT=15
NEXT_PUBLIC_THRESHOLD_DEFI_DESIGNER=20
NEXT_PUBLIC_THRESHOLD_PREMIUM_ANALYTICS=25
```

### Existing API Keys
```bash
# AI/LLM API keys
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_GROQTA_API_KEY=your_groqta_api_key
GROK_API_KEY=your_grok_api_key

# Deployment
DEPLOYER_PRIVATE_KEY=your_deployer_private_key
```

## How It Works

1. **Token Contract**: Deploy the UtilityToken.sol contract to your blockchain
2. **Feature Gating**: Each feature is wrapped with a `FeatureGate` component
3. **Balance Checking**: The system checks user's UTK balance via Web3 calls
4. **Access Control**: Users can only access features if their balance meets the threshold

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

Future features will automatically use the same system by wrapping with `FeatureGate`. 