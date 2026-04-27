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

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Check current state for prototype user
      const currentStoreUser = useStore.getState().user;
      
      if (firebaseUser && (firebaseUser.emailVerified || firebaseUser.isAnonymous)) {
        // Only update if it's a real user or if we don't have a prototype session already set up
        // This prevents overwriting the custom name/email we set during prototype bypass
        if (!currentStoreUser?.isPrototype || !firebaseUser.isAnonymous) {
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || (firebaseUser.isAnonymous ? "Prototype User" : firebaseUser.email.split("@")[0]),
            email: firebaseUser.email || (firebaseUser.isAnonymous ? "prototype@nyaya.ai" : ""),
            avatar: firebaseUser.photoURL,
            plan: firebaseUser.isAnonymous ? "Prototype" : "Free",
            isPrototype: firebaseUser.isAnonymous,
          });
        }
        
        unsubscribeChats = subscribeToChats(firebaseUser.uid, (chats) => {
          setChats(chats);
        });

        // Redirect from login if authenticated → app
        if (pathname === "/login" || pathname === "/signup") {
          router.push("/app");
        }
      } else if (currentStoreUser?.isPrototype) {
        // We have a prototype user, but no firebase user? 
        // This should normally not happen if we used signInAnonymously.
        // But if it does, we maintain it.
        console.log("Maintaining local prototype session");
        if (pathname === "/login" || pathname === "/signup") {
          router.push("/app");
        }
      } else {
        // Only sign out if we have a user that isn't verified and isn't anonymous
        if (firebaseUser && !firebaseUser.emailVerified && !firebaseUser.isAnonymous) {
          auth.signOut();
        }
        setUser(null);
        setChats([]);
        unsubscribeChats();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeChats();
    };
  }, [setUser, setChats, router, pathname]);

  return (
    <>
      <Preloader />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
      {!loading && children}
    </>
  );
}
