/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/display-name */
'use client';

import { useState, useEffect, FormEvent, ChangeEvent, memo, useRef, useMemo } from 'react';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AIMessage } from '@langchain/core/messages';
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
} from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { FeatureType } from '@/lib/services/creditService';

const MODEL_NAME = 'llama3-70b-8192';
const DEFAULT_PROMPTS = [
  "Explain smart contracts like I'm 5",
  "What are the top DeFi protocols in 2025?",
  "How do I create an NFT collection?",
  "Compare Ethereum and Solana"
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

const BlockchainNodes = memo(() => {
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
  comment,
  onComment
}: {
  feedback?: 'helpful' | 'unhelpful' | null;
  onFeedback: (type: 'helpful' | 'unhelpful') => void;
  comment?: string;
  onComment: (comment: string) => void;
}) => (
  <div className="flex items-center mt-3 space-x-3 text-xs">
    <span className="text-gray-400">Was this helpful?</span>
    <button
      onClick={() => onFeedback('helpful')}
      className={`px-2 py-1 rounded flex items-center ${
        feedback === 'helpful' 
          ? 'bg-green-900 text-green-300' 
          : 'hover:bg-gray-700 text-gray-300'
      }`}
    >
      <ThumbsUp className="w-3 h-3 mr-1" /> Helpful
    </button>
    <button
      onClick={() => onFeedback('unhelpful')}
      className={`px-2 py-1 rounded flex items-center ${
        feedback === 'unhelpful' 
          ? 'bg-red-900 text-red-300' 
          : 'hover:bg-gray-700 text-gray-300'
      }`}
    >
      <ThumbsDown className="w-3 h-3 mr-1" /> Unhelpful
    </button>
    {feedback === 'unhelpful' && (
      <input
        type="text"
        placeholder="How can we improve?"
        value={comment || ''}
        onChange={(e) => onComment(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
      />
    )}
  </div>
);

const LoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="p-4 rounded-lg bg-gray-900 text-gray-300 border border-gray-800 flex items-center space-x-2">
      <div className="flex space-x-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <span className="text-sm">Analyzing blockchain data...</span>
    </div>
  </div>
);

const EmptyState = ({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8">
    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
      <Bot className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-lg font-medium mb-2">Web3 AI Assistant</h3>
    <p className="text-sm text-gray-400 max-w-md mb-6">
      Ask me about smart contracts, DeFi protocols, NFT strategies, or any blockchain-related topics.
    </p>
    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
      {DEFAULT_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onPromptSelect(prompt)}
          className="text-xs p-3 bg-gray-900 hover:bg-gray-800 rounded border border-gray-800 text-left"
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
);

const ChatbotContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    { 
      icon: <Code2 className="w-5 h-5" />, 
      name: 'Smart Contract Generator', 
      description: 'Generate secure, audited smart contracts',
      href: "/contract"
    },
    { 
      icon: <TrendingUp className="w-6 h-6" />,
      name: 'AI Trading Assistant', 
      description: 'Get insights for your trading strategies',
      href: '/tradeassistant',
    },
    { 
      icon: <Image className="w-5 h-5" />, 
      name: 'AI NFT Generator', 
      description: 'Create unique NFTs using advanced AI models',
      href: '',
      comingSoon: true
    },
    { 
      icon: <Network className="w-5 h-5" />, 
      name: 'Blockchain Architect', 
      description: 'Design custom blockchain architectures',
      href: '',
      comingSoon: true
    },
    { 
      icon: <Cpu className="w-5 h-5" />, 
      name: 'DeFi Protocol Designer', 
      description: 'Build automated DeFi protocols',
      href: '',
      comingSoon: true
    },
    { 
      icon: <Palette className="w-5 h-5" />, 
      name: 'Token Designer', 
      description: 'Craft tokenomics and distribution models',
      href: '',
      comingSoon: true
    },
  ];

  const chatModel = useMemo(() => new ChatGroq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    model: MODEL_NAME,
  }), []);

  const chatPrompt = useMemo(() => ChatPromptTemplate.fromMessages([
    ['system', `You are a Web3 expert AI assistant. Provide concise, technical answers about blockchain, DeFi, NFTs, and decentralized technologies.

Format responses with:
- Clear section headings ending with colons
- Bullet points for lists
- Numbered steps for processes
- Short paragraphs for explanations`],
    ['human', '{input}'],
  ]), []);

  const chain = useMemo(() => chatPrompt.pipe(chatModel), [chatModel, chatPrompt]);

  useEffect(() => {
    const stored = localStorage.getItem('conversations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
        if (Array.isArray(parsed)) {
          setConversations(parsed);
        }
      } catch (error) {
        console.error('Failed to parse conversations:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, loading]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const humanMessage: Message = {
      type: 'human',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, humanMessage]);
    setInput('');
    setLoading(true);

    const conversationId = currentConversationId || Date.now().toString();
    const isNewConversation = !currentConversationId;
    setCurrentConversationId(conversationId);

    try {
      const aiResponse = await chain.invoke({ input });
      const aiMessage: Message = {
        type: 'ai',
        text: aiResponse.content.toString(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      const conversationTitle = input.substring(0, 30);
      updateConversations(conversationId, conversationTitle, [...messages, humanMessage, aiMessage], isNewConversation);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        type: 'ai',
        text: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      updateConversations(conversationId, 'Error conversation', [...messages, humanMessage, errorMessage], isNewConversation);
    } finally {
      setLoading(false);
    }
  };

  const updateConversations = (id: string, title: string, newMessages: Message[], isNew: boolean) => {
    setConversations((prev) => {
      const conversation: Conversation = {
        id,
        title,
        messages: newMessages,
        timestamp: new Date(),
      };

      if (isNew) {
        return [conversation, ...prev];
      }

      return prev.map((c) => c.id === id ? conversation : c);
    });
  };

  const loadConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
      setShowHistory(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  const formatTimestamp = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAIResponse = (text: string) => {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, i) => {
      if (/^\s*[\d•\-]/.test(paragraph)) {
        const items = paragraph.split('\n').filter(i => i.trim());
        return (
          <ul key={i} className="space-y-2 pl-5 list-disc">
            {items.map((item, j) => (
              <li key={j} className="text-sm">
                {item.replace(/^[\d•\-]\s*/, '').trim()}
              </li>
            ))}
          </ul>
        );
      }
      
      if (paragraph.trim().endsWith(':')) {
        return (
          <h4 key={i} className="font-semibold text-blue-300 mt-3 mb-1">
            {paragraph.trim().replace(':', '')}
          </h4>
        );
      }
      
      return (
        <p key={i} className="text-sm mb-3">
          {paragraph}
        </p>
      );
    });
  };

  return (
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

        <Link href="/">
          <h1 className="text-2xl font-bold mb-8 text-white flex items-center relative z-10">
            <span className="bg-white w-3 h-3 rounded-full mr-3 animate-pulse bg-gradient-to-r from-blue-400 to-purple-500"></span>
            BlockSynth AI
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
        <BlockchainNodes />
        
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
              Web3 AI Chat
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
              placeholder="Search Web3 topics..."
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
                            {msg.type === 'ai' ? (
                              <>
                                <div className="flex items-center">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                  <span className="text-xs font-medium text-blue-300">Web3 Assistant</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {formatTimestamp(msg.timestamp)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs font-medium text-gray-300">You</span>
                                <span className="text-xs text-gray-400">
                                  {formatTimestamp(msg.timestamp)}
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {msg.type === 'ai' ? formatAIResponse(msg.text) : (
                              <p className="text-sm">{msg.text}</p>
                            )}
                          </div>

                          {msg.type === 'ai' && (
                            <MessageFeedback
                              feedback={msg.feedback}
                              onFeedback={(type) => {
                                setMessages(prev => prev.map((m, i) => 
                                  i === index ? {...m, feedback: type} : m
                                ));
                              }}
                              comment={msg.feedbackComment}
                              onComment={(comment) => {
                                setMessages(prev => prev.map((m, i) => 
                                  i === index ? {...m, feedbackComment: comment} : m
                                ));
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {loading && <LoadingIndicator />}
                </div>
              </ScrollArea>
              
              {/* Fixed Input Area */}
              <div className="sticky bottom-0 bg-black/80 backdrop-blur-sm p-4 border-t border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-4xl mx-auto">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Web3 topics..."
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 text-sm py-5 focus:ring-2 focus:ring-blue-500 flex-1"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 px-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ChatbotPage() {
  return (
    <FeatureGate feature={FeatureType.CHATBOT}>
      <ChatbotContent />
    </FeatureGate>
  );
}