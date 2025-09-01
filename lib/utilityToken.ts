import UtilityTokenArtifact from '../artifacts/contracts/UtilityToken.sol/UtilityToken.json';

// Replace this with your deployed UtilityToken address (from your .env or deployment logs)
export const UTILITY_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_UTILITY_TOKEN_ADDRESS || 'YOUR_DEPLOYED_UTILITY_TOKEN_ADDRESS';
export const UTILITY_TOKEN_ABI = UtilityTokenArtifact.abi;
