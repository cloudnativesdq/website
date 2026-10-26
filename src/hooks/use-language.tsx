"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/translations";
import { LANGUAGE_COOKIE } from "@/lib/language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Persists the choice where the server reads it (see resolveLanguage) and keeps <html lang> in sync.
function persist(lang: Language) {
  document.documentElement.lang = lang;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LANGUAGE_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

// The root layout resolves the language from the cookie or Accept-Language, so the server HTML is
// already visible and in the right language.
export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    persist(lang);
  };

  // One-time migration: visitors from before the cookie kept their choice in localStorage.
  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === null) return;
    localStorage.removeItem("lang");
    const hasCookie = document.cookie.split("; ").some((c) => c.startsWith(`${LANGUAGE_COOKIE}=`));
    if (!hasCookie && (stored === "es" || stored === "en")) {
      persist(stored);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is browser-only
      if (stored !== initialLanguage) setLanguageState(stored);
    }
  }, [initialLanguage]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
