/* eslint-disable react/display-name */
"use client";
import React, { useState } from 'react';
import { generateContract, auditContract } from '@/lib/groq';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-900 flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-full flex flex-col items-center py-10 px-4 bg-gradient-to-b from-black/90 via-gray-900/80 to-purple-900/80 border-r border-gray-800 shadow-lg">
        <Card className="w-full mb-8 bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-none shadow-md">
          <CardContent className="flex flex-col items-center py-6">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Bot className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-gray-300">BlockSynth AI</span>
            </Link>
            <span className="text-xs text-gray-400 tracking-wide">Smart Contracts</span>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-2 w-full flex-1">
          <Button
            variant={sidebarTab === 'generator' ? 'secondary' : 'ghost'}
            className={`w-full justify-start px-6 py-3 rounded-lg font-semibold text-base transition-all duration-150 ${sidebarTab === 'generator' ? 'ring-2 ring-purple-500 bg-gradient-to-r from-purple-800/80 via-blue-800/80 to-gray-700/80 text-white' : ''}`}
            onClick={() => setSidebarTab('generator')}
          >
            Generator
          </Button>
          <Button
            variant={sidebarTab === 'auditor' ? 'secondary' : 'ghost'}
            className={`w-full justify-start px-6 py-3 rounded-lg font-semibold text-base transition-all duration-150 ${sidebarTab === 'auditor' ? 'ring-2 ring-purple-500 bg-gradient-to-r from-purple-800/80 via-blue-800/80 to-gray-700/80 text-white' : ''}`}
            onClick={() => setSidebarTab('auditor')}
          >
            Auditor
          </Button>
        </div>
        {/* Sidebar short content at the bottom */}
        <div className="w-full mt-auto">
          {sidebarTab === 'generator' && (
            <div className="mb-4 text-xs text-gray-300 bg-gray-900/60 rounded p-3">
              <b>How it works:</b>
              <ul className="list-disc ml-4 mt-1">
                <li>Select blockchain & contract type</li>
                <li>Generate secure code instantly</li>
                <li>Copy, deploy, or audit</li>
              </ul>
              <b className="block mt-2">Templates:</b>
              <ul className="list-disc ml-4">
                <li>ERC20, ERC721, Crowdsale</li>
              </ul>
            </div>
          )}
          {sidebarTab === 'auditor' && (
            <div className="mb-4 text-xs text-gray-300 bg-gray-900/60 rounded p-3">
              <b>Security Tips:</b>
              <ul className="list-disc ml-4 mt-1">
                <li>Audit before mainnet</li>
                <li>Use OpenZeppelin libs</li>
                <li>Test on testnets</li>
              </ul>
              <b className="block mt-2">Common Risks:</b>
              <ul className="list-disc ml-4">
                <li>Reentrancy, overflows</li>
                <li>Unprotected admin</li>
              </ul>
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-0 sm:px-12 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-gray-300 drop-shadow-lg">
          Smart Contract Generator & Auditor
        </h1>
        {sidebarTab === 'generator' && (
          <Card className="mb-10 bg-gradient-to-br from-black/80 via-gray-900/80 to-purple-900/70 border border-purple-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-gray-300">Smart Contract Generator</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Controls */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="chain" className="block mb-1 font-semibold text-purple-400">Blockchain</label>
                  <select
                    id="chain"
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Ethereum</option>
                    <option>Polygon</option>
                    <option>Binance Smart Chain</option>
                    <option>Avalanche</option>
                    <option>Fantom</option>
                    <option>Arbitrum</option>
                    <option>Optimism</option>
                    <option>BlockDag</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contractType" className="block mb-1 font-semibold text-purple-400">Contract Type</label>
                  <select
                    id="contractType"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full rounded border border-gray-700 bg-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>ERC20</option>
                    <option>ERC721</option>
                    <option>Crowdsale</option>
                    <option>ERC1155</option>
                    <option>Governance</option>
                    <option>DeFi</option>
                    <option>NFTMarketplace</option>
                    <option>BlockDagCustom</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 rounded font-semibold text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 h-[48px]"
                    style={{marginTop: 0}}
                  >
                    {isGenerating ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                    Generate
                  </Button>
                </div>
              </section>

              {/* Generated Code */}
              <section className="mb-6 relative">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Generated Smart Contract</h2>
                  <button
                    onClick={() => copyToClipboard(generatedCode, setCopyGenCode)}
                    disabled={!generatedCode}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Copy generated code"
                  >
                    {copyGenCode ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                    Copy
                  </button>
                </div>
                {generatedCode ? (
                  <SyntaxHighlighter
                    language="solidity"
                    style={oneDark}
                    customStyle={{
                      borderRadius: '0.375rem',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      backgroundColor: '#000000',
                    }}
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                ) : (
                  <textarea
                    readOnly
                    placeholder="Generated smart contract will appear here"
                    className="w-full min-h-[16rem] rounded border border-gray-700 p-4 font-mono text-sm sm:text-base resize-y bg-black text-gray-100"
                  />
                )}
              </section>
            </CardContent>
          </Card>
        )}
        {sidebarTab === 'auditor' && (
          <Card className="mb-10 bg-gradient-to-br from-black/80 via-gray-900/80 to-purple-900/70 border border-purple-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-gray-300">Audit Contract</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Audit Section */}
              <section className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold">Audit Contract</h2>
                  <button
                    onClick={() => copyToClipboard(contractCode, setCopyAuditCode)}
                    disabled={!contractCode}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Copy contract code"
                  >
                    {copyAuditCode ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                    Copy
                  </button>
                </div>
                <textarea
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  placeholder="Paste smart contract code to audit"
                  className="w-full min-h-[16rem] rounded border border-gray-700 p-4 font-mono text-sm sm:text-base resize-y bg-black text-gray-100"
                />
              </section>
              <Button
                onClick={handleAudit}
                disabled={isAuditing || !contractCode.trim()}
                className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 rounded bg-gradient-to-r from-purple-700 via-blue-700 to-gray-700 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed mb-10"
              >
                {isAuditing ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  'Run Audit'
                )}
              </Button>
              {/* Audit Results */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Audit Results</h3>
                {auditResults.length === 0 ? (
                  <p className="text-gray-400 text-center">No issues found or audit not run yet.</p>
                ) : (
                  <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                    {auditResults.map((result, i) => (
                      <li
                        key={i}
                        className={`p-4 rounded border-l-4 shadow-sm ${
                          result.severity === 'high'
                            ? 'border-red-600 bg-red-900/30'
                            : result.severity === 'medium'
                            ? 'border-yellow-500 bg-yellow-900/30'
                            : 'border-green-500 bg-green-900/30'
                        }`}
                      >
                        <strong className="block mb-1 text-lg capitalize">{result.severity}:</strong>
                        <p className="font-semibold mb-1">{result.title}</p>
                        <p className="text-sm text-gray-300 whitespace-pre-line">{result.description}</p>
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
