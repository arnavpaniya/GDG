"use client";

import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User, 
  Search,
  Trash2,
  PanelLeftClose
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import useStore from '@/store/useStore';
import { createNewChat, deleteChat } from '@/utils/chatService';
import Link from 'next/link';

const Sidebar = () => {
  const { user, chats, currentChatId, setCurrentChatId, setSettingsOpen, setSidebarOpen } = useStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (!user || !chatId) return;
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await deleteChat(user.uid, chatId);
        if (currentChatId === chatId) setCurrentChatId(null);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <aside className="w-[300px] h-full bg-bg-secondary border-r border-border flex flex-col transition-all duration-base">
      {/* Header */}
      <div className="p-comfortable flex flex-col gap-base">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-base">
            <img src="/assets/logo-mark.png" alt="Nyaya AI" className="w-8 h-8" />
            <h1 className="text-xl font-serif font-medium text-text-primary">Nyaya AI</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-text-tertiary hover:text-text-primary transition-fast p-1.5 hover:bg-black/5 rounded-button"
            title="Hide Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        
        <button 
          onClick={handleNewChat}
          className="flex items-center justify-center gap-compact bg-bg-surface border border-border py-2.5 px-4 rounded-button shadow-soft hover:bg-black/5 transition-fast text-sm font-semibold text-text-primary"
        >
          <Plus size={16} />
          New Analysis
        </button>
      </div>

      {/* Search */}
      <div className="px-comfortable mb-base">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full bg-bg-surface border border-border rounded-button py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-accent-gold/30 transition-fast"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-compact space-y-1">
        <div className="px-comfortable py-2">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Recent Analysis</p>
        </div>
        {user ? (
          chats.length > 0 ? (
            chats.map((chat) => (
              <div 
                key={chat.id}
                className="group relative"
              >
                <button 
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`w-full flex items-center gap-compact px-comfortable py-2.5 rounded-button text-sm transition-fast text-left pr-10 ${
                    currentChatId === chat.id 
                      ? 'bg-bg-surface border border-border text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:bg-black/5'
                  }`}
                >
                  <MessageSquare size={14} className={currentChatId === chat.id ? 'text-accent-gold' : ''} />
                  <span className="truncate">{chat.title || 'Untitled Analysis'}</span>
                </button>
                <button 
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-tertiary hover:text-accent-red opacity-0 group-hover:opacity-100 transition-all duration-base"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="px-comfortable py-8 text-center">
              <p className="text-xs text-text-tertiary italic">No analysis history yet.</p>
            </div>
          )
        ) : (
          <div className="px-comfortable py-8 text-center flex flex-col items-center gap-base">
            <div className="w-10 h-10 rounded-full bg-accent-gold/5 flex items-center justify-center text-accent-gold/40">
              <MessageSquare size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-text-secondary">Sign in to save history</p>
              <p className="text-[10px] text-text-tertiary px-4 leading-relaxed">Your bias detection results will be saved to your account.</p>
            </div>
            <Link 
              href="/login"
              className="text-[10px] font-bold text-accent-gold uppercase tracking-widest hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-comfortable border-t border-border flex flex-col gap-base bg-black/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-compact">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent-gold-light flex items-center justify-center text-accent-gold border border-accent-gold/20">
                <User size={16} />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-semibold text-text-primary truncate w-24">{user?.name || 'Guest'}</span>
              <span className="text-[10px] text-text-secondary uppercase tracking-tighter font-bold">{user?.plan || 'Free'} Plan</span>
            </div>
          </div>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="text-text-secondary hover:text-text-primary transition-fast p-2 hover:bg-black/5 rounded-full"
          >
            <Settings size={18} />
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-compact px-3 py-2 rounded-button text-[10px] font-bold text-accent-red hover:bg-accent-red/5 transition-fast uppercase tracking-widest"
        >
          <LogOut size={14} />
          Sign Out
        </button>

        <div className="flex justify-center gap-base pt-2">
          <Link href="/privacy" className="text-[10px] text-text-tertiary hover:text-text-secondary transition-fast font-medium">Privacy</Link>
          <Link href="/terms" className="text-[10px] text-text-tertiary hover:text-text-secondary transition-fast font-medium">Terms</Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
