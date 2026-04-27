"use client";

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AuthGate from './AuthGate';
import useStore from '@/store/useStore';

const ChatWindow = ({ messages: messagesProp, onSendMessage, onFileUpload, isLoading }) => {
  const scrollRef = useRef(null);
  const { currentChatId } = useStore();
  // Always ensure messages is a safe array regardless of what gets passed in
  const messages = Array.isArray(messagesProp) ? messagesProp : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-bg-primary">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-8 pb-4 scroll-smooth"
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
