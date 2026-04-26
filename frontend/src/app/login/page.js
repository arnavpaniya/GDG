"use client";

import React, { useState } from 'react';
import { auth, googleProvider } from '@/utils/firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-comfortable">
      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-bg-surface rounded-card shadow-soft p-large-section flex flex-col items-center">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-large-section">
          <img src="/assets/logo-mark.png" alt="Nyaya AI Logo" className="w-12 h-12 mb-base" />
          <h1 className="text-2xl font-serif text-text-primary mb-tight">Nyaya AI</h1>
          <p className="text-sm text-text-secondary">Fair AI starts here.</p>
        </div>

        {error && (
          <div className="w-full p-3 bg-accent-red/10 border border-accent-red/20 rounded-button text-accent-red text-xs mb-comfortable">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="w-full space-y-base">
          <div className="space-y-tight">
            <label className="text-xs font-medium text-text-secondary">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="w-full bg-bg-primary border border-border rounded-input py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold/30 transition-fast"
                required
              />
            </div>
          </div>

          <div className="space-y-tight">
            <label className="text-xs font-medium text-text-secondary">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-bg-primary border border-border rounded-input py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold/30 transition-fast"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent-gold text-white font-medium py-2.5 rounded-button shadow-soft hover:opacity-90 transition-fast flex items-center justify-center gap-compact"
          >
            {isLogin ? 'Continue' : 'Sign Up'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-base my-section">
          <div className="flex-1 h-[1px] bg-border"></div>
          <span className="text-[10px] font-bold text-text-tertiary uppercase">or</span>
          <div className="flex-1 h-[1px] bg-border"></div>
        </div>

        {/* Social Login */}
        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-bg-surface border border-border py-2.5 rounded-button text-sm font-medium text-text-primary hover:bg-black/5 transition-fast flex items-center justify-center gap-base"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Toggle Login/Signup */}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-section text-xs text-text-secondary hover:text-text-primary transition-fast"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>

      {/* Footer */}
      <p className="mt-large-section text-[10px] text-text-tertiary text-center max-w-[300px]">
        By signing in you agree to our <Link href="/terms" className="underline hover:text-text-secondary transition-fast">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-text-secondary transition-fast">Privacy Policy</Link>.
      </p>
    </div>
  );
}
