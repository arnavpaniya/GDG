"use client";

import React from 'react';
import { Lock, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AuthGate = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-large-section bg-bg-surface rounded-card border border-border shadow-soft animate-in fade-in zoom-in-95 duration-500 max-w-[500px] mx-auto my-comfortable">
      <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mb-base text-accent-gold shadow-inner">
        <Lock size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-text-primary mb-compact text-center">
        Authentication Required
      </h3>
      
      <p className="text-text-secondary text-sm text-center mb-comfortable leading-relaxed">
        To view detailed fairness analysis, download legal reports, and save your history, please sign in to your Nyaya AI account.
      </p>

      <div className="flex flex-col w-full gap-compact">
        <button 
          onClick={() => router.push('/login')}
          className="w-full bg-accent-gold text-white font-bold py-comfortable rounded-button hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-base shadow-md shadow-accent-gold/20"
        >
          <LogIn size={18} />
          SIGN IN TO VIEW RESULTS
        </button>
        
        <button 
          onClick={() => router.push('/login?signup=true')}
          className="w-full bg-bg-secondary text-text-primary font-bold py-comfortable rounded-button border border-border hover:bg-bg-tertiary transition-fast flex items-center justify-center gap-base"
        >
          <UserPlus size={18} />
          CREATE FREE ACCOUNT
        </button>
      </div>

      <div className="mt-base flex items-center gap-compact text-[10px] text-text-tertiary font-bold uppercase tracking-widest">
        <Sparkles size={12} className="text-accent-gold" />
        Join 500+ Legal Experts Ensuring AI Fairness
      </div>
    </div>
  );
};

export default AuthGate;
