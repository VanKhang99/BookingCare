import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    lng: `${localStorage.getItem("language") === "vi" ? "vi" : "en"}`,
    fallbackLng: "vi",
    detection: {
      order: ["localStorage", "cookie", "subdomain", "htmlTag"],
      caches: ["cookie"],
    },
    // backend: {
    //   loadPath: "assets/locales/{{lng}}/{{lng}}.json",
    // },
    resources: {
      en: {
        translation: require("./translations/en/en.json"),
      },
      vi: {
        translation: require("./translations/vi/vi.json"),
      },
    },

    react: {
      wait: true,
    },
  });

export default i18next;
