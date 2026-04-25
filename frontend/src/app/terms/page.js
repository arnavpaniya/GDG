"use client";

import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-bg-primary py-large-section px-comfortable">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-compact text-accent-blue hover:underline mb-section text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Nyaya AI
        </Link>
        
        <header className="mb-large-section">
          <div className="w-12 h-12 bg-accent-blue rounded-xl flex items-center justify-center text-white mb-comfortable shadow-soft">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl font-serif text-text-primary mb-compact font-medium">Terms of Service</h1>
          <p className="text-text-secondary font-medium uppercase tracking-widest text-[10px]">Version 1.0 — Effective April 25, 2026</p>
        </header>

        <article className="space-y-12 text-text-primary pb-large-section">
          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using Nyaya AI, you agree to be bound by these Terms of Service. If you do not agree to 
              all these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">2. Use of Service</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Nyaya AI provides tools for detecting bias in datasets. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-text-secondary space-y-3">
              <li>Ensuring you have the legal right to upload the datasets you analyze.</li>
              <li>Protecting any sensitive personal information within your datasets.</li>
              <li>Not using the service for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-serif mb-base border-b border-border pb-2">3. Disclaimer of Results</h2>
            <p className="text-text-secondary leading-relaxed">
              Nyaya AI's analysis is based on statistical models and does not constitute legal advice. While we strive 
              for accuracy, we do not guarantee that our results capture all forms of bias or that a "fair" score 
              guarantees legal compliance with anti-discrimination laws.
            </p>
          </section>

          <section className="bg-bg-secondary p-section rounded-card border border-border">
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-base text-center">Governing Law</h2>
            <p className="text-text-secondary text-sm leading-relaxed text-center italic">
              These terms shall be governed by and construed in accordance with the laws of your jurisdiction.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
