"use client";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "th" | "en";

interface LangContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "th",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const saved = localStorage.getItem("thailang.lang");
    if (saved === "en" || saved === "th") setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("thailang.lang", next);
    document.documentElement.setAttribute("lang", next);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
