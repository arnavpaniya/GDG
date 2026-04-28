"use client";

import React, { useState } from 'react';
import { auth, googleProvider } from '@/utils/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'google' or 'email'
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAuthMethod('email');

    // Prototype Logic: If we're in development/prototype mode, bypass real auth if requested
    // Or just allow specific "prototype" credentials
    const isPrototypeMatch = email && password; // For now, any non-empty input works as a prototype

    try {
      // Attempt real Firebase Auth first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email address before logging in.");
        setLoading(false);
        return;
      }

      router.push('/app');
    } catch (err) {
      // If Firebase fails but we have inputs, treat it as a prototype login
      if (isPrototypeMatch) {
        console.log("Prototype bypass triggered");
        const result = await signInAnonymously(auth);
        setUser({
          uid: result.user.uid,
          name: email.split('@')[0],
          email: email,
          avatar: null,
          plan: "Prototype",
          isPrototype: true,
        });
        router.push('/app');
      } else {
        setError(err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\./, "").trim() || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthMethod('google');
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // AuthProvider will handle the state update and redirection
      router.push('/app');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="flex flex-col w-full relative">
      <div className="mb-10 text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-serif text-text-primary mb-3">Welcome back</h2>
          <p className="text-text-secondary text-base font-light">Securely access your fairness audit dashboard.</p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-accent-red/5 border border-accent-red/20 rounded-2xl text-accent-red text-sm flex items-start gap-3 backdrop-blur-sm"
          >
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent-red/10 flex items-center justify-center font-bold">!</div>
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 mb-8">
        <button 
          onClick={handleGoogleSignIn}
          type="button"
          disabled={loading}
          className="group w-full bg-white dark:bg-white/5 border border-border py-3.5 rounded-2xl text-sm font-semibold text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {loading && authMethod === 'google' ? (
            <Loader2 size={20} className="animate-spin text-accent-gold" />
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-[1px] bg-border opacity-50"></div>
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em]">or use workspace email</span>
        <div className="flex-1 h-[1px] bg-border opacity-50"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Work Email</label>
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-gold transition-colors" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full bg-bg-primary/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all duration-300"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Security Key</label>
            <Link href="/forgot-password" size="sm" className="text-xs font-semibold text-accent-gold hover:opacity-80 transition-opacity">
              Lost access?
            </Link>
          </div>
          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-gold transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-bg-primary/50 border border-border rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full group mt-4 bg-accent-gold text-[#0a0a08] font-bold py-4 rounded-2xl shadow-glow-gold hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
        >
          {loading && authMethod === 'email' ? <Loader2 size={20} className="animate-spin" /> : (
            <>
              <ShieldCheck size={20} />
              <span>Authorize Access</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-10 text-center text-sm text-text-secondary font-medium">
        New to the protocol?{' '}
        <Link href="/signup" className="text-accent-gold hover:underline underline-offset-4 transition-all">
          Generate Invitation
        </Link>
      </p>
    </div>
  );
}
