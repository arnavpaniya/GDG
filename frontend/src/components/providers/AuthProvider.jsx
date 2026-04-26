"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { subscribeToChats } from "@/utils/chatService";
import useStore from "@/store/useStore";
import SettingsModal from "@/components/layout/SettingsModal";
import Preloader from "@/components/landing/Preloader";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const { setUser, setChats, isSettingsOpen, setSettingsOpen, theme } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (t) => {
      // Remove all theme-related classes and attributes
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
      
      if (t === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) root.classList.add("dark");
        root.setAttribute("data-theme", isDark ? "dark" : "light");
      } else if (t === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.setAttribute("data-theme", t);
        if (t === "nordic" || t === "forest") {
          // These are light-ish themes, but we could add specific dark versions if needed
        }
      }
    };

    applyTheme(theme);

    // Listen for system theme changes if 'system' is selected
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  useEffect(() => {
    let unsubscribeChats = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
          avatar: user.photoURL,
          plan: "Free",
        });
        
        unsubscribeChats = subscribeToChats(user.uid, (chats) => {
          setChats(chats);
        });

        // Redirect from login if authenticated → app
        if (pathname === "/login") {
          router.push("/app");
        }
      } else {
        setUser(null);
        setChats([]);
        unsubscribeChats();

        // No global redirect-to-login. Truly protected actions handle their
        // own gating, and removing this lets not-found.js render properly.
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeChats();
    };
  }, [setUser, setChats, router, pathname]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <Preloader />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      {children}
    </>
  );
}
