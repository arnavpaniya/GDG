"use client";

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-primary py-large-section px-comfortable">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-compact text-accent-blue hover:underline mb-section text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Nyaya AI
        </Link>
        
        <header className="mb-large-section">
          <div className="w-12 h-12 bg-accent-gold rounded-xl flex items-center justify-center text-white mb-comfortable shadow-soft">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl font-serif text-text-primary mb-compact font-medium">Privacy Policy</h1>
          <p className="text-text-secondary font-medium uppercase tracking-widest text-[10px]">Last Updated: April 25, 2026</p>
        </header>

        <article className="space-y-12 text-text-primary pb-large-section">
          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">1. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We collect information to provide better services to all our users. This includes:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-3">
              <li><strong>Account Credentials:</strong> Email address and name provided during authentication.</li>
              <li><strong>Usage Data:</strong> Dataset metadata and CSV content uploaded for bias detection.</li>
              <li><strong>Session History:</strong> Analysis results, fairness scores, and chat interactions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">2. How We Use Your Data</h2>
            <p className="text-text-secondary leading-relaxed">
              Your datasets are processed locally in your browser whenever possible. When stored in our secure database, 
              they are encrypted and accessible only by your authenticated account. We use this data strictly to provide 
              bias detection results and history tracking. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">3. Data Retention and Deletion</h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your analysis history for as long as your account is active. You can delete individual chat 
              sessions or your entire history at any time through the "Data Controls" section in your Settings.
            </p>
          </section>

          <section className="bg-accent-gold-light p-section rounded-card border border-accent-gold/20">
            <h2 className="text-sm font-bold text-accent-gold uppercase tracking-widest mb-base">Contact Us</h2>
            <p className="text-text-primary text-sm leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please reach out at 
              <span className="font-bold ml-1">privacy@nyaya.ai</span>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
