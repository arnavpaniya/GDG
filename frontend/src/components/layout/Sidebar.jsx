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
import { createNewChat, deleteChat, clearAllHistory } from '@/utils/chatService';
import Link from 'next/link';

const Sidebar = () => {
  const { 
    user, 
    chats, 
    currentChatId, 
    setCurrentChatId, 
    setSettingsOpen, 
    setSidebarOpen,
    removeChat,
    clearChats
  } = useStore();

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
    if (!chatId) return;
    
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      if (user) {
        try {
          await deleteChat(user.uid, chatId);
          removeChat(chatId);
          if (currentChatId === chatId) setCurrentChatId(null);
        } catch (err) {
          console.error('Delete error:', err);
        }
      } else {
        // Guest mode
        if (chatId === 'guest-session') {
          clearChats();
        }
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear ALL your chat history? This cannot be undone.')) {
      if (user) {
        try {
          await clearAllHistory(user.uid);
          clearChats();
        } catch (err) {
          console.error('Clear all error:', err);
        }
      } else {
        // Guest mode
        clearChats();
      }
    }
  };

  return (
    <aside className="w-[260px] h-full bg-bg-secondary border-r border-border flex flex-col transition-all duration-base">
      {/* Header */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-7 w-auto object-contain" />
            <h1 className="text-lg font-semibold text-text-primary">Nyaya AI</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-text-tertiary hover:text-text-primary transition-fast p-1.5 hover:bg-black/5 rounded-md"
            title="Hide Sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
        
        <button 
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 bg-bg-surface border border-border py-2.5 px-3 rounded-lg hover:bg-black/5 transition-fast text-sm font-medium text-text-primary shadow-sm"
        >
          <Plus size={15} />
          New chat
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <div className="px-3 py-2 mt-2 flex items-center justify-between">
          <p className="text-[11px] font-medium text-text-tertiary">Recent</p>
          {(user || chats.length > 0 || (currentChatId === 'guest-session')) && (
            <button 
              onClick={handleClearAll}
              className="text-[10px] text-text-tertiary hover:text-accent-red transition-fast font-medium"
            >
              Clear All
            </button>
          )}
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
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-fast text-left pr-10 ${
                    currentChatId === chat.id 
                      ? 'bg-bg-surface border border-border text-text-primary shadow-sm' 
                      : 'text-text-secondary hover:bg-black/5'
                  }`}
                >
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="truncate text-sm">{chat.title || 'Untitled Analysis'}</span>
                </button>
                <button 
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 text-text-tertiary hover:text-accent-red group-hover:opacity-100 focus:opacity-100 transition-all duration-200 z-10 ${
                    currentChatId === chat.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  title="Delete Chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-text-tertiary italic">No conversations yet</p>
            </div>
          )
        ) : (
          <div className="px-2 space-y-0.5">
            {currentChatId === 'guest-session' && (
              <div className="group relative">
                <button 
                  onClick={() => setCurrentChatId('guest-session')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-bg-surface border border-border text-text-primary shadow-sm text-left pr-10"
                >
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="truncate text-sm">Guest Session</span>
                </button>
                <button 
                  onClick={(e) => handleDeleteChat(e, 'guest-session')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-text-tertiary hover:text-accent-red opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 z-10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
            <div className="px-3 py-8 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-gold/5 flex items-center justify-center text-accent-gold/40">
                <MessageSquare size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary">Sign in to save history</p>
                <p className="text-[11px] text-text-tertiary px-4 leading-relaxed">Your analyses will be saved to your account</p>
              </div>
              <Link 
                href="/login"
                className="text-[11px] font-medium text-accent-gold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                <User size={14} />
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-text-primary truncate w-24">{user?.name || 'Guest'}</span>
              <span className="text-[10px] text-text-tertiary">{user?.plan || 'Free'} Plan</span>
            </div>
          </div>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="text-text-tertiary hover:text-text-primary transition-fast p-1.5 hover:bg-black/5 rounded-md"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
