"use client";

import React, { useState } from 'react';
import { auth, googleProvider } from '@/utils/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      if (userCredential.user && name) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }

      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      
      setVerificationSent(true);
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\./, "").trim() || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
      router.push('/app');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign up with Google.");
      }
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

  if (verificationSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center w-full"
      >
        <div className="w-16 h-16 bg-accent-teal/10 text-accent-teal rounded-full flex items-center justify-center mb-6">
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-serif text-text-primary mb-4">Check your email</h2>
        <p className="text-text-secondary text-sm mb-8">
          We've sent a verification link to <strong>{email}</strong>. Please verify your email to continue.
        </p>
        <Link 
          href="/login" 
          className="w-full bg-accent-gold text-white font-medium py-2.5 rounded-button shadow-soft hover:opacity-90 transition-fast flex items-center justify-center"
        >
          Return to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-text-primary mb-2">Create an account</h2>
        <p className="text-text-secondary text-sm">Start building fairer AI models today.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm flex items-start gap-2">
          <div className="mt-0.5 font-bold text-accent-red">!</div>
          <p>{error}</p>
        </div>
      )}

      <button 
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full bg-bg-surface border border-border py-2.5 rounded-button text-sm font-medium text-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-fast flex items-center justify-center gap-3 mb-6"
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-[1px] bg-border"></div>
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">or sign up with email</span>
        <div className="flex-1 h-[1px] bg-border"></div>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe" 
              className="w-full bg-bg-primary border border-border rounded-input py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30 transition-fast"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full bg-bg-primary border border-border rounded-input py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30 transition-fast"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-secondary">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password" 
              className="w-full bg-bg-primary border border-border rounded-input py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30 transition-fast"
              required
              minLength={6}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-accent-gold text-white font-medium py-2.5 rounded-button shadow-soft hover:opacity-90 transition-fast flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : (
            <>
              Create Account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="text-accent-gold hover:text-accent-gold/80 font-medium transition-fast">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
