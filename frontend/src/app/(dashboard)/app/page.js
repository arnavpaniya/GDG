"use client";

import React, { useState, useEffect } from 'react';
import { Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import useStore from '@/store/useStore';
import ChatWindow from '@/components/chat/ChatWindow';
import { subscribeToMessages, addMessage, createNewChat } from '@/utils/chatService';
import { useRouter } from 'next/navigation';
import { analyzeCSV } from '@/utils/fileAnalysis';
import { uploadAndAnalyze, formatAnalysisForChat, generateAnalysisSummary } from '@/utils/apiService';

export default function AppHome() {
  const router = useRouter();
  const { user, currentChatId, setCurrentChatId, messages, setMessages } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && currentChatId) {
      const unsubscribe = subscribeToMessages(user.uid, currentChatId, (msgs) => {
        setMessages(msgs);
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [user, currentChatId, setMessages]);

  const handleSendMessage = async (text) => {
    if (!text?.trim()) return;

    if (!user) {
      setCurrentChatId('guest-session');
      setMessages([
        { id: 'guest-msg-1', role: 'user', content: text, createdAt: new Date() }
      ]);
      return;
    }

    let chatId = currentChatId;
    if (!chatId) {
      chatId = await createNewChat(user.uid, text.slice(0, 30) + '...');
      setCurrentChatId(chatId);
    }

    await addMessage(user.uid, chatId, { role: 'user', content: text });

    setTimeout(async () => {
      await addMessage(user.uid, chatId, {
        role: 'assistant',
        content: `I'm analyzing your request: "${text}". How would you like me to proceed with the fairness check?`
      });
    }, 1000);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!user) {
      setCurrentChatId('guest-session');
      setMessages([
        { id: 'guest-msg-1', role: 'user', content: `Uploaded dataset: ${file.name}`, createdAt: new Date() }
      ]);
      return;
    }
    setIsLoading(true);
    try {
      // First, try backend API with ML integration
      let results;
      let useBackend = true;
      
      try {
        const apiResponse = await uploadAndAnalyze(file);
        results = formatAnalysisForChat(apiResponse);
        console.log('✅ Backend API analysis successful');
      } catch (apiError) {
        console.warn('⚠️ Backend API unavailable, falling back to client-side analysis:', apiError.message);
        useBackend = false;
        // Fallback to client-side analysis
        results = await analyzeCSV(file);
      }

      let chatId = currentChatId;
      if (!chatId) {
        chatId = await createNewChat(user.uid, `Analysis: ${file.name}`);
        setCurrentChatId(chatId);
      }
      
      await addMessage(user.uid, chatId, { 
        role: 'user', 
        content: `Uploaded dataset: ${file.name}` 
      });

      if (results?.error) {
        await addMessage(user.uid, chatId, { 
          role: 'assistant', 
          content: `I found an issue with "${file.name}": ${results.error}` 
        });
      } else if (useBackend && results) {
        // Backend API response
        const summary = generateAnalysisSummary(results);
        await addMessage(user.uid, chatId, {
          role: 'assistant',
          content: summary,
          analysis: results,
          source: 'backend'
        });
      } else if (results) {
        // Client-side fallback response
        await addMessage(user.uid, chatId, {
          role: 'assistant',
          content: `Fairness analysis complete for **${file.name}**. I've identified potential bias based on **${results.sensitiveAttrs?.join(', ')}**.`,
          analysis: { score: results.score, findings: results.findings },
          source: 'client'
        });
      }
    } catch (err) {
      console.error("Analysis error:", err);
      if (user && currentChatId) {
        await addMessage(user.uid, currentChatId, {
          role: 'assistant',
          content: `❌ Analysis failed: ${err.message}. Please try again or check if the backend service is running.`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentChatId) {
    return (
      <div className="flex-1 flex flex-col relative">
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border rounded-lg text-text-secondary hover:text-accent-gold hover:border-accent-gold/30 transition-all shadow-soft text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto bg-bg-primary relative">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border rounded-lg text-text-secondary hover:text-accent-gold hover:border-accent-gold/30 transition-all shadow-soft text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>
      
      <div className="max-w-[700px] w-full text-center">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-text-primary mb-3">
            What can I help you analyze?
          </h1>
          <p className="text-base text-text-secondary max-w-[500px] mx-auto">
            Upload a dataset or ask me about AI fairness, bias detection, and ethical ML practices.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            { icon: "📊", title: "Upload Dataset", desc: "Analyze CSV for bias" },
            { icon: "⚖️", title: "Check Fairness", desc: "Evaluate model fairness" },
            { icon: "🔍", title: "Detect Bias", desc: "Identify discrimination" },
            { icon: "💡", title: "Get Recommendations", desc: "Improve your models" }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(action.title)}
              className="flex items-start gap-3 p-4 text-left bg-bg-surface border border-border rounded-xl hover:bg-black/5 transition-all group"
            >
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent-gold transition-fast">
                  {action.title}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="relative w-full max-w-[700px] mx-auto">
          <div className="bg-bg-surface border border-border rounded-xl shadow-soft">
            <textarea
              placeholder="Ask about AI fairness, bias detection, or upload a dataset..."
              data-testid="app-prompt-input"
              className="w-full bg-transparent border-none focus:ring-0 text-text-primary resize-none h-24 text-[15px] placeholder:text-text-tertiary outline-none p-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e.target.value);
                }
              }}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-border">
              <div className="flex items-center gap-1">
                <input
                  type="file" accept=".csv" className="hidden" id="hero-file-upload"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <label
                  htmlFor="hero-file-upload"
                  data-testid="app-upload-csv"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-fast cursor-pointer"
                >
                  <Upload size={14} /> Upload CSV
                </label>
              </div>
              <button
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  handleSendMessage(textarea.value);
                }}
                data-testid="app-send-btn"
                className="bg-accent-gold text-white p-2 rounded-lg hover:opacity-90 transition-all shadow-soft"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-tertiary">
          <span className="inline-block w-2 h-2 bg-accent-teal rounded-full"></span>
          <span>Powered by ethical AI analysis</span>
        </div>
      </div>
    </div>
  );
}
