"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Upload, ArrowUp, Paperclip, BarChart2, ShieldCheck, Lightbulb, Scale } from 'lucide-react';
import useStore from '@/store/useStore';
import ChatWindow from '@/components/chat/ChatWindow';
import { subscribeToMessages, addMessage, createNewChat } from '@/utils/chatService';
import { useRouter } from 'next/navigation';
import { analyzeCSV } from '@/utils/fileAnalysis';
import { uploadAndAnalyze, formatAnalysisForChat, generateAnalysisSummary, sendChatMessage } from '@/utils/apiService';

export default function AppHome() {
  const router = useRouter();
  const { user, currentChatId, setCurrentChatId, messages, setMessages } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (user && currentChatId) {
      // Logged-in: subscribe to Firestore messages for this chat
      const unsubscribe = subscribeToMessages(user.uid, currentChatId, (msgs) => {
        setMessages(msgs);
      });
      return () => unsubscribe();
    } else if (!currentChatId) {
      // No active chat at all — reset to empty (e.g. on logout or new session)
      setMessages([]);
    }
    // If currentChatId is 'guest-session', do nothing — messages are managed locally in state
  }, [user, currentChatId, setMessages]);

  const handleSendMessage = async (text) => {
    if (!text?.trim()) return;

    if (!user) {
      setCurrentChatId('guest-session');
      const newUserMsg = { id: `guest-msg-${Date.now()}`, role: 'user', content: text, createdAt: new Date() };
      console.log('[Nyaya] Adding user message to store:', newUserMsg);
      setMessages((prev) => [...prev, newUserMsg]);
      setIsLoading(true);
      try {
        console.log('[Nyaya] Calling backend with:', text);
        const response = await sendChatMessage(text, null);
        console.log('[Nyaya] Backend response:', response);
        const assistantMsg = {
          id: `guest-msg-reply-${Date.now()}`,
          role: 'assistant',
          content: response.data.text,
          structured: response.data.structured || null,
          createdAt: new Date()
        };
        console.log('[Nyaya] Adding assistant message:', assistantMsg);
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error('[Nyaya] Chat error:', err);
        setMessages((prev) => [...prev, { id: `guest-msg-err-${Date.now()}`, role: 'assistant', content: '❌ Sorry, I encountered an error: ' + err.message, createdAt: new Date() }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    let chatId = currentChatId;
    if (!chatId) {
      chatId = await createNewChat(user.uid, text.slice(0, 30) + '...');
      setCurrentChatId(chatId);
    }

    await addMessage(user.uid, chatId, { role: 'user', content: text });
    setIsLoading(true);

    try {
      // Find the last analysis result in the chat history to pass as context
      let context = null;
      for (let i = messages.length - 1; i >= 0; i--) {
         if (messages[i].analysis) {
           context = messages[i].analysis;
           break;
         }
      }

      const response = await sendChatMessage(text, context);
      await addMessage(user.uid, chatId, {
        role: 'assistant',
        content: response.data.text,
        structured: response.data.structured || null,
      });
    } catch (err) {
      console.error("Chat error:", err);
      await addMessage(user.uid, chatId, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex-1 flex flex-col relative h-full">
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
      {/* Greeting */}
      <div className="w-full max-w-[680px] flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-9 w-auto" />
          <h1 className="text-4xl md:text-5xl font-semibold text-text-primary tracking-tight">
            {user?.name ? `Hello, ${user.name.split(' ')[0]}` : 'Hello there'}
          </h1>
        </div>
        <p className="text-lg text-text-tertiary font-normal">
          How can I help you today?
        </p>
      </div>

      {/* Input Box */}
      <div className="w-full max-w-[680px]">
        <div className="bg-bg-surface border border-border rounded-2xl shadow-soft overflow-hidden focus-within:border-accent-gold/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
            }}
            placeholder="Ask about AI fairness, bias detection, or upload a dataset..."
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 text-text-primary resize-none text-[15px] placeholder:text-text-tertiary outline-none px-5 pt-4 pb-2 leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim()) {
                  handleSendMessage(inputText);
                  setInputText('');
                  if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }
              }
            }}
          />
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-1">
              <input type="file" accept=".csv" className="hidden" id="home-file-upload"
                onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); }} />
              <label htmlFor="home-file-upload"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-fast cursor-pointer">
                <Paperclip size={15} />
                <span>Upload CSV</span>
              </label>
            </div>
            <button
              onClick={() => {
                if (inputText.trim()) {
                  handleSendMessage(inputText);
                  setInputText('');
                  if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }
              }}
              disabled={!inputText.trim()}
              className={`p-2 rounded-xl transition-all ${
                inputText.trim()
                  ? 'bg-accent-gold text-white shadow-sm hover:opacity-90'
                  : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
              }`}
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[
            { icon: <BarChart2 size={14} />, label: 'Analyze a dataset' },
            { icon: <ShieldCheck size={14} />, label: 'Detect gender bias' },
            { icon: <Scale size={14} />, label: 'Explain disparate impact' },
            { icon: <Lightbulb size={14} />, label: 'Suggest bias fixes' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => handleSendMessage(label)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-surface text-sm text-text-secondary hover:text-text-primary hover:border-accent-gold/40 hover:bg-bg-secondary transition-all"
            >
              <span className="text-text-tertiary">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <p className="text-center text-[11px] text-text-tertiary mt-5">
          Nyaya AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
