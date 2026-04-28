"use client";

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AuthGate from './AuthGate';
import useStore from '@/store/useStore';
import { Download, FileText, FileCode, MoreVertical } from 'lucide-react';
import { exportFullChatToPDF, exportFullChatToJSON } from '@/utils/exportService';
import { useState } from 'react';

const ChatWindow = ({ messages: messagesProp, onSendMessage, onFileUpload, isLoading }) => {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const { currentChatId } = useStore();
  // Always ensure messages is a safe array regardless of what gets passed in
  const messages = Array.isArray(messagesProp) ? messagesProp : [];

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const handleExportPDF = () => {
    exportFullChatToPDF(messages);
    setIsExportMenuOpen(false);
  };

  const handleExportJSON = () => {
    exportFullChatToJSON(messages);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-bg-primary h-full">
      {/* Minimal header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-bg-primary/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <img src="/assets/logo-mark.png" alt="" className="h-5 w-auto opacity-70" />
          <span className="text-sm font-medium text-text-secondary">Nyaya AI</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-fast"
            title="Export"
          >
            <MoreVertical size={16} />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-bg-surface border border-border rounded-xl shadow-lg z-30 overflow-hidden">
              <button onClick={handleExportPDF}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast">
                <FileText size={15} className="text-red-400" /> Export PDF
              </button>
              <button onClick={handleExportJSON}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast">
                <FileCode size={15} className="text-blue-400" /> Export JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 px-4 pt-8 pb-2 scroll-smooth"
      >
        <div className="max-w-[720px] mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center text-text-tertiary text-sm mt-20">
              No messages yet.
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3 py-4 px-1">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-accent-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-accent-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-accent-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-text-tertiary">Analyzing...</span>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        onFileUpload={onFileUpload}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;
