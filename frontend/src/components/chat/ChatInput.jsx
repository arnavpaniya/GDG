import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, onFileUpload, isLoading }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="sticky bottom-0 bg-bg-primary pt-comfortable pb-base px-comfortable">
      <div className="max-w-[720px] mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-gold/10 to-accent-blue/10 rounded-[20px] blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="relative bg-bg-surface border border-border rounded-[18px] shadow-soft flex flex-col"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your dataset summary or ask about AI fairness..."
            className="w-full bg-transparent border-none focus:ring-0 text-text-primary p-4 resize-none min-h-[80px] text-[15px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-black/[0.01]">
            <div className="flex gap-compact">
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-button text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast flex items-center gap-compact text-xs font-medium"
              >
                <Paperclip size={16} />
                Attach CSV
              </button>
            </div>

            <button 
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`p-2 rounded-button transition-all duration-base ${
                text.trim() && !isLoading
                  ? 'bg-accent-gold text-white shadow-soft' 
                  : 'text-text-tertiary bg-black/5 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-text-tertiary text-center mt-3 uppercase tracking-widest font-bold">
          Nyaya AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
