import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import ruTranslation from "./locales/ru/translation.json";

i18n
  .use(LanguageDetector)       
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["cookie", "localStorage", "navigator", "htmlTag"],

      lookupCookie: "app-lang",
      lookupLocalStorage: "app-lang",

      caches: ["cookie", "localStorage"],

      cookieMinutes: 60 * 24 * 365,
      cookieSameSite: "lax",
      cookieSecure: window.location.protocol === "https:",
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
