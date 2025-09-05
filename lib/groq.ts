import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from "langchain/chains";

const groq = new ChatGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

// Prompt template for generating smart contracts
const generatePrompt = new PromptTemplate({
  template: `Generate a secure and optimized {type} smart contract for {chain} using OpenZeppelin standards. Include license, SPDX identifier, and inline comments.`,
  inputVariables: ["type", "chain"],
});

const generateChain = new LLMChain({
  llm: groq,
  prompt: generatePrompt,
});

// Refined prompt template for auditing Solidity smart contracts only
const auditPrompt = new PromptTemplate({
  template: `You are a top-tier blockchain security auditor with expertise in multiple smart contract languages and blockchain platforms. Analyze the provided smart contract code and produce a comprehensive audit report following these guidelines:

1. **Initial Assessment**:
   - Verify code validity (respond with "Error: Invalid smart contract code" if unusable)
   - Identify blockchain platform (EVM, Solana, Cosmos, Somnia Blockchain etc.)
   - Note contract type (DeFi, NFT, DAO, etc.)

2. **Audit Scope**:
   a) Security Analysis:
      - Critical vulnerabilities (reentrancy, oracle manipulation, etc.)
      - Protocol-specific risks (flash loans, MEV, etc.)
      - Access control issues
      - Cryptographic weaknesses
   
   b) Performance:
      - Gas optimization (EVM) or compute unit optimization (Solana)
      - Storage efficiency
      - Batch operation opportunities

   c) Code Quality:
      - Compliance with platform-specific best practices
      - Documentation adequacy
      - Test coverage recommendations
      - Upgradeability considerations

   d) Business Logic:
      - Economic model flaws
      - Tokenomics risks
      - Governance vulnerabilities

3. **Reporting Format**:
For each finding, use this strict format:

[Platform]: [Detected Platform]
[Contract Type]: [Detected Type]

Severity: [Critical/High/Medium/Low/Informational]
Category: [Security/Performance/Code Quality/Business Logic]
Title: [Concise Issue Description]
Description: [Technical explanation with impact analysis]
Location: [File/Line Numbers if available]
Recommendation: [Detailed fix guidance]
Proof of Concept: [Optional exploit scenario for critical issues]

Additional Notes:
- For non-EVM chains, include chain-specific considerations
- Highlight any centralization risks
- Flag all external dependencies
- Note any incomplete or placeholder code

Example valid input formats:
\`\`\`[language]
{code}
\`\`\`

OR

[Blockchain Platform]: [Optional specification]
\`\`\`
{code}
\`\`\`

Do not include any introductory text or summary - only the structured findings.`,
  inputVariables: ["code"]
});

const auditChain = new LLMChain({
  llm: groq,
  prompt: auditPrompt,
});

// Simple Solidity smart contract validation function
function isSolidityCode(code: string): boolean {
  // Check for pragma solidity and contract keyword presence (basic check)
  const hasPragma = /pragma\s+solidity\s+[^;]+;/.test(code);
  const hasContract = /contract\s+\w+/.test(code);
  return hasPragma && hasContract;
}

export async function generateContract(chain: string, type: string): Promise<string> {
  try {
    const res = await generateChain.call({ type, chain });
    return res.text;
  } catch (error) {
    console.error("Error generating contract:", error);
    throw new Error("Failed to generate contract");
  }
}

export async function auditContract(code: string): Promise<string> {
  if (!isSolidityCode(code)) {
    throw new Error("Input is not a valid Solidity smart contract.");
  }
  try {
    const res = await auditChain.call({ code });
    return res.text;
  } catch (error) {
    console.error("Error auditing contract:", error);
    throw new Error("Failed to audit contract");
  }
}
