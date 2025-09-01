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
  // Core states
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI states
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [username, setUsername] = useState<string>("CryptoExplorer");
  const [activeTab, setActiveTab] = useState<'ask' | 'saved' | 'trending'>('ask');
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // AI Assistants
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

  // Sample avatars
  const avatars = [
    '🦊', '🐺', '🐱', '🐭', '🐹', '🐰', '🦝', '🐻', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'
  ];

  // Get random avatar
  const getRandomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];

  // Get API Key
  const getApiKey = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GROQTA_API_KEY) {
      return process.env.NEXT_PUBLIC_GROQTA_API_KEY;
    }
    return null;
  };

  // Load saved data from localStorage
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

  // Handle asking questions to all AIs
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

    // Set all AIs to loading state
    setAiResponses(prev => prev.map(ai => ({
      ...ai,
      answer: "Analyzing your question...",
      loading: true
    })));

    try {
      const chat = new ChatGroq({
        apiKey: apiKey,
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        maxRetries: 2,
        timeout: 15000,
      });

      // Create prompts for each AI role
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

      // Process all AI responses in parallel
      const responses = await Promise.all([
        processAIResponse(chat, prompts.analyst, question, 0),
        processAIResponse(chat, prompts.developer, question, 1),
        processAIResponse(chat, prompts.defi, question, 2),
        processAIResponse(chat, prompts.lawyer, question, 3)
      ]);

      // Update all AI responses
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

  // Process individual AI response
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

  // Add comment
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

  // Save all responses to current question
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

  // Notification system
  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [{ id, message }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Rating system
  const handleRateAnswer = (aiId: string, stars: number) => {
    setAiResponses(prev => prev.map(ai => 
      ai.id === aiId ? { ...ai, rating: stars } : ai
    ));
    addNotification(`You rated an answer ${stars} star${stars > 1 ? 's' : ''}`);
  };

  // Toggle AI response expansion
  const toggleExpandAnswer = (aiId: string) => {
    setAiResponses(prev => prev.map(ai => 
      ai.id === aiId ? { ...ai, expanded: !ai.expanded } : ai
    ));
  };

  // Search saved questions
  const filteredQuestions = savedQuestions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.answers.some(a => a.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle help
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Keyboard shortcuts
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-black via-gray-900 to-blue-950 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900'}`}>
      {/* Hero Section */}
      <section className="w-full px-4 md:px-0 py-10 md:py-16 flex flex-col items-center justify-center bg-gradient-to-br from-blue-700/80 via-purple-700/80 to-black/90 rounded-b-3xl shadow-xl mb-8">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">Ask the Crypto Experts</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">Get instant, expert answers from AI specialists in crypto, DeFi, blockchain, and regulations. Save, discuss, and explore trending topics—all in one place.</p>
          <div className="flex flex-wrap gap-3 justify-center mb-2">
            <span className="px-4 py-2 rounded-full bg-blue-600/80 text-white font-medium text-sm shadow">Live AI Experts</span>
            <span className="px-4 py-2 rounded-full bg-purple-600/80 text-white font-medium text-sm shadow">Community Q&A</span>
            <span className="px-4 py-2 rounded-full bg-pink-600/80 text-white font-medium text-sm shadow">Save & Discuss</span>
          </div>
        </div>
      </section>

      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-6 px-2 md:px-6">
        {/* Sidebar */}
        <aside className={`hidden md:flex flex-col gap-4 w-56 py-6 px-3 rounded-3xl shadow-xl ${darkMode ? 'bg-black/80 border border-gray-800' : 'bg-white/80 border border-gray-200'}`}>
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 w-4 h-4 rounded-full animate-pulse"></span>
            <span className="font-bold text-lg tracking-wide">BlockSynth AI</span>
          </Link>
          <button onClick={() => setActiveTab('ask')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab==='ask' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}> <FiMessageSquare /> Ask</button>
          <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab==='saved' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}> <FiBookmark /> Saved</button>
          <button onClick={() => setActiveTab('trending')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab==='trending' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}> <FiTrendingUp /> Trending</button>
          <div className="mt-auto pt-8 border-t border-gray-700 flex flex-col gap-2">
            <button onClick={toggleHelp} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}> <FiHelpCircle /> Help</button>
            <button onClick={toggleTheme} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Onboarding/Notifications */}
          <div className="fixed top-6 right-6 z-50 space-y-2">
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-2 rounded shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-blue-400`}>{n.message}</div>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'ask' && (
            <section className="flex flex-col gap-8">
              {/* Question Input Card */}
              <div className={`w-full rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-6 flex flex-col gap-4`}> 
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <input type="text" value={username} onChange={e => { setUsername(e.target.value); localStorage.setItem('cryptoAssistantUsername', e.target.value); }} className={`w-32 p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-950 placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Your name" />
                  <input type="text" value={question} onChange={e => { setQuestion(e.target.value); setError(null); }} onKeyDown={handleKeyDown} className={`flex-1 p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-950 placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Ask anything about crypto..." disabled={loading} />
                  <button onClick={handleAsk} disabled={loading || !question.trim()} className={`p-3 rounded-lg font-medium transition ${loading ? 'bg-blue-700' : !question.trim() ? (darkMode ? 'bg-gray-700' : 'bg-gray-200') : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white flex items-center justify-center disabled:cursor-not-allowed`}>{loading ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : <FiSend />}</button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>

              {/* AI & Discussion Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Expert Cards */}
                <div className={`rounded-2xl shadow-xl border ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-950 border-gray-800' : 'bg-gradient-to-br from-white via-blue-50 to-purple-100 border-gray-200'} flex flex-col`}>
                  <div className="flex justify-between items-center p-5 border-b border-gray-700">
                    <h2 className="font-semibold flex items-center gap-2 text-lg"><RiRobot2Line className="text-blue-400" /> Expert Responses</h2>
                    <button onClick={handleSaveQuestion} disabled={!question.trim() || aiResponses.some(ai => ai.answer.includes("Ask me anything"))} className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm flex items-center gap-2 disabled:opacity-50`}><FiBookmark /> Save All</button>
                  </div>
                  <div className="p-5 grid grid-cols-1 gap-5">
                    {aiResponses.map(ai => (
                      <div key={ai.id} className={`rounded-xl p-5 shadow border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} transition-all duration-200`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{ai.avatar}</span>
                            <div>
                              <h3 className="font-bold text-lg">{ai.name}</h3>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ai.specialty}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <button key={star} onClick={() => handleRateAnswer(ai.id, star)} className={`${ai.rating && star <= ai.rating ? 'text-yellow-400' : darkMode ? 'text-gray-500' : 'text-gray-300'}`}> <FiStar fill={ai.rating && star <= ai.rating ? 'currentColor' : 'none'} /> </button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          {ai.loading ? (
                            <div className="space-y-3 animate-pulse">
                              {[...Array(4)].map((_, i) => (<div key={i} className={`h-4 rounded-full ${i%2===0 ? 'w-full' : 'w-5/6'} ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>))}
                            </div>
                          ) : (
                            <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none text-base`}>{ai.answer.startsWith('*') ? (<ul className="space-y-2">{ai.answer.split('\n').filter(line => line.trim()).map((line, i) => (<li key={i} className="flex items-start gap-2"><span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>•</span><span>{line.replace('*', '').trim()}</span></li>))}</ul>) : (<p>{ai.answer}</p>)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Discussion Card */}
                <div className={`rounded-2xl shadow-xl border ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-950 border-gray-800' : 'bg-gradient-to-br from-white via-blue-50 to-purple-100 border-gray-200'} flex flex-col`}>
                  <div className="p-5 border-b border-gray-700 flex items-center gap-2"><FiUsers /> <span className="font-semibold text-lg">Discussion ({comments.length})</span></div>
                  <div className="flex-1 overflow-auto p-5">
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map(comment => (
                          <div key={comment.id} className={`p-4 rounded-lg ${comment.isUser ? (darkMode ? 'bg-blue-950' : 'bg-blue-50') : (darkMode ? 'bg-gray-900' : 'bg-gray-100')}`}> <div className="flex items-start gap-3"><div className="text-2xl">{comment.avatar}</div><div className="flex-1"><div className="flex justify-between items-start"><div className={`font-medium ${comment.isUser ? 'text-blue-400' : 'text-green-400'}`}>{comment.username} {comment.isUser && '(You)'}</div><div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(comment.timestamp)}</div></div><p className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{comment.text}</p></div></div></div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No comments yet. Be the first to share your thoughts!</div>
                    )}
                  </div>
                  <div className="p-5 border-t border-gray-700">
                    <div className="flex gap-2">
                      <textarea value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={handleCommentKeyDown} className={`flex-1 p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-950 placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`} placeholder="Add your comment..." rows={2} />
                      <button onClick={handleAddComment} disabled={!newComment.trim()} className={`self-end p-3 rounded-lg font-medium transition ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}><FiSend /></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Saved Tab */}
          {activeTab === 'saved' && (
            <section className="flex flex-col gap-8">
              <div className={`rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-6 mb-2`}>
                <div className="relative">
                  <FiSearch className={`absolute left-4 top-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full pl-12 pr-4 py-3 rounded-xl ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="Search saved questions..." />
                </div>
              </div>
              {filteredQuestions.length > 0 ? (
                <div className="grid gap-4">
                  {filteredQuestions.map(q => (
                    <div key={q.id} className={`p-5 rounded-2xl border shadow ${darkMode ? 'border-gray-800 bg-gray-900 hover:bg-blue-950' : 'border-gray-200 bg-white hover:bg-blue-50'} transition cursor-pointer`} onClick={() => { setQuestion(q.question); setAiResponses(prev => prev.map(ai => { const savedAnswer = q.answers.find(a => a.aiName === ai.name); return { ...ai, answer: savedAnswer?.answer || "No response found", expanded: true }; })); setActiveTab('ask'); window.scrollTo(0,0); }}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">{q.question}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{new Date(q.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none mt-3`}>
                        <p className="line-clamp-2">{q.answers.map(a => `${a.aiName}: ${a.answer.split('\n')[0]}`).join(' • ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}> <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{searchQuery ? 'No matching saved questions found' : 'You have no saved questions yet'}</p> <button onClick={() => setActiveTab('ask')} className={`mt-4 px-4 py-2 rounded-xl ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}>Ask a Question</button> </div>
              )}
            </section>
          )}

          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <section className="flex flex-col gap-8">
              <div className={`rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-6 mb-2`}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiTrendingUp className="text-blue-400" /> Trending in Crypto</h2>
                <div className="grid gap-3">
                  {[{ topic: "Bitcoin Halving 2025 Analysis", posts: 1423, hot: true },{ topic: "Ethereum Dencun Upgrade Impact", posts: 892, hot: true },{ topic: "Solana vs Polygon: Layer 1 Showdown", posts: 765 },{ topic: "NFT Market Recovery Signs", posts: 621 },{ topic: "DeFi Yield Farming Strategies", posts: 587 },{ topic: "CBDC Developments Worldwide", posts: 432 },{ topic: "Meme Coin Season Predictions", posts: 398 }].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl cursor-pointer transition ${darkMode ? 'bg-blue-950 hover:bg-blue-900' : 'bg-blue-50 hover:bg-blue-100'} flex justify-between items-center`} onClick={() => { setQuestion(item.topic); setActiveTab('ask'); }}>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${i < 3 ? 'text-lg' : 'text-md'} ${i < 3 ? 'text-blue-400' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{i + 1}</span>
                        <div className="flex items-center gap-2">
                          <span>{item.topic}</span>
                          {item.hot && (<span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">Hot</span>)}
                        </div>
                      </div>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.posts} discussions</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-2xl max-w-2xl w-full ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><FiHelpCircle className="text-blue-400" /> How to use CryptoChat</h2>
              <button onClick={toggleHelp} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}> <FiX /> </button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${darkMode ? 'bg-gray-800' : 'bg-blue-100'} text-blue-400`}><FiMessageSquare /></div><div><h3 className="font-medium mb-1">Ask Questions</h3><p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type your crypto-related question and get instant expert answers with key points.</p></div></div>
              <div className="flex gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${darkMode ? 'bg-gray-800' : 'bg-purple-100'} text-purple-400`}><FiBookmark /></div><div><h3 className="font-medium mb-1">Save Knowledge</h3><p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Bookmark important answers to your personal collection for quick access later.</p></div></div>
              <div className="flex gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${darkMode ? 'bg-gray-800' : 'bg-green-100'} text-green-400`}><FiTrendingUp /></div><div><h3 className="font-medium mb-1">Stay Updated</h3><p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Check trending topics to see what the crypto community is discussing right now.</p></div></div>
            </div>
            <button onClick={toggleHelp} className={`mt-6 w-full py-3 rounded-xl font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition`}>Got it!</button>
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