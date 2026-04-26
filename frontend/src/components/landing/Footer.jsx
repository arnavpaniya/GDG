"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-border py-14 md:py-20" data-testid="landing-footer">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <img src="/assets/logo-mark.png" alt="" className="w-9 h-9" />
            <span className="font-serif text-xl text-text-primary">
              Nyaya<span className="text-accent-gold"> AI</span>
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            <span className="font-serif italic">Nyaya</span> (न्याय) — justice, fairness, ethical judgement.
            Built for teams who refuse to ship biased AI.
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">Product</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="text-text-secondary hover:text-accent-gold transition-colors">Features</a></li>
            <li><a href="#why" className="text-text-secondary hover:text-accent-gold transition-colors">Why Nyaya</a></li>
            <li><a href="#how" className="text-text-secondary hover:text-accent-gold transition-colors">How it works</a></li>
            <li><a href="#outcomes" className="text-text-secondary hover:text-accent-gold transition-colors">Outcomes</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">Get started</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/app" className="text-text-secondary hover:text-accent-gold transition-colors">Launch app</Link></li>
            <li><Link href="/login" className="text-text-secondary hover:text-accent-gold transition-colors">Sign in</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-text-tertiary mb-4">Legal</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="text-text-secondary hover:text-accent-gold transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-text-secondary hover:text-accent-gold transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-text-tertiary text-xs">
        <span>© {new Date().getFullYear()} Nyaya AI. All rights reserved.</span>
        <span className="font-mono tracking-[0.2em] uppercase">Justice in every decision</span>
      </div>
    </footer>
  );
}
