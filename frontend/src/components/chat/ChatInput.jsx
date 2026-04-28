import React, { useState, useRef } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, onFileUpload, isLoading }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="px-4 pb-5 pt-2 bg-bg-primary">
      <div className="max-w-[720px] mx-auto">
        <div className="bg-bg-surface border border-border rounded-2xl shadow-soft overflow-hidden focus-within:border-accent-gold/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
            }}
            placeholder="Ask Nyaya AI about fairness, bias detection..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent border-none focus:ring-0 text-text-primary resize-none text-[15px] placeholder:text-text-tertiary outline-none px-5 pt-4 pb-2 leading-relaxed disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex items-center justify-between px-3 pb-3 pt-1">
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
                disabled={isLoading}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-fast disabled:opacity-40"
                title="Upload CSV"
              >
                <Paperclip size={15} />
                <span>Upload CSV</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className={`p-2 rounded-xl transition-all ${
                text.trim() && !isLoading
                  ? 'bg-accent-gold text-white shadow-sm hover:opacity-90'
                  : 'bg-bg-secondary text-text-tertiary cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="w-[17px] h-[17px] border-2 border-text-tertiary border-t-transparent rounded-full animate-spin block" />
              ) : (
                <ArrowUp size={17} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-tertiary mt-2">
          Nyaya AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
