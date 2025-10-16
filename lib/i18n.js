import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { allLanguages } from "@/constant/languages";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: allLanguages,
    debug: false,
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
      cookieMinutes: 60 * 24 * 30, // store for 30 days
      cookieDomain: typeof window !== "undefined" ? window.location.hostname : undefined,
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
