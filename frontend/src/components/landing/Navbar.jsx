"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, LogOut, Settings, User as UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nProvider";
import useStore from "@/store/useStore";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, setUser, setSettingsOpen } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfileOpen(false);
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  const NAV_LINKS = [
    { href: "#features", label: t("nav.features") },
    { href: "#why", label: t("nav.why") },
    { href: "#how", label: t("nav.how") },
    { href: "#outcomes", label: t("nav.outcomes") },
  ];

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
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 group shrink-0" data-testid="nav-brand">
          <span className="relative flex items-center justify-center">
            <img src="/assets/logo-mark.png" alt="" className="h-9 w-auto object-contain" />
            <span className="absolute inset-0 rounded-md bg-accent-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="font-serif text-[20px] tracking-tight text-text-primary">
            Nyaya<span className="text-accent-gold"> AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-pill"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          {user ? (
            <div className="hidden md:block relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full border border-border overflow-hidden bg-bg-surface flex items-center justify-center hover:opacity-80 transition-fast shadow-soft"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif font-bold text-accent-gold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={18} />}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border rounded-xl shadow-lg py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/app" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <UserIcon size={16} />
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          setSettingsOpen(true);
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-border py-1">
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-accent-red/10 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              data-testid="nav-sign-in"
              className="hidden md:inline-flex items-center gap-1.5 bg-accent-gold text-[#0a0a08] hover:brightness-110 active:scale-[0.98] px-4 py-2 rounded-pill text-sm font-semibold transition-all shadow-glow-gold"
            >
              Sign In
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md border border-border text-text-primary"
            aria-label="menu"
            data-testid="nav-mobile-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="lg:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl"
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
            <div className="sm:hidden mt-2">
              <LanguageSwitcher />
            </div>
            {user ? (
              <div className="mt-3 border-t border-border pt-3">
                <div className="px-2 mb-2">
                  <p className="text-sm font-medium text-text-primary truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                </div>
                <Link
                  href="/app"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 px-2 text-text-secondary hover:text-text-primary"
                >
                  <UserIcon size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 px-2 text-text-secondary hover:text-text-primary text-left"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 px-2 text-accent-red hover:text-accent-red/80 text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="mt-3 inline-flex items-center justify-center gap-1.5 bg-accent-gold text-[#0a0a08] px-4 py-2.5 rounded-pill text-sm font-semibold"
                data-testid="nav-sign-in-mobile"
              >
                Sign In <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
