/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, KeyboardEvent, useEffect } from "react";
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  FiMessageSquare, FiBookmark, FiTrendingUp, FiHelpCircle, FiSend, FiStar, FiChevronRight, FiChevronLeft, FiUsers, FiSearch, FiX, FiClock, FiThumbsUp, FiShare2, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import { RiRobot2Line, RiSparklingFill } from 'react-icons/ri';
import Link from "next/link";
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { Brain, Zap, Shield, Users, MessageSquare, TrendingUp, Sparkles, Network, Database, Code2, Bot } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface SavedQuestion {
  id: string;
  question: string;
  
  answers: {aiName: string; answer: string}[];
  timestamp: Date;
}

interface AIResponse {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  answer: string;
  loading: boolean;
  rating: number | null;
  expanded: boolean;
}

const AskPeopleContent = () => {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [username, setUsername] = useState<string>("CryptoExplorer");
  const [activeTab, setActiveTab] = useState<'ask' | 'saved' | 'trending'>('ask');
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const [aiResponses, setAiResponses] = useState<AIResponse[]>([
    {
      id: '1',
      name: 'Market Analyst',
      avatar: '📈',
      specialty: 'Price trends and market analysis',
      answer: 'Ask me about cryptocurrency market trends and price action...',
      loading: false,
      rating: null,
      expanded: true
    },
    {
      id: '2',
      name: 'Blockchain Dev',
      avatar: '👨‍💻',
      specialty: 'Technical blockchain concepts',
      answer: 'Ask me about blockchain technology and smart contracts...',
      loading: false,
      rating: null,
      expanded: true
    },
    {
      id: '3',
      name: 'DeFi Expert',
      avatar: '🏦',
      specialty: 'Decentralized finance',
      answer: 'Ask me about DeFi protocols and yield farming...',
      loading: false,
      rating: null,
      expanded: true
    },
    {
      id: '4',
      name: 'Crypto Lawyer',
      avatar: '⚖️',
      specialty: 'Regulatory compliance',
      answer: 'Ask me about cryptocurrency regulations and legal aspects...',
      loading: false,
      rating: null,
      expanded: true
    }
  ]);

  const avatars = [
    '🦊', '🐺', '🐱', '🐭', '🐹', '🐰', '🦝', '🐻', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'
  ];

  const getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];

  const getApiKey = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GROQTA_API_KEY) {
      return process.env.NEXT_PUBLIC_GROQTA_API_KEY;
    }
    return null;
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cryptoAssistantSavedQuestions');
      if (saved) {
        setSavedQuestions(JSON.parse(saved));
      }
      
      const user = localStorage.getItem('cryptoAssistantUsername');
      if (user) {
        setUsername(user);
      }
    } catch (error) {
      console.error("Failed to load saved data", error);
    }
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }
    
    const apiKey = getApiKey();
    if (!apiKey) {
      setError("API service is currently unavailable");
      return;
    }

    setLoading(true);
    setError(null);
    setComments([]);

    setAiResponses(prev => prev.map(ai => ({
      ...ai,
      answer: "Analyzing your question...",
      loading: true
    })));

    try {
      const chat = new ChatGroq({
        apiKey: apiKey,
        model: "llama-3.3-70b-versatile",
        maxRetries: 2,
        timeout: 15000,
      });

      const prompts = {
        analyst: ChatPromptTemplate.fromMessages([
          ["system", `You are a cryptocurrency market analyst with 10 years experience. Respond with:
          - Current market trends (1-2 sentences)
          - Price analysis (key levels)
          - Trading volume insights
          - Risk assessment
          - Maximum 5 concise bullet points (*)
          - Format with Markdown (*)
          - Keep response under 300 characters`],
          ["human", "{input}"],
        ]),
        developer: ChatPromptTemplate.fromMessages([
          ["system", `You are a senior blockchain developer. Respond with:
          - Technical explanations (simplified)
          - Smart contract insights
          - Protocol architecture
          - Security considerations
          - Maximum 5 concise bullet points (*)
          - Format with Markdown (*)
          - Keep response under 300 characters`],
          ["human", "{input}"],
        ]),
        defi: ChatPromptTemplate.fromMessages([
          ["system", `You are a DeFi expert. Respond with:
          - Protocol comparisons
          - Yield farming strategies
          - Risk/reward analysis
          - Gas fee considerations
          - Maximum 5 concise bullet points (*)
          - Format with Markdown (*)
          - Keep response under 300 characters`],
          ["human", "{input}"],
        ]),
        lawyer: ChatPromptTemplate.fromMessages([
          ["system", `You are a cryptocurrency regulatory expert. Respond with:
          - Compliance requirements
          - Jurisdictional differences
          - Tax implications
          - Legal risks
          - Maximum 5 concise bullet points (*)
          - Format with Markdown (*)
          - Keep response under 300 characters`],
          ["human", "{input}"],
        ])
      };

      const responses = await Promise.all([
        processAIResponse(chat, prompts.analyst, question, 0),
        processAIResponse(chat, prompts.developer, question, 1),
        processAIResponse(chat, prompts.defi, question, 2),
        processAIResponse(chat, prompts.lawyer, question, 3)
      ]);

      setAiResponses(prev => prev.map((ai, index) => ({
        ...ai,
        answer: responses[index] || "Could not generate response",
        loading: false
      })));

      addNotification(`Answers generated for: "${question.substring(0, 30)}${question.length > 30 ? '...' : ''}"`);
      
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to get some responses. Please try again later.");
      setAiResponses(prev => prev.map(ai => ({
        ...ai,
        answer: "I couldn't process your question at this time.",
        loading: false
      })));
    } finally {
      setLoading(false);
    }
  };

  const processAIResponse = async (chat: any, prompt: any, question: string, index: number) => {
    try {
      const messages = await prompt.formatMessages({
        input: question,
      });

      const res = await chat.invoke(messages);
      return typeof res.content === 'string' ? res.content : "Unexpected response format";
    } catch (err) {
      console.error(`Error processing AI ${index}:`, err);
      return "Failed to generate response";
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      username: username,
      avatar: getRandomAvatar(),
      text: newComment,
      timestamp: new Date(),
      isUser: true,
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    addNotification(`${username} commented on this question`);
  };

  const handleSaveQuestion = () => {
    if (!question.trim() || aiResponses.some(ai => ai.answer.includes("Ask me anything"))) return;
    
    const savedItem: SavedQuestion = {
      id: Date.now().toString(),
      question,
      answers: aiResponses.map(ai => ({
        aiName: ai.name,
        answer: ai.answer
      })),
      timestamp: new Date(),
    };
    
    const updatedSaved = [...savedQuestions, savedItem];
    setSavedQuestions(updatedSaved);
    localStorage.setItem('cryptoAssistantSavedQuestions', JSON.stringify(updatedSaved));
    addNotification("Question and all responses saved");
  };

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleRateAnswer = (aiId: string, stars: number) => {
    setAiResponses(prev => prev.map(ai => 
      ai.id === aiId ? { ...ai, rating: stars } : ai
    ));
    addNotification(`You rated an answer ${stars} star${stars > 1 ? 's' : ''}`);
  };

  const filteredQuestions = savedQuestions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answers.some(a => a.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleCommentKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        
        {/* Floating orbs */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl animate-pulse"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Navigation Header */}
      <header className="relative z-40 glass-strong border-b border-cyan-500/20 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-white/5 transition-all duration-300 hover-lift">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <div className="h-8 w-px bg-white/20" />
            </div>
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-12 h-12 glass-strong rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:neon-glow-cyan transition-all">
                  <Brain className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-display text-holographic">Sage AI</h1>
                <p className="text-xs text-cyan-400 font-cyber tracking-wider">ASK THE EXPERTS</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-cyber text-green-400">4 EXPERTS ONLINE</span>
              </div>
              
              <button className="btn-cyber px-4 py-2 text-sm hover-lift">
                <FiRefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-8 px-6 py-8">
        {/* Professional Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 glass-strong border border-cyan-500/20 rounded-3xl p-6 h-fit sticky top-8 hover:neon-glow-cyan transition-all group overflow-hidden">
          {/* Holographic overlay */}
          <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
          
          <div className="relative z-10 space-y-6">
            {/* Expert Status */}
            <div className="text-center p-6 glass rounded-2xl border border-cyan-500/20">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <RiRobot2Line className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
                </div>
              </div>
              <h3 className="font-display text-xl text-holographic mb-2">AI Expert Panel</h3>
              <p className="text-sm text-gray-400 font-cyber">4 Specialists Ready to Help</p>
              <div className="flex justify-center gap-1 mt-3">
                {['📈', '👨‍💻', '🏦', '⚖️'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 glass rounded-full flex items-center justify-center text-sm border border-cyan-500/20">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('ask')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-display transition-all hover-lift ${
                  activeTab==='ask' 
                    ? 'btn-holographic text-white border-cyan-500' 
                    : 'glass border border-cyan-500/20 text-gray-300 hover:text-white hover:border-cyan-500/40'
                }`}
              > 
                <MessageSquare className="w-5 h-5" />
                <span className="text-lg font-semibold">ASK EXPERTS</span>
                {activeTab === 'ask' && <RiSparklingFill className="w-4 h-4 text-cyan-400 ml-auto animate-pulse" />}
              </button>
              
              <button 
                onClick={() => setActiveTab('saved')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-display transition-all hover-lift ${
                  activeTab==='saved' 
                    ? 'btn-holographic text-white border-purple-500' 
                    : 'glass border border-purple-500/20 text-gray-300 hover:text-white hover:border-purple-500/40'
                }`}
              > 
                <FiBookmark className="w-5 h-5" />
                <span className="text-lg font-semibold">SAVED ({savedQuestions.length})</span>
                {activeTab === 'saved' && <RiSparklingFill className="w-4 h-4 text-purple-400 ml-auto animate-pulse" />}
              </button>
              
              <button 
                onClick={() => setActiveTab('trending')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-display transition-all hover-lift ${
                  activeTab==='trending' 
                    ? 'btn-holographic text-white border-green-500' 
                    : 'glass border border-green-500/20 text-gray-300 hover:text-white hover:border-green-500/40'
                }`}
              > 
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg font-semibold">TRENDING</span>
                {activeTab === 'trending' && <RiSparklingFill className="w-4 h-4 text-green-400 ml-auto animate-pulse" />}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass p-4 rounded-xl border border-cyan-500/20 text-center hover-lift">
                <div className="text-2xl font-bold text-cyan-400">{comments.length}</div>
                <div className="text-xs text-gray-400 font-cyber">COMMENTS</div>
              </div>
              <div className="glass p-4 rounded-xl border border-purple-500/20 text-center hover-lift">
                <div className="text-2xl font-bold text-purple-400">{savedQuestions.length}</div>
                <div className="text-xs text-gray-400 font-cyber">SAVED</div>
              </div>
            </div>

            {/* Help Section */}
            <button 
              onClick={toggleHelp} 
              className="w-full flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-yellow-500/20 text-yellow-400 hover:border-yellow-500/40 transition-all hover-lift font-display"
            > 
              <FiHelpCircle className="w-5 h-5" />
              <span className="font-semibold">HELP & TIPS</span>
            </button>
          </div>
        </aside>

        {/* Professional Main Content */}
        <main className="flex-1 space-y-8">
          {/* Enhanced Notifications */}
          <div className="fixed top-24 right-8 z-50 space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="glass-strong border border-green-500/30 rounded-2xl p-4 shadow-xl animate-slide-up hover:neon-glow-cyan">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-display text-sm">{n.message}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'ask' && (
            <section className="space-y-8">
              {/* Professional Question Input Card */}
              <div className="glass-strong border-2 border-cyan-500/30 rounded-3xl p-8 hover:neon-glow-cyan transition-all group overflow-hidden relative">
                {/* Holographic overlay */}
                <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
                
                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass-strong rounded-2xl flex items-center justify-center border border-cyan-500/30">
                        <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl text-holographic">Ask Your Question</h2>
                        <p className="text-sm text-gray-400 font-cyber">Get expert insights from 4 AI specialists</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-cyan-500/30">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-cyber text-cyan-400">{username}</span>
                    </div>
                  </div>

                  {/* Input Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={question} 
                          onChange={e => { 
                            setQuestion(e.target.value); 
                            setError(null); 
                          }} 
                          onKeyDown={handleKeyDown} 
                          className="w-full p-6 rounded-2xl glass border border-cyan-500/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg font-display transition-all" 
                          placeholder="Ask anything about crypto, DeFi, blockchain, or regulations..." 
                          disabled={loading} 
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {loading && [...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleAsk} 
                        disabled={loading || !question.trim()} 
                        className={`px-8 py-6 rounded-2xl font-display text-lg transition-all hover-lift ${
                          loading 
                            ? 'glass border border-gray-600 cursor-not-allowed opacity-70' 
                            : !question.trim() 
                              ? 'glass border border-gray-700 cursor-not-allowed opacity-50' 
                              : 'btn-holographic border-cyan-500 hover:neon-glow-cyan'
                        } flex items-center justify-center`}
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <span className="font-semibold">ANALYZING...</span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-3 font-semibold">
                            <FiSend className="w-5 h-5" />
                            ASK EXPERTS
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Username input and Quick Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-cyan-500/20">
                      <div className="flex items-center gap-4">
                        <input 
                          type="text" 
                          value={username} 
                          onChange={e => { 
                            setUsername(e.target.value); 
                            localStorage.setItem('cryptoAssistantUsername', e.target.value); 
                          }} 
                          className="px-4 py-2 rounded-lg glass border border-purple-500/30 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm font-display" 
                          placeholder="Your display name" 
                        />
                        <div className="text-sm text-gray-400 font-cyber">as</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSaveQuestion} 
                          disabled={!question.trim() || aiResponses.some(ai => ai.answer.includes("Ask me anything"))} 
                          className="btn-cyber px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 hover-lift"
                        >
                          <FiBookmark className="w-4 h-4" /> SAVE
                        </button>
                        <button className="btn-cyber px-4 py-2 text-sm flex items-center gap-2 hover-lift">
                          <FiShare2 className="w-4 h-4" /> SHARE
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-3 p-4 glass rounded-xl border border-red-500/30 text-red-400">
                      <Shield className="w-5 h-5" />
                      <span className="font-display">{error}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Expert Responses Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Individual Expert Cards */}
                {aiResponses.map(ai => (
                  <div key={ai.id} className="glass-strong border-2 border-cyan-500/20 rounded-3xl overflow-hidden hover:neon-glow-cyan transition-all hover-lift group">
                    {/* Holographic overlay */}
                    <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-15 transition-opacity duration-700" />
                    
                    {/* Expert Header */}
                    <div className="p-6 border-b border-cyan-500/20 relative z-10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 glass-strong rounded-2xl flex items-center justify-center border border-cyan-500/30 text-2xl">
                            {ai.avatar}
                          </div>
                          <div>
                            <h3 className="font-display text-lg text-holographic group-hover:text-cyan-400 transition-colors">{ai.name}</h3>
                            <p className="text-xs text-gray-400 font-cyber">{ai.specialty}</p>
                          </div>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${ai.loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                          <span className="text-xs font-cyber text-gray-400">{ai.loading ? 'ANALYZING' : 'READY'}</span>
                        </div>
                      </div>
                    </div>
                  
                    {/* Expert Response Content */}
                    <div className="p-6 relative z-10 min-h-[300px] flex flex-col">
                      <div className="flex-1">
                        {ai.loading ? (
                          <div className="space-y-4">
                            <div className="glass rounded-xl p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="loading-dots">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                                <span className="text-cyan-400 font-cyber">Analyzing your question...</span>
                              </div>
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className={`h-3 rounded-full glass mb-3 ${i%2===0 ? 'w-full' : 'w-4/5'} loading-shimmer`}></div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ai.answer.startsWith('*') ? (
                              <ul className="space-y-3">
                                {ai.answer.split('\n').filter(line => line.trim()).map((line, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse flex-shrink-0" />
                                    <span className="text-gray-200 leading-relaxed">{line.replace('*', '').trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-200 text-sm leading-relaxed">{ai.answer}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Rating and Actions */}
                      <div className="pt-4 mt-4 border-t border-cyan-500/20 flex items-center justify-between">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => handleRateAnswer(ai.id, star)} 
                              className={`transition-all hover-lift p-1 ${
                                ai.rating && star <= ai.rating 
                                  ? 'text-yellow-400 neon-glow-cyan' 
                                  : 'text-gray-500 hover:text-yellow-400'
                              }`}
                              disabled={ai.loading}
                            > 
                              <FiStar fill={ai.rating && star <= ai.rating ? 'currentColor' : 'none'} className="w-4 h-4" /> 
                            </button>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="btn-cyber px-3 py-1 text-xs hover-lift" disabled={ai.loading}>
                            <FiThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="btn-cyber px-3 py-1 text-xs hover-lift" disabled={ai.loading}>
                            <FiShare2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Professional Discussion Panel */}
              <div className="mt-8">
                {/* Enhanced Discussion Card */}
                <div className="glass-strong border-2 border-purple-500/30 rounded-3xl flex flex-col hover:neon-glow-purple transition-all hover-lift relative overflow-hidden group">
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                  
                  <div className="p-8 border-b border-purple-500/20 flex items-center gap-3 relative z-10">
                    <FiUsers className="w-6 h-6 text-purple-400 animate-pulse" /> 
                    <span className="font-display text-xl">Discussion ({comments.length})</span>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-8 custom-scrollbar relative z-10">
                    {comments.length > 0 ? (
                      <div className="space-y-6">
                        {comments.map(comment => (
                          <div key={comment.id} className={`p-6 rounded-2xl glass-card border transition-all hover-lift ${
                            comment.isUser 
                              ? 'border-cyan-500/30 hover:neon-glow-cyan' 
                              : 'border-purple-500/30 hover:neon-glow-purple'
                          }`}> 
                            <div className="flex items-start gap-4">
                              <div className="text-2xl">{comment.avatar}</div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div className={`font-cyber tracking-wide ${
                                    comment.isUser ? 'text-cyan-400' : 'text-purple-400'
                                  }`}>
                                    {comment.username} {comment.isUser && '(You)'}
                                  </div>
                                  <div className="text-xs text-gray-400 font-cyber">
                                    {formatDate(comment.timestamp)}
                                  </div>
                                </div>
                                <p className="text-gray-200 leading-relaxed">{comment.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-400 font-cyber tracking-wide">No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 border-t border-purple-500/20 relative z-10">
                    <div className="flex gap-4">
                      <textarea 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        onKeyDown={handleCommentKeyDown} 
                        className="flex-1 p-4 rounded-xl glass border border-purple-500/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-cyber custom-scrollbar" 
                        placeholder="Add your comment..." 
                        rows={3} 
                      />
                      <button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim()} 
                        className="self-end btn-holographic px-6 py-4 font-cyber tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                      >
                        <FiSend className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Enhanced Saved Tab */}
          {activeTab === 'saved' && (
            <section className="flex flex-col gap-8">
              <div className="glass-strong border border-cyan-500/30 rounded-2xl p-6 hover-glow">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-4 text-cyan-400" />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    className="w-full pl-12 pr-4 py-4 rounded-xl glass border border-cyan-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-cyber" 
                    placeholder="Search saved questions..." 
                  />
                </div>
              </div>
              
              {filteredQuestions.length > 0 ? (
                <div className="grid gap-6">
                  {filteredQuestions.map(q => (
                    <div 
                      key={q.id} 
                      className="glass-card border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl p-8 transition-all hover:neon-glow-cyan cursor-pointer hover-lift group" 
                      onClick={() => { 
                        setQuestion(q.question); 
                        setAiResponses(prev => prev.map(ai => { 
                          const savedAnswer = q.answers.find(a => a.aiName === ai.name); 
                          return { 
                            ...ai, 
                            answer: savedAnswer?.answer || "No response found", 
                            expanded: true 
                          }; 
                        })); 
                        setActiveTab('ask'); 
                        window.scrollTo(0,0); 
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-display text-lg text-white group-hover:text-cyan-400 transition-colors">{q.question}</h3>
                        <span className="px-3 py-1 rounded-full glass border border-cyan-500/30 text-xs text-cyan-400 font-cyber tracking-wider">
                          {new Date(q.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        <p className="line-clamp-2">{q.answers.map(a => `${a.aiName}: ${a.answer.split('\n')[0]}`).join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card border border-gray-700 rounded-3xl p-16 text-center"> 
                  <Brain className="w-16 h-16 text-gray-500 mx-auto mb-6 animate-pulse" />
                  <p className="text-gray-400 font-cyber tracking-wide mb-6">
                    {searchQuery ? 'No matching saved questions found' : 'You have no saved questions yet'}
                  </p>
                  <button 
                    onClick={() => setActiveTab('ask')} 
                    className="btn-holographic px-8 py-4 font-cyber tracking-wider hover-lift"
                  >
                    ASK A QUESTION
                  </button>
                </div>
              )}
            </section>
          )}

          {/* Enhanced Trending Tab */}
          {activeTab === 'trending' && (
            <section className="flex flex-col gap-8">
              <div className="glass-strong border border-green-500/30 rounded-2xl p-8 hover-glow">
                <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
                  <FiTrendingUp className="text-green-400 animate-pulse" /> 
                  Trending in Crypto
                </h2>
                
                <div className="grid gap-4">
                  {[
                    { topic: "Bitcoin Halving 2025 Analysis", posts: 1423, hot: true },
                    { topic: "Ethereum Dencun Upgrade Impact", posts: 892, hot: true },
                    { topic: "Solana vs Polygon: Layer 1 Showdown", posts: 765 },
                    { topic: "NFT Market Recovery Signs", posts: 621 },
                    { topic: "DeFi Yield Farming Strategies", posts: 587 },
                    { topic: "CBDC Developments Worldwide", posts: 432 },
                    { topic: "Meme Coin Season Predictions", posts: 398 }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="glass-card border border-green-500/20 hover:border-green-500/40 rounded-xl p-6 cursor-pointer transition-all hover:neon-glow-cyan hover-lift flex justify-between items-center group" 
                      onClick={() => { 
                        setQuestion(item.topic); 
                        setActiveTab('ask'); 
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`font-bold font-cyber text-lg ${
                          i < 3 ? 'text-cyan-400' : 'text-gray-400'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-white group-hover:text-cyan-400 transition-colors">{item.topic}</span>
                          {item.hot && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-cyber animate-pulse">
                              HOT
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 font-cyber">{item.posts} discussions</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Enhanced Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="glass-strong border-2 border-cyan-500/30 rounded-3xl p-8 max-w-2xl w-full neon-glow-purple relative overflow-hidden group">
            {/* Holographic overlay */}
            <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display flex items-center gap-3">
                  <FiHelpCircle className="text-cyan-400 animate-pulse" /> 
                  How to use CryptoChat
                </h2>
                <button 
                  onClick={toggleHelp} 
                  className="p-3 rounded-full glass border border-cyan-500/30 hover:neon-glow-cyan transition-all"
                > 
                  <FiX className="w-5 h-5 text-cyan-400" /> 
                </button>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-2xl border border-cyan-500/30">
                    <FiMessageSquare className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white mb-2">Ask Questions</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">Type your crypto-related question and get instant expert answers with key points.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-2xl border border-purple-500/30">
                    <FiBookmark className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white mb-2">Save Knowledge</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">Bookmark important answers to your personal collection for quick access later.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-2xl border border-green-500/30">
                    <FiTrendingUp className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-white mb-2">Stay Updated</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">Check trending topics to see what the crypto community is discussing right now.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={toggleHelp} 
                className="mt-8 w-full btn-holographic py-4 font-cyber tracking-wider hover-lift"
              >
                GOT IT!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AskCryptoPeoplePage() {
  return (
    <FeatureGate feature={FeatureType.ASK_PEOPLE}>
      <AskPeopleContent />
    </FeatureGate>
  );
}