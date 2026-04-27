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
    <div className="sticky bottom-0 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent pt-4 pb-4 px-4">
      <div className="max-w-[800px] mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="bg-bg-surface border border-border rounded-xl shadow-soft flex flex-col"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask Nyaya AI about AI fairness, bias detection..."
            className="w-full bg-transparent border-none focus:ring-0 text-text-primary p-4 resize-none min-h-[60px] max-h-[200px] text-[15px] placeholder:text-text-tertiary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="flex items-center justify-between px-3 py-2 border-t border-border">
            <div className="flex items-center gap-1">
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
                className="p-2 rounded-lg text-text-secondary hover:bg-black/5 hover:text-text-primary transition-fast flex items-center gap-1.5 text-xs font-medium"
                title="Upload CSV file"
              >
                <Paperclip size={16} />
              </button>
            </div>

            <button 
              type="submit"
              disabled={!text.trim() || isLoading}
              className={`p-2 rounded-lg transition-all duration-base ${
                text.trim() && !isLoading
                  ? 'bg-accent-gold text-white shadow-soft' 
                  : 'text-text-tertiary bg-black/5 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        <p className="text-[11px] text-text-tertiary text-center mt-2">
          Nyaya AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
