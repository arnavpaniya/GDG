import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Authentication - Nyaya AI',
  description: 'Login or create an account for Nyaya AI',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-bg-primary overflow-hidden">
      {/* Left Pane - Branding / Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-bg-secondary overflow-hidden border-r border-border flex-col justify-between p-12 grain">
        {/* Background Decorative Effects */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-radial-gold opacity-15 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[80px]"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent-gold blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="text-2xl font-serif font-bold text-text-primary tracking-tight">Nyaya<span className="text-accent-gold"> AI</span></span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-gold/20 bg-accent-gold/5 backdrop-blur-sm animate-pulse-ring">
            <span className="w-2 h-2 rounded-full bg-accent-gold"></span>
            <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em]">Enterprise Standard</span>
          </div>
          <h1 className="text-5xl font-serif text-text-primary leading-[1.1] mb-6 glow-text">
            Trustworthy AI starts with <span className="text-gold-gradient">Nyaya</span>.
          </h1>
          <p className="text-text-secondary text-xl leading-relaxed font-light">
            Empowering teams to audit models, detect biases, and ship code that stands up to the highest standards of fairness.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-8 text-xs text-text-tertiary font-medium uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Nyaya AI</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-accent-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      
      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10"></div>
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent-gold/5 blur-3xl"></div>
        </div>

        {/* Mobile Logo - Only visible on small screens */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-8 w-auto object-contain" />
            <span className="text-xl font-serif font-bold text-text-primary">Nyaya<span className="text-accent-gold"> AI</span></span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] relative z-10">
          <div className="glass p-8 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effect on hover */}
            <div className="absolute -inset-px bg-gradient-to-b from-accent-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {children}
          </div>
          
          <div className="mt-8 text-center text-[11px] text-text-tertiary uppercase tracking-[0.2em] font-bold opacity-50">
            Powered by Decentralized Fairness Protocols
          </div>
        </div>
      </div>
    </div>
  );
}
