
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split("-")[0];
    const initialLang = (localStorage.getItem("lang") as Language) || (browserLang === "en" ? "en" : "es");
    setLanguage(initialLang);
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    mounted,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
