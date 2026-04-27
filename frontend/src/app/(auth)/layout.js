import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Authentication - Nyaya AI',
  description: 'Login or create an account for Nyaya AI',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex bg-bg-primary">
      {/* Left Pane - Branding / Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-bg-surface overflow-hidden border-r border-border flex-col justify-between p-12">
        {/* Background Decorative Effects */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gold opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-8 w-auto object-contain" />
            <span className="text-xl font-serif font-bold text-text-primary tracking-tight">Nyaya AI</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5">
            <span className="w-2 h-2 rounded-full bg-accent-gold"></span>
            <span className="text-xs font-medium text-accent-gold uppercase tracking-wider">Enterprise Grade</span>
          </div>
          <h1 className="text-4xl font-serif text-text-primary leading-tight mb-4">
            Fair and transparent AI, starting today.
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Join thousands of professionals ensuring compliance and removing bias from their machine learning models with the industry's leading audit platform.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-6 text-sm text-text-tertiary">
          <p>© {new Date().getFullYear()} Nyaya AI</p>
          <Link href="/privacy" className="hover:text-text-primary transition-fast">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-text-primary transition-fast">Terms of Service</Link>
        </div>
      </div>
      
      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Logo - Only visible on small screens */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo-mark.png" alt="Nyaya AI" className="h-6 w-auto object-contain" />
            <span className="text-lg font-serif font-bold text-text-primary">Nyaya AI</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
