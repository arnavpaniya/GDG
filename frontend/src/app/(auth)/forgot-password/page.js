"use client";

import React, { useState } from 'react';
import { auth } from '@/utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\./, "").trim() || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
    >
      <Link href="/login" className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-fast mb-8 w-fit">
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl font-serif text-text-primary mb-2">Reset password</h2>
        <p className="text-text-secondary text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-sm flex items-start gap-2">
          <div className="mt-0.5 font-bold text-accent-red">!</div>
          <p>{error}</p>
        </div>
      )}

      {success ? (
        <div className="bg-accent-teal/10 border border-accent-teal/20 rounded-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-accent-teal/20 rounded-full flex items-center justify-center text-accent-teal mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">Check your email</h3>
          <p className="text-sm text-text-secondary mb-6">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <button 
            onClick={() => setSuccess(false)}
            className="text-sm text-accent-gold hover:text-accent-gold/80 font-medium transition-fast"
          >
            Try another email address
          </button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
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

          <button 
            type="submit" 
            disabled={loading || !email}
            className="w-full mt-2 bg-accent-gold text-white font-medium py-2.5 rounded-button shadow-soft hover:opacity-90 transition-fast flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>
                Send Reset Link
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
