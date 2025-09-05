/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, KeyboardEvent, useEffect } from "react";
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  FiMessageSquare, FiBookmark, FiTrendingUp, FiHelpCircle, FiSend, FiStar, FiChevronRight, FiChevronLeft, FiUsers, FiSearch, FiX
} from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import Link from "next/link";
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { Brain, Zap, Shield, Users, MessageSquare, TrendingUp } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-black text-gray-100 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-20">
        <div className="cyber-grid opacity-10" />
        <div className="hex-pattern opacity-5" />
        <div className="circuit-pattern opacity-3" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="blockchain-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Hero Section */}
      <section className="w-full px-8 py-16 flex flex-col items-center justify-center glass border-b border-cyan-500/20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        
        <div className="max-w-5xl text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display text-holographic text-glow mb-6">
            Ask the Crypto Experts
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Get instant, expert answers from AI specialists in crypto, DeFi, blockchain, and regulations. 
            <span className="text-cyan-400 font-semibold">Save, discuss, and explore</span> trending topics—all in one place.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-6 py-3 rounded-full glass border border-cyan-500/30 text-cyan-400 font-cyber text-sm tracking-wider">
              LIVE AI EXPERTS
            </span>
            <span className="px-6 py-3 rounded-full glass border border-purple-500/30 text-purple-400 font-cyber text-sm tracking-wider">
              COMMUNITY Q&A
            </span>
            <span className="px-6 py-3 rounded-full glass border border-green-500/30 text-green-400 font-cyber text-sm tracking-wider">
              SAVE & DISCUSS
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-8 px-8">
        {/* Enhanced Sidebar */}
        <aside className="hidden md:flex flex-col gap-6 w-64 py-8 px-6 glass-strong border-r border-cyan-500/20 relative">
          {/* Animated border */}
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent animate-pulse" />
          
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="relative">
              <span className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse block"></span>
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-pulse" />
            </div>
            <span className="font-display text-xl tracking-wide text-holographic group-hover:text-glow">Sage AI</span>
          </Link>
          
          <button 
            onClick={() => setActiveTab('ask')} 
            className={`flex items-center gap-4 px-6 py-4 rounded-xl font-cyber tracking-wider transition-all hover-lift ${
              activeTab==='ask' 
                ? 'btn-holographic border-2 border-cyan-500/50 neon-glow-cyan' 
                : 'glass border border-gray-700 hover:border-cyan-500/30 text-gray-300 hover:text-white'
            }`}
          > 
            <FiMessageSquare className="w-5 h-5" /> ASK
          </button>
          
          <button 
            onClick={() => setActiveTab('saved')} 
            className={`flex items-center gap-4 px-6 py-4 rounded-xl font-cyber tracking-wider transition-all hover-lift ${
              activeTab==='saved' 
                ? 'btn-holographic border-2 border-purple-500/50 neon-glow-purple' 
                : 'glass border border-gray-700 hover:border-purple-500/30 text-gray-300 hover:text-white'
            }`}
          > 
            <FiBookmark className="w-5 h-5" /> SAVED
          </button>
          
          <button 
            onClick={() => setActiveTab('trending')} 
            className={`flex items-center gap-4 px-6 py-4 rounded-xl font-cyber tracking-wider transition-all hover-lift ${
              activeTab==='trending' 
                ? 'btn-holographic border-2 border-green-500/50 neon-glow-cyan' 
                : 'glass border border-gray-700 hover:border-green-500/30 text-gray-300 hover:text-white'
            }`}
          > 
            <FiTrendingUp className="w-5 h-5" /> TRENDING
          </button>
          
          <div className="mt-auto pt-8 border-t border-cyan-500/20 flex flex-col gap-3">
            <button 
              onClick={toggleHelp} 
              className="flex items-center gap-3 px-6 py-3 rounded-lg glass border border-gray-700 hover:border-cyan-500/30 hover:glass-strong transition-all font-cyber"
            > 
              <FiHelpCircle className="w-4 h-4" /> HELP
            </button>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 flex flex-col gap-10 py-8">
          {/* Enhanced Notifications */}
          <div className="fixed top-8 right-8 z-50 space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="glass-card border border-cyan-500/30 rounded-xl p-4 neon-glow-cyan animate-slide-up">
                <span className="text-cyan-400 font-cyber text-sm tracking-wide">{n.message}</span>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'ask' && (
            <section className="flex flex-col gap-10">
              {/* Enhanced Question Input */}
              <div className="glass-strong border-2 border-cyan-500/30 rounded-3xl p-8 flex flex-col gap-6 hover:neon-glow-purple transition-all hover-lift relative overflow-hidden group"> 
                {/* Holographic overlay */}
                <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                
                <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => { 
                      setUsername(e.target.value); 
                      localStorage.setItem('cryptoAssistantUsername', e.target.value); 
                    }} 
                    className="w-40 p-4 rounded-xl glass border border-purple-500/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-cyber" 
                    placeholder="Your name" 
                  />
                  
                  <input 
                    type="text" 
                    value={question} 
                    onChange={e => { 
                      setQuestion(e.target.value); 
                      setError(null); 
                    }} 
                    onKeyDown={handleKeyDown} 
                    className="flex-1 p-4 rounded-xl glass border border-cyan-500/30 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-cyber" 
                    placeholder="Ask anything about crypto..." 
                    disabled={loading} 
                  />
                  
                  <button 
                    onClick={handleAsk} 
                    disabled={loading || !question.trim()} 
                    className={`p-4 rounded-xl font-cyber tracking-wider transition-all hover-lift ${
                      loading 
                        ? 'glass border border-gray-600 cursor-not-allowed opacity-70' 
                        : !question.trim() 
                          ? 'glass border border-gray-700 cursor-not-allowed opacity-50' 
                          : 'btn-holographic hover:neon-glow-cyan'
                    } flex items-center justify-center`}
                  >
                    {loading ? (
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FiSend className="w-5 h-5" />
                        ASK
                      </span>
                    )}
                  </button>
                </div>
                
                {error && <p className="text-red-400 text-sm mt-2 font-cyber">{error}</p>}
              </div>

              {/* Enhanced AI & Discussion Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Enhanced AI Expert Cards */}
                <div className="glass-strong border-2 border-cyan-500/30 rounded-3xl flex flex-col hover:neon-glow-cyan transition-all hover-lift relative overflow-hidden group">
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                  
                  <div className="flex justify-between items-center p-8 border-b border-cyan-500/20 relative z-10">
                    <h2 className="font-display text-xl flex items-center gap-3">
                      <RiRobot2Line className="text-cyan-400 animate-pulse" /> 
                      Expert Responses
                    </h2>
                    <button 
                      onClick={handleSaveQuestion} 
                      disabled={!question.trim() || aiResponses.some(ai => ai.answer.includes("Ask me anything"))} 
                      className="btn-cyber px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 hover-lift"
                    >
                      <FiBookmark className="w-4 h-4" /> SAVE ALL
                    </button>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 gap-6 relative z-10">
                    {aiResponses.map(ai => (
                      <div key={ai.id} className="glass-card border border-cyan-500/20 rounded-2xl p-6 transition-all hover:glass-strong hover:border-cyan-500/40 hover-lift group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{ai.avatar}</span>
                            <div>
                              <h3 className="font-display text-lg text-white group-hover:text-cyan-400 transition-colors">{ai.name}</h3>
                              <p className="text-xs text-gray-400 font-cyber">{ai.specialty}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <button 
                                key={star} 
                                onClick={() => handleRateAnswer(ai.id, star)} 
                                className={`transition-all hover-lift ${
                                  ai.rating && star <= ai.rating 
                                    ? 'text-yellow-400 neon-glow-cyan' 
                                    : 'text-gray-500 hover:text-yellow-400'
                                }`}
                              > 
                                <FiStar fill={ai.rating && star <= ai.rating ? 'currentColor' : 'none'} className="w-4 h-4" /> 
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          {ai.loading ? (
                            <div className="space-y-4 loading-shimmer p-4 rounded-xl">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className={`h-4 rounded-full glass ${i%2===0 ? 'w-full' : 'w-5/6'}`}></div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-200 text-sm leading-relaxed">
                              {ai.answer.startsWith('*') ? (
                                <ul className="space-y-3">
                                  {ai.answer.split('\n').filter(line => line.trim()).map((line, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                      <span className="text-cyan-400 mt-1">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                      </span>
                                      <span>{line.replace('*', '').trim()}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{ai.answer}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
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