import React, { useState, useEffect, useRef } from 'react';
import { aiAPI, healthAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Send, 
  Bot, 
  Sparkles, 
  ArrowDownCircle, 
  Loader2,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

// Client-side standalone dietician simulation engine if backend is completely down
const generateFrontendMockResponse = (text, profile) => {
  const query = text.toLowerCase();
  
  let prefix = '';
  if (profile) {
    prefix = `[Offline Standalone AI] Based on your target goal of ${profile.fitnessGoals}, here is my advice:\n\n`;
  } else {
    prefix = `[Offline Standalone AI] Here is my advice:\n\n`;
  }

  // Exact matches requested by user
  if (query.includes('b12') || query.includes('cobalamin')) {
    return prefix + "Foods rich in Vitamin B12 include eggs, milk, fish, chicken, curd, and fortified cereals.";
  }

  if (query.includes('iron deficiency') || (query.includes('iron') && query.includes('defic'))) {
    return prefix + "Increase spinach, beetroot, dates, jaggery, and legumes.";
  }

  if (query.includes('protein') || query.includes('muscle') || query.includes('gym')) {
    return prefix + "For high protein intake in an Indian diet, I highly recommend including:\n- **Paneer (Cottage Cheese)**: 18g protein per 100g.\n- **Yellow Moong Dal or Chickpeas**: Excellent plant-based protein sources.\n- **Boiled Eggs**: approx 6g protein per egg.\n- **Chicken Breast**: Lean and highly bioavailable with 31g protein per 100g.";
  }

  if (query.includes('sugar') || query.includes('diabetes') || query.includes('diabetic')) {
    return prefix + "Managing blood sugar requires focusing on complex, low-glycemic index carbohydrates and high dietary fiber:\n- **Foods to Prioritize**: Oats, broccoli, chickpeas, spinach, and quinoa.\n- **Foods to Avoid**: Refined white sugar, white basmati rice, refined flour (maida), and sugary juices.";
  }

  if (query.includes('bp') || query.includes('blood pressure') || query.includes('hypertension')) {
    return prefix + "For blood pressure control, lower your daily sodium intake and load up on potassium-rich foods like spinach, curd, and citrus fruits.";
  }

  if (query.includes('calcium') || query.includes('bone') || query.includes('joints') || query.includes('vitamin d')) {
    return prefix + "For bone and structural health, calcium and Vitamin D must work together:\n- **Calcium Stars**: Milk, curd (dahi), paneer, almonds, and chia seeds.\n- **Vitamin D Sources**: Egg yolks, fortified milk, button mushrooms, and fatty fish.";
  }

  // Generic fallback
  return prefix + "I am currently running in offline mock assistant mode because the API server is unreachable. You can ask me about 'b12 deficiency', 'iron deficiency', 'protein', 'diabetes', or 'calcium' to test clinical advice!";
};

const AiChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your AI Nutritionist Assistant. I have analyzed your health profile and deficiencies.\n\nAsk me anything! For example:\n- "What rich foods address B12 deficiency?"\n- "What are some high-iron snack options?"\n- "Create a strict low-sugar, low-carb plan for today."',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  
  const chatEndRef = useRef(null);

  const promptChips = [
    'What foods address b12 deficiency?',
    'Suggest iron-rich foods',
    'What should I avoid with Diabetes?',
    'Give me a muscle building dinner'
  ];

  // Fetch health profile on load for context visualization
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await healthAPI.getProfile();
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.warn('Backend offline, loading client health context...');
        setProfile({
          fitnessGoals: 'Muscle Building',
          deficiencies: ['Protein deficiency'],
          diseases: ['Diabetes']
        });
      }
    };
    fetchProfile();
  }, []);

  // Auto-scroll to bottom of chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text) => {
    if (!text || text.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Map existing messages to backend chatHistory schema
      const historyPayload = messages.map(msg => ({
        sender: msg.sender === 'bot' ? 'assistant' : 'user',
        text: msg.text
      }));

      const res = await aiAPI.chat(text, historyPayload);
      if (res.success) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'bot',
          text: res.reply,
          timestamp: new Date(),
          source: res.source
        }]);
      }
    } catch (err) {
      console.warn('Backend AI API offline, using local client dietician fallback engine:', err.message);
      // Wait 600ms to simulate natural dietician reasoning response time for premium micro-experience
      setTimeout(() => {
        const reply = generateFrontendMockResponse(text, profile);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'bot',
          text: reply,
          timestamp: new Date(),
          source: 'Client Standalone Offline Engine (API Offline)'
        }]);
        setLoading(false);
      }, 500);
      return; // prevent setting loading false early
    }
    setLoading(false);
  };

  const handleChipClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputMessage);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
        
        {/* Header Widget */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-3xl tracking-tight flex items-center gap-2 font-outfit">
              <Bot className="text-emerald-500 animate-pulse" />
              AI Recommendation Assistant
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Ask questions about clinical guidelines, calorie management, and personalized diet plan swaps
            </p>
          </div>
          {profile && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
              <Sparkles size={12} className="text-emerald-500 animate-spin" />
              <span>Context: {profile.fitnessGoals}</span>
            </div>
          )}
        </div>

        {/* Chat Window Box */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col overflow-hidden">
          
          {/* Scrollable Message Area */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 scrollbar-thin">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3.5 max-w-[85%] md:max-w-[75%] ${isBot ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar icon */}
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs
                    ${isBot 
                      ? 'bg-emerald-100 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-indigo-100 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                    }
                  `}>
                    {isBot ? <Bot size={18} /> : <HelpCircle size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className={`
                      px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${isBot 
                        ? msg.error 
                          ? 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/10 dark:border-red-900/50 dark:text-red-400'
                          : 'bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                        : 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/10'
                      }
                    `}>
                      {msg.text}
                    </div>
                    {isBot && msg.source && (
                      <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1">
                        Agent: {msg.source}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {loading && (
              <div className="flex gap-3.5 max-w-[50%] self-start animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Bot size={18} />
                </div>
                <div className="bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 px-4 py-3.5 rounded-2xl flex items-center gap-1.5 shadow-xs">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips Section */}
          {!loading && messages.length === 1 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Recommended Quick Prompts</p>
              <div className="flex flex-wrap gap-2">
                {promptChips.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleChipClick(prompt)}
                    className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-600 dark:text-slate-300 transition duration-200 cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Message Controls */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask anything about nutrition, vitamins, B12, Iron, meal swaps..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="flex-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 text-slate-950 dark:text-white"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={loading || !inputMessage.trim()}
              className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-500/10 cursor-pointer shrink-0 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AiChatAssistant;
