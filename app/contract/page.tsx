/* eslint-disable react/display-name */
"use client";
import React, { useState } from 'react';
import { generateContract, auditContract } from '@/lib/groq';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Bot, Shield, Code2, Zap, Brain, Cpu } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AuditResult = {
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
};

const ContractPageContent = () => {
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [contractType, setContractType] = useState('ERC20');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractCode, setContractCode] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [copyGenCode, setCopyGenCode] = useState(false);
  const [copyAuditCode, setCopyAuditCode] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'generator' | 'auditor'>('generator');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateContract(selectedChain, contractType);
      setGeneratedCode(result);
    } catch (err) {
      console.error("Generation failed", err);
    }
    setIsGenerating(false);
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await auditContract(contractCode);
      const results = parseAuditResult(result);
      setAuditResults(results);
    } catch (err) {
      console.error("Audit failed", err);
    }
    setIsAuditing(false);
  };

  const parseAuditResult = (text: string): AuditResult[] => {
    const blocks = text
      .split(/Severity:\s*/i)
      .slice(1)
      .map((block) => {
        const lines = block.trim().split('\n');
        const severity = lines[0].trim().toLowerCase() as AuditResult['severity'];
        const titleLine = lines.find((l) => l.toLowerCase().startsWith('title:'));
        const descLine = lines.find((l) => l.toLowerCase().startsWith('description:'));

        return {
          severity,
          title: titleLine?.split(':').slice(1).join(':').trim() ?? 'Unknown issue',
          description: descLine?.split(':').slice(1).join(':').trim() ?? 'No details provided',
        };
      });

    return blocks;
  };

  const copyToClipboard = (text: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex relative">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-3" />
      </div>

      {/* Modern Sidebar */}
      <aside className="w-80 min-h-full flex flex-col items-center py-12 px-6 bg-gray-900/80 backdrop-blur-sm border-r border-gray-700 relative">
        
        <Card className="w-full mb-12 bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all">
          <CardContent className="flex flex-col items-center py-8">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <Bot className="w-10 h-10 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">Sage AI</span>
            </Link>
            <span className="text-xs text-blue-400 font-semibold tracking-wider">SMART CONTRACTS</span>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4 w-full flex-1">
          <Button
            variant={sidebarTab === 'generator' ? 'default' : 'ghost'}
            className={`w-full justify-start px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
              sidebarTab === 'generator' 
                ? 'bg-blue-600 text-white border-blue-500' 
                : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white'
            }`}
            onClick={() => setSidebarTab('generator')}
          >
            <Code2 className="w-5 h-5 mr-3" />
            GENERATOR
          </Button>
          
          <Button
            variant={sidebarTab === 'auditor' ? 'default' : 'ghost'}
            className={`w-full justify-start px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
              sidebarTab === 'auditor' 
                ? 'bg-purple-600 text-white border-purple-500' 
                : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white'
            }`}
            onClick={() => setSidebarTab('auditor')}
          >
            <Shield className="w-5 h-5 mr-3" />
            AUDITOR
          </Button>
        </div>
        
        {/* Enhanced sidebar content */}
        <div className="w-full mt-auto">
          {sidebarTab === 'generator' && (
            <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 hover-glow">
              <h4 className="font-display text-cyan-400 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 animate-pulse" />
                How it works:
              </h4>
              <ul className="space-y-2 text-xs text-gray-300 font-cyber">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1 animate-pulse" />
                  Select blockchain & contract type
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-1 animate-pulse" />
                  Generate secure code instantly
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1 animate-pulse" />
                  Copy, deploy, or audit
                </li>
              </ul>
              
              <h4 className="font-display text-purple-400 mt-6 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                Templates:
              </h4>
              <div className="flex flex-wrap gap-2">
                {['ERC20', 'ERC721', 'Crowdsale'].map((template) => (
                  <span key={template} className="px-2 py-1 rounded-full glass border border-purple-500/30 text-xs text-purple-400 font-cyber">
                    {template}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {sidebarTab === 'auditor' && (
            <div className="glass-card p-6 rounded-2xl border border-purple-500/20 hover-glow">
              <h4 className="font-display text-purple-400 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 animate-pulse" />
                Security Tips:
              </h4>
              <ul className="space-y-2 text-xs text-gray-300 font-cyber">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-1 animate-pulse" />
                  Audit before mainnet deployment
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1 animate-pulse" />
                  Use OpenZeppelin libraries
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1 animate-pulse" />
                  Test extensively on testnets
                </li>
              </ul>
              
              <h4 className="font-display text-red-400 mt-6 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 animate-pulse" />
                Common Risks:
              </h4>
              <div className="space-y-1 text-xs text-gray-400 font-cyber">
                <div>• Reentrancy attacks</div>
                <div>• Integer overflows</div>
                <div>• Unprotected admin functions</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
          Smart Contract Generator & Auditor
        </h1>
        
        {sidebarTab === 'generator' && (
          <Card className="mb-12 bg-gray-800/50 border border-gray-700 hover:border-blue-500 transition-all rounded-xl overflow-hidden">
            
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                <Code2 className="w-8 h-8 text-blue-400" />
                Smart Contract Generator
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Enhanced Controls */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div>
                  <label htmlFor="chain" className="block mb-3 font-semibold text-blue-400 text-lg">Blockchain</label>
                  <select
                    id="chain"
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  >
                    <option>Ethereum</option>
                    <option>Polygon</option>
                    <option>Binance Smart Chain</option>
                    <option>Avalanche</option>
                    <option>Fantom</option>
                    <option>Arbitrum</option>
                    <option>Optimism</option>
                    <option>Somnia Blockchain</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contractType" className="block mb-3 font-semibold text-purple-400 text-lg">Contract Type</label>
                  <select
                    id="contractType"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                  >
                    <option>ERC20</option>
                    <option>ERC721</option>
                    <option>Crowdsale</option>
                    <option>ERC1155</option>
                    <option>Governance</option>
                    <option>DeFi</option>
                    <option>NFTMarketplace</option>
                    <option>SomniaBlockchainCustom</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-lg py-6 text-white"
                  >
                    {isGenerating ? (
                      <span className="flex items-center gap-3">
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        GENERATING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                        GENERATE
                      </span>
                    )}
                  </Button>
                </div>
              </section>

              {/* Enhanced Generated Code */}
              <section className="mb-8 relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display text-white flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-cyan-400 animate-pulse" />
                    Generated Smart Contract
                  </h2>
                  <button
                    onClick={() => copyToClipboard(generatedCode, setCopyGenCode)}
                    disabled={!generatedCode}
                    className="flex items-center gap-2 btn-cyber px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover-lift"
                  >
                    {copyGenCode ? (
                      <>
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span className="font-cyber">COPIED</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5" />
                        <span className="font-cyber">COPY</span>
                      </>
                    )}
                  </button>
                </div>
                
                {generatedCode ? (
                  <div className="glass-strong rounded-2xl border border-cyan-500/30 overflow-hidden hover-glow">
                    <SyntaxHighlighter
                      language="solidity"
                      style={oneDark}
                      customStyle={{
                        borderRadius: '0',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        backgroundColor: 'transparent',
                        padding: '2rem',
                        fontSize: '14px',
                      }}
                      className="custom-scrollbar"
                    >
                      {generatedCode}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="glass border border-gray-700 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Brain className="w-16 h-16 text-gray-500 mx-auto animate-pulse" />
                      <p className="text-gray-400 font-cyber tracking-wide">Generated smart contract will appear here</p>
                    </div>
                  </div>
                )}
              </section>
            </CardContent>
          </Card>
        )}
        
        {sidebarTab === 'auditor' && (
          <Card className="mb-12 glass-strong border-2 border-purple-500/30 hover:neon-glow-purple transition-all rounded-3xl overflow-hidden group">
            {/* Holographic overlay */}
            <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-display text-holographic flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-400 animate-pulse" />
                Contract Security Auditor
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              {/* Enhanced Audit Section */}
              <section className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-400 animate-pulse" />
                    Audit Contract
                  </h2>
                  <button
                    onClick={() => copyToClipboard(contractCode, setCopyAuditCode)}
                    disabled={!contractCode}
                    className="flex items-center gap-2 btn-cyber px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover-lift"
                  >
                    {copyAuditCode ? (
                      <>
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span className="font-cyber">COPIED</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5" />
                        <span className="font-cyber">COPY</span>
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  placeholder="Paste smart contract code to audit..."
                  className="w-full min-h-[400px] rounded-2xl border border-purple-500/30 glass p-6 font-mono text-sm resize-y text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 custom-scrollbar"
                />
              </section>
              
              <div className="flex justify-center mb-12">
                <Button
                  onClick={handleAudit}
                  disabled={isAuditing || !contractCode.trim()}
                  className="btn-holographic font-bold text-lg px-12 py-4 hover-lift group"
                >
                  {isAuditing ? (
                    <span className="flex items-center gap-3">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      AUDITING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Shield className="w-6 h-6 group-hover:animate-pulse" />
                      RUN SECURITY AUDIT
                    </span>
                  )}
                </Button>
              </div>
              
              {/* Enhanced Audit Results */}
              <section>
                <h3 className="text-2xl font-display mb-8 text-white flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-400 animate-pulse" />
                  Security Audit Results
                </h3>
                
                {auditResults.length === 0 ? (
                  <div className="glass border border-gray-700 rounded-2xl p-12 text-center">
                    <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400 font-cyber tracking-wide">No security issues found or audit not run yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {auditResults.map((result, i) => (
                      <li
                        key={i}
                        className={`glass-card p-6 rounded-2xl border-l-4 hover-lift transition-all ${
                          result.severity === 'high'
                            ? 'border-red-500 bg-red-500/10 hover:neon-glow-pink'
                            : result.severity === 'medium'
                            ? 'border-yellow-500 bg-yellow-500/10 hover:neon-glow-cyan'
                            : 'border-green-500 bg-green-500/10 hover:neon-glow-cyan'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`px-3 py-1 rounded-full glass border text-xs font-cyber tracking-wider ${
                            result.severity === 'high' ? 'border-red-500/30 text-red-400' :
                            result.severity === 'medium' ? 'border-yellow-500/30 text-yellow-400' :
                            'border-green-500/30 text-green-400'
                          }`}>
                            {result.severity.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-display text-white text-lg mb-2">{result.title}</h4>
                            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{result.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default function ContractsPage() {
  return (
    <FeatureGate feature={FeatureType.SMART_CONTRACT_GENERATOR}>
      <ContractPageContent />
    </FeatureGate>
  );
}