"use client";

import React, { useState } from 'react';
import { X, User, Moon, Sun, Database, Trash2, Download, Check, Edit2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import { clearAllHistory, updateUserProfile } from '@/utils/chatService';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, setUser, theme, setTheme } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isClearing, setIsClearing] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'data', label: 'Data Controls', icon: Database },
  ];

  const handleUpdateName = async () => {
    try {
      await updateUserProfile(newName);
      setUser({ ...user, name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all history? This action cannot be undone.')) return;
    
    setIsClearing(true);
    try {
      await clearAllHistory(user.uid);
      setIsClearing(false);
      onClose();
    } catch (error) {
      console.error('Failed to clear history:', error);
      setIsClearing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-bg-surface w-full max-w-[640px] h-[520px] rounded-[24px] shadow-2xl flex overflow-hidden border border-border"
      >
        {/* Sidebar */}
        <div className="w-[200px] bg-bg-secondary border-r border-border p-5 flex flex-col gap-2">
          <h2 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-2 mb-4">Settings</h2>
          <div className="flex flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-compact px-3 py-2.5 rounded-button text-sm transition-fast ${
                  activeTab === tab.id ? 'bg-bg-surface text-text-primary shadow-sm font-semibold' : 'text-text-secondary hover:bg-black/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-bg-surface">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="font-serif text-lg font-medium text-text-primary capitalize">{activeTab}</h3>
            <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-fast text-text-secondary">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'general' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-comfortable">
                      <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold text-2xl font-bold border border-accent-gold/20">
                        {user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-medium text-text-primary">{user?.name}</h4>
                        <p className="text-sm text-text-secondary">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6 pt-2">
                      <div className="flex justify-between items-center group">
                        <div className="flex-1 mr-4">
                          <p className="text-sm font-semibold text-text-primary">Display Name</p>
                          {isEditingName ? (
                            <div className="flex items-center gap-compact mt-2">
                              <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="flex-1 bg-bg-secondary border border-border rounded-button px-3 py-1.5 text-sm focus:outline-none focus:border-accent-gold"
                                autoFocus
                              />
                              <button onClick={handleUpdateName} className="p-1.5 bg-accent-gold text-white rounded-button hover:bg-accent-gold/90 transition-fast">
                                <Check size={16} />
                              </button>
                              <button onClick={() => setIsEditingName(false)} className="p-1.5 bg-bg-secondary text-text-secondary rounded-button hover:bg-black/5 transition-fast">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-text-secondary">Visible to other researchers in your team</p>
                          )}
                        </div>
                        {!isEditingName && (
                          <button 
                            onClick={() => {
                              setNewName(user?.name || '');
                              setIsEditingName(true);
                            }}
                            className="text-xs font-bold text-accent-gold opacity-0 group-hover:opacity-100 transition-fast flex items-center gap-1"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center group border-t border-border pt-6">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">Email Notifications</p>
                          <p className="text-xs text-text-secondary">Weekly reports on dataset fairness trends</p>
                        </div>
                        <div className="w-10 h-5 bg-accent-gold rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-8">
                    <div>
                      <p className="text-sm font-semibold text-text-primary mb-4">Color Theme</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'light', label: 'Parchment', icon: Sun, color: '#F5F4EF', border: '#D4A017' },
                          { id: 'dark', label: 'Midnight', icon: Moon, color: '#121210', border: '#E5B028' },
                          { id: 'nordic', label: 'Nordic', icon: Database, color: '#F0F4F8', border: '#2D6BE4' },
                          { id: 'forest', label: 'Forest', icon: Sparkles, color: '#F1F7F6', border: '#1D9E75' },
                        ].map((t) => (
                          <div key={t.id} className="space-y-2">
                            <button 
                              onClick={() => setTheme(t.id)}
                              className={`w-full group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                                theme === t.id ? 'border-accent-gold shadow-md' : 'border-border hover:border-text-tertiary bg-bg-secondary/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div 
                                  className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center"
                                  style={{ backgroundColor: t.color }}
                                >
                                  <t.icon size={14} style={{ color: t.id === 'dark' ? '#F5F4EF' : '#1A1916' }} />
                                </div>
                                <span className={`text-sm font-bold ${theme === t.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                                  {t.label}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: t.border }}></div>
                                <div className="h-1.5 w-4 rounded-full opacity-30" style={{ backgroundColor: t.border }}></div>
                              </div>
                              {theme === t.id && (
                                <motion.div 
                                  layoutId="active-theme"
                                  className="absolute top-2 right-2 text-accent-gold"
                                >
                                  <Check size={16} strokeWidth={3} />
                                </motion.div>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">System Preference</p>
                          <p className="text-xs text-text-secondary">Automatically switch between light and dark themes</p>
                        </div>
                        <button 
                          onClick={() => setTheme(theme === 'system' ? 'light' : 'system')}
                          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                            theme === 'system' ? 'bg-accent-gold' : 'bg-bg-secondary'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                            theme === 'system' ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="space-y-8">
                    <div className="p-comfortable border border-border rounded-card bg-black/[0.01] hover:bg-black/[0.02] transition-fast cursor-pointer">
                      <div className="flex items-start gap-comfortable">
                        <Download size={20} className="text-text-primary mt-1" />
                        <div>
                          <h4 className="text-sm font-bold text-text-primary mb-1">Export Data</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">Download a complete archive of your analysis history and dataset metrics in JSON format.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-comfortable border border-accent-red/20 rounded-card bg-accent-red/[0.02] group">
                      <div className="flex items-start gap-comfortable">
                        <Trash2 size={20} className="text-accent-red mt-1" />
                        <div>
                          <h4 className="text-sm font-bold text-accent-red mb-1">Delete All History</h4>
                          <p className="text-xs text-text-secondary leading-relaxed mb-4">Permanently remove all chat sessions and analysis reports. This action cannot be undone.</p>
                          <button 
                            onClick={handleClearHistory}
                            disabled={isClearing}
                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-button border border-accent-red/20 transition-all duration-base ${
                              isClearing ? 'bg-accent-red/50 cursor-not-allowed' : 'bg-accent-red text-white hover:bg-accent-red/90'
                            }`}
                          >
                            {isClearing ? 'Clearing...' : 'Clear My Data'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
