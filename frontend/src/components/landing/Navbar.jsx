"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why Nyaya" },
  { href: "#how", label: "How it works" },
  { href: "#outcomes", label: "Outcomes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
      data-testid="landing-navbar"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group" data-testid="nav-brand">
          <span className="relative">
            <img src="/assets/logo-mark.png" alt="" className="w-9 h-9 rounded-md" />
            <span className="absolute inset-0 rounded-md bg-accent-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="font-serif text-[20px] tracking-tight text-text-primary">
            Nyaya<span className="text-accent-gold"> AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-pill"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/app"
            data-testid="nav-launch-app"
            className="hidden md:inline-flex items-center gap-1.5 bg-accent-gold text-[#0a0a08] hover:brightness-110 active:scale-[0.98] px-4 py-2 rounded-pill text-sm font-semibold transition-all shadow-glow-gold"
          >
            Launch App
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md border border-border text-text-primary"
            aria-label="menu"
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl"
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-text-secondary hover:text-text-primary"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/app"
              className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent-gold text-[#0a0a08] px-4 py-2.5 rounded-pill text-sm font-semibold"
              data-testid="nav-launch-app-mobile"
            >
              Launch App <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
