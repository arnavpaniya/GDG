"use client";

import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AuthGate from './AuthGate';
import useStore from '@/store/useStore';

const ChatWindow = ({ messages, onSendMessage, onFileUpload, isLoading }) => {
  const scrollRef = useRef(null);
  const { currentChatId } = useStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-bg-primary">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-comfortable pt-large-section pb-comfortable scroll-smooth"
      >
        <div className="max-w-[720px] mx-auto w-full">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-tertiary italic text-sm mt-large-section">
              No messages yet. Start by asking a question or uploading a dataset.
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} message={msg} />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center gap-base text-text-secondary text-sm animate-pulse mb-section bg-bg-surface p-comfortable rounded-card border border-border shadow-soft w-fit">
              <div className="w-2 h-2 bg-accent-gold rounded-full"></div>
              Analyzing dataset for potential bias...
            </div>
          )}

          {currentChatId === 'guest-session' && <AuthGate />}
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
