/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/display-name */
'use client';

import { useState, useEffect, FormEvent, memo, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import {
  Bot,
  Code2,
  Cpu,
  Image,
  MessageSquare,
  Network,
  Palette,
  Send,
  Sparkles,
  BarChart2,
  GitBranch,
  History,
  Search,
  ChevronRight,
  TrendingUp,
  X,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Gamepad2,
  Users,
  Server,
  Database,
  Shield,
  Monitor,
  Cloud,
  Settings,
} from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';
import { getInfrastructureAgentsGuidance } from '@/lib/services/infrastructureAgentsService';

const DEFAULT_PROMPTS = [
  "How to deploy Somnia validator nodes?",
  "Set up monitoring for blockchain infrastructure",
  "Configure load balancing for Somnia apps",
  "Security best practices for blockchain infrastructure"
];

interface Message {
  type: 'human' | 'ai';
  text: string;
  timestamp: Date;
  feedback?: 'helpful' | 'unhelpful' | null;
  feedbackComment?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

interface Feature {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

const InfrastructureNodes = memo(() => {
  const nodes = useMemo(() => 
    Array.from({ length: 8 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 0.5 + 0.5}px`
    })), 
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nodes.map((pos, i) => (
        <div
          key={i}
          className="absolute bg-white/10 rounded-full"
          style={{
            left: pos.left,
            top: pos.top,
            width: pos.size,
            height: pos.size,
            boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}
    </div>
  );
});

const MessageFeedback = ({
  feedback,
  onFeedback,
  messageId
}: {
  feedback?: 'helpful' | 'unhelpful' | null;
  onFeedback: (messageId: number, feedback: 'helpful' | 'unhelpful') => void;
  messageId: number;
}) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={() => onFeedback(messageId, 'helpful')}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
          feedback === 'helpful'
            ? 'bg-green-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <ThumbsUp className="w-3 h-3" />
        Helpful
      </button>
      <button
        onClick={() => onFeedback(messageId, 'unhelpful')}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
          feedback === 'unhelpful'
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <ThumbsDown className="w-3 h-3" />
        Unhelpful
      </button>
    </div>
  );
};

const EmptyState = ({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
        <Server className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">Infrastructure Agents</h3>
      <p className="text-gray-300 mb-8 max-w-md">
        Your AI infrastructure specialist for the Somnia ecosystem. Get expert guidance on deployment, monitoring, security, and scaling.
      </p>
      <div className="grid grid-cols-1 gap-3 w-full max-w-md">
        {DEFAULT_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptSelect(prompt)}
            className="p-3 text-left rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200 text-sm text-gray-300 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function InfrastructurePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    { 
      icon: <Zap className="w-5 h-5" />, 
      name: 'Somnia Ecosystem', 
      description: 'Explore Somnia blockchain features and news',
      href: "/somnia"
    },
    { 
      icon: <Gamepad2 className="w-5 h-5" />, 
      name: 'Gaming Development Bot', 
      description: 'Build blockchain games with expert guidance',
      href: '/gamingbot',
    },
    { 
      icon: <Server className="w-5 h-5" />, 
      name: 'Infrastructure Agents', 
      description: 'Build robust infrastructure for Somnia ecosystem',
      href: '/infrastructure',
    },
    { 
      icon: <Code2 className="w-5 h-5" />, 
      name: 'AI Smart Contracts', 
      description: 'Generate and audit smart contracts',
      href: "/contract"
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />,
      name: 'AI Trading Assistant', 
      description: 'Advanced trading insights and analysis',
      href: '/tradeassistant',
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      name: 'AI Web3 News', 
      description: 'Curated Web3 news with AI insights',
      href: '/news',
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      name: 'Ask Crypto People', 
      description: 'Community Q&A and discussions',
      href: '/askpeople',
    },
  ];


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      type: 'human',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await getInfrastructureAgentsGuidance(input);
      
      const aiMessage: Message = {
        type: 'ai',
        text: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting infrastructure guidance:', error);
      const errorMessage: Message = {
        type: 'ai',
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (messageIndex: number, feedback: 'helpful' | 'unhelpful') => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, feedback } : msg
    ));
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
    }
    setShowHistory(false);
  };

  const saveConversation = () => {
    if (messages.length === 0) return;

    const conversation: Conversation = {
      id: Date.now().toString(),
      title: messages[0]?.text.substring(0, 50) + '...' || 'New Conversation',
      messages,
      timestamp: new Date(),
    };

    setConversations(prev => [conversation, ...prev]);
    setCurrentConversationId(conversation.id);
  };

  useEffect(() => {
    if (messages.length > 0 && !currentConversationId) {
      saveConversation();
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text: string) => {
    return text.split('\n').map((paragraph, i) => {
      if (paragraph.trim() === '') return null;
      return (
        <p key={i} className="text-sm mb-3">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <FeatureGate feature={FeatureType.INFRASTRUCTURE_AGENTS}>
      <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden flex">
        {/* Fixed Sidebar */}
        <div className="w-80 bg-black border-r border-gray-800 p-6 flex flex-col h-full overflow-y-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-16 bg-white/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 text-cyan-400 hover:text-cyan-300 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <Link href="/">
            <h1 className="text-2xl font-bold mb-8 text-white flex items-center relative z-10">
              <span className="bg-white w-3 h-3 rounded-full mr-3 animate-pulse bg-gradient-to-r from-blue-400 to-purple-500"></span>
              Sage AI
            </h1>
          </Link>

          <div className="flex-1 relative z-10">
            <h2 className="text-base font-semibold mb-4 text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-gray-300" />
              AI-Powered Tools
            </h2>
            <div className="h-[calc(100vh-180px)] overflow-y-auto pr-4">
              <div className="grid grid-cols-1 gap-3">
                {features.map((feature, index) => (
                  <Link
                    key={index}
                    href={feature.href}
                    className={`p-4 flex items-start gap-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors duration-200 text-left ${
                      feature.comingSoon ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-white truncate">{feature.name}</h3>
                        {feature.comingSoon && (
                          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded ml-2">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{feature.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-black relative h-full overflow-hidden">
          <InfrastructureNodes />
          
          {/* Top Bar with Integrated History Button */}
          <div className="bg-black/80 border-b border-gray-800 p-4 backdrop-blur-sm z-10 flex justify-between items-center sticky top-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className={`text-gray-300 hover:text-white hover:bg-gray-700 ${
                  showHistory ? 'bg-gray-700' : ''
                }`}
                aria-label="Toggle chat history"
              >
                <History className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-gray-300" />
                Infrastructure Agents
              </h2>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              setInput(searchQuery);
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
            }} className="flex gap-2 w-96">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search infrastructure topics..."
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500"
                aria-label="Search input"
                disabled={loading}
              />
              <Button
                type="submit"
                className="bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50 px-4"
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {showHistory ? (
              <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 z-20 shadow-xl">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Conversation History</h3>
                    <button 
                      onClick={() => setShowHistory(false)} 
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <Button
                    onClick={startNewConversation}
                    className="mb-4 bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    New Conversation
                  </Button>
                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-2">
                      {conversations.length === 0 ? (
                        <p className="text-sm text-gray-300 text-center py-4">No conversation history</p>
                      ) : (
                        conversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => loadConversation(conv.id)}
                            className={`w-full p-3 text-left rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between ${
                              currentConversationId === conv.id ? 'bg-gray-800' : ''
                            }`}
                          >
                            <span className="text-sm text-white truncate">
                              {conv.title}
                            </span>
                            <span className="text-xs text-gray-300">
                              {conv.timestamp.toLocaleDateString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <ScrollArea className="flex-1" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.length === 0 ? (
                      <EmptyState onPromptSelect={(prompt) => setInput(prompt)} />
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'} items-start mb-4`}
                        >
                          <div
                            className={`p-4 rounded-lg max-w-[85%] border ${
                              msg.type === 'human'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-black/50 text-white border-gray-800'
                            }`}
                            style={{
                              minWidth: msg.type === 'ai' ? '60%' : undefined
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {msg.type === 'ai' ? (
                                  <Bot className="w-4 h-4 text-blue-400" />
                                ) : (
                                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                                )}
                                <span className="text-xs text-gray-400">
                                  {msg.type === 'ai' ? 'Infrastructure Agent' : 'You'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {msg.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm leading-relaxed">
                              {formatMessage(msg.text)}
                            </div>
                            {msg.type === 'ai' && (
                              <MessageFeedback
                                feedback={msg.feedback}
                                onFeedback={handleFeedback}
                                messageId={index}
                              />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {loading && (
                      <div className="flex justify-start items-start mb-4">
                        <div className="p-4 rounded-lg max-w-[85%] border bg-black/50 text-white border-gray-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Infrastructure Agent</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-gray-800 p-4 bg-black/50 backdrop-blur-sm">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about Somnia infrastructure setup, deployment, monitoring..."
                      className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 px-6"
                    >
                      {loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}
