import { createContext, useContext, useEffect, useState } from "react";

// Langages disponibles
type Language = "fr" | "en";

// Creation d'un contexte global
const LanguageContext = createContext<{language: Language; toggleLanguage: () => void;}>({
  language: "fr",
  toggleLanguage: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  // Charge la langue sauvegardée
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved) setLanguage(saved);
  }, []);

  // Change de langue
  const toggleLanguage = () => {
    const next = language === "fr" ? "en" : "fr";
    setLanguage(next);
    localStorage.setItem("lang", next);
  };

  return (
    // Transmet la variable de langue et la fonction de changement aux composants de l'app
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Simplification pour l'utilisation avec un hook
export const useLanguage = () => useContext(LanguageContext);