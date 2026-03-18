import { useLanguage } from "../context/LanguageContext";
import { translations } from "./translations";

// Fonction pour remplacer les variables dans les textes ({{variable}})
function interpolate(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;

  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replace(`{{${key}}}`, String(value));
  }, text);
}

// Hook principal de traduction
export function useTranslation() {
  const { language } = useLanguage();

  // Fonction de traduction
  const trans = (key: string, vars?: Record<string, string | number>): string => 
    {
    // Permet d'accéder à des clés imbriquées comme "common.delete"
    const keys = key.split(".");

    let value: any = translations[language];

    // On descend dans l'objet de traduction
    for (const k of keys) {
      value = value?.[k];
    }

    // Si la clé n'existe pas, fallback sur la clé elle-même
    if (!value) return key;

    // Remplace les variables dynamiques ({{max}}, etc.)
    return interpolate(value, vars);
  };

  return trans;
}