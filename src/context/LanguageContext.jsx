import React, { createContext, useContext, useState, useEffect } from "react";
import { LANGS, T } from "../constants/languages";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const detectLanguage = () => {
    const saved = localStorage.getItem("lfaq.lang");
    if (saved && LANGS.some((l) => l.code === saved)) {
      return saved;
    }
    const nav = (navigator.language || "ko").slice(0, 2).toLowerCase();
    return LANGS.some((l) => l.code === nav) ? nav : "en";
  };

  const [lang, setLangState] = useState(detectLanguage);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("lfaq.lang", newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = T[lang] || T.en;

  // Multi-language text selector helper
  const pick = (obj, language = lang) => {
    if (!obj) return "";
    return obj[language] || obj.en || obj.ko || Object.values(obj)[0] || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, pick, langs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
