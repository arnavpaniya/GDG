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
      {/* Header with Actions */}
      <div className="px-6 py-3 border-b border-border flex items-center justify-between bg-bg-surface/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></div>
          <h2 className="text-sm font-medium text-text-primary">Nyaya AI Session</h2>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all uppercase tracking-widest border border-border/50"
          >
            <Download size={14} /> Export
          </button>
          
          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border rounded-xl shadow-lg z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={handleExportPDF}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast"
              >
                <FileText size={16} className="text-red-500" />
                Export as PDF
              </button>
              <button 
                onClick={handleExportJSON}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast"
              >
                <FileCode size={16} className="text-blue-500" />
                Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 px-4 pt-8 pb-4 scroll-smooth"
      >
        <div className="max-w-[800px] mx-auto w-full">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-tertiary text-sm">
              <p>No messages yet. Start a new conversation.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-4 animate-pulse bg-bg-surface p-4 rounded-lg border border-border shadow-soft w-fit">
              <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
              Analyzing dataset for potential bias...
            </div>
          )}

          <div ref={bottomRef} className="h-20" />

          {/* AuthGate removed so guest mode works freely */}
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
