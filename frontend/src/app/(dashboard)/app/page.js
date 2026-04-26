"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Upload, ArrowRight, LogIn, LogOut } from 'lucide-react';
import useStore from '@/store/useStore';
import ChatWindow from '@/components/chat/ChatWindow';
import HeroCanvas from '@/components/home/HeroCanvas';
import { subscribeToMessages, addMessage, createNewChat } from '@/utils/chatService';
import { useRouter } from 'next/navigation';
import { analyzeCSV } from '@/utils/fileAnalysis';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentChatId(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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
      const results = await analyzeCSV(file);
      let chatId = currentChatId;
      if (!chatId) {
        chatId = await createNewChat(user.uid, `Analysis: ${file.name}`);
        setCurrentChatId(chatId);
      }
      await addMessage(user.uid, chatId, { role: 'user', content: `Uploaded dataset: ${file.name}` });
      if (results.error) {
        await addMessage(user.uid, chatId, { role: 'assistant', content: `I found an issue with "${file.name}": ${results.error}` });
      } else {
        await addMessage(user.uid, chatId, {
          role: 'assistant',
          content: `Fairness analysis complete for **${file.name}**. I've identified potential bias based on **${results.sensitiveAttr}**.`,
          analysis: { score: results.score, findings: results.findings }
        });
      }
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentChatId) {
    return (
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-comfortable md:p-large-section overflow-y-auto bg-bg-primary relative min-h-full">
      <HeroCanvas />

      {!user && (
        <div className="absolute top-comfortable right-comfortable z-20">
          <button
            onClick={() => router.push('/login')}
            data-testid="app-signin-btn"
            className="text-sm font-bold text-text-secondary hover:text-accent-gold px-comfortable py-compact rounded-button transition-fast uppercase tracking-widest"
          >
            Sign In
          </button>
        </div>
      )}

      <div className="relative z-10 max-w-[840px] w-full text-center mb-large-section animate-in fade-in slide-in-from-bottom-4 duration-1000 px-base pt-hero-vertical md:pt-0">
        <div className="flex justify-center mb-base">
          <img src="/assets/logo.png" alt="Nyaya AI" className="h-12 md:h-16" />
        </div>

        <div className="inline-flex items-center gap-compact bg-bg-surface/80 backdrop-blur-md px-4 py-1.5 rounded-pill mb-section shadow-sm border border-accent-gold/20">
          <Sparkles size={14} className="text-accent-gold" />
          <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest">Ensuring AI Fairness</span>
        </div>

        <h1 className="text-5xl md:text-7xl mb-comfortable leading-tight text-text-primary">
          Justice in every <span className="text-accent-gold italic">decision.</span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary mb-large-section max-w-[640px] mx-auto leading-relaxed">
          Detect hidden bias in your datasets before they impact real people.
          Nyaya AI uses ethical analysis to ensure your models are fair, transparent, and accountable.
        </p>

        <div className="relative w-full group max-w-[720px] mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold/20 via-accent-blue/10 to-accent-teal/20 rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-bg-surface/92 backdrop-blur-xl border border-border p-5 rounded-[22px] shadow-xl">
            <textarea
              placeholder="Paste your dataset summary or ask about AI fairness..."
              data-testid="app-prompt-input"
              className="w-full bg-transparent border-none focus:ring-0 text-text-primary resize-none h-32 text-base placeholder:text-text-tertiary outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e.target.value);
                }
              }}
            />
            <div className="flex items-center justify-between mt-base border-t border-border pt-5">
              <div className="flex items-center gap-base">
                <input
                  type="file" accept=".csv" className="hidden" id="hero-file-upload"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <label
                  htmlFor="hero-file-upload"
                  data-testid="app-upload-csv"
                  className="flex items-center gap-compact text-xs text-text-secondary hover:text-text-primary transition-fast px-4 py-2 rounded-button bg-bg-secondary cursor-pointer font-bold uppercase tracking-wider"
                >
                  <Upload size={14} /> Upload CSV
                </label>
                <div className="h-4 w-px bg-border mx-1"></div>
                {user ? (
                  <button onClick={handleLogout} data-testid="app-signout-btn" className="flex items-center gap-compact text-[10px] font-bold text-accent-red hover:text-accent-red/80 transition-fast uppercase tracking-widest">
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <button onClick={() => router.push('/login')} className="flex items-center gap-compact text-[10px] font-bold text-accent-blue hover:text-accent-blue/80 transition-fast uppercase tracking-widest">
                    <LogIn size={14} /> Sign In
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  const textarea = document.querySelector('textarea');
                  handleSendMessage(textarea.value);
                }}
                data-testid="app-send-btn"
                className="bg-accent-gold text-white p-2.5 rounded-button hover:scale-105 active:scale-95 transition-all shadow-md shadow-accent-gold/20"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-base mt-large-section">
          {[
            "Detect gender bias in hiring data",
            "Explain disparate impact",
            "How to fix age discrimination?"
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs text-text-secondary bg-bg-secondary/50 hover:bg-bg-secondary border border-border px-5 py-2.5 rounded-pill transition-fast font-semibold hover:shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
