import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/menu.module.css";

const LANGS = [
  { code: "en", label: "English", flag: "en" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  // { code: "et", label: "Eesti", flag: "🇪🇪" }, // при необходимости
];

export default function LanguageSwitcherSideBarMenu({ isExpanded = true }) {
  const { t, i18n } = useTranslation();
  const current = (i18n.language || "en").split("-")[0];
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const setLang = (code) => {
    i18n.changeLanguage(code);
    try { localStorage.setItem("app-lang", code); } catch {}
    setOpen(false);
  };

  // закрытие по клику вне
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const active = LANGS.find((l) => l.code === current) || LANGS[0];

  return (
    <div className={styles.langRoot} ref={rootRef}>
      {/* Кнопка: в свернутом меню — только иконка/флаг; в развернутом — флаг+лейбл */}
      <button
        type="button"
        className={styles.langBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        title={t("language") || "Language"}
      >
        <span className={styles.langFlag}>{active.flag}</span>
        {isExpanded && (
          <>
            <span className={styles.langText}>
              {t("language") || "Language"}: {active.label}
            </span>
            <i className={`lni lni-chevron-down ${open ? styles.rotate180 : ""}`} />
          </>
        )}
      </button>

      {/* Меню */}
      {open && (
        <ul className={styles.langMenu} role="menu">
          {LANGS.map((l) => {
            const isActive = l.code === active.code;
            return (
              <li key={l.code} role="none">
                <button
                  role="menuitem"
                  className={`${styles.langItem} ${isActive ? styles.langItemActive : ""}`}
                  onClick={() => setLang(l.code)}
                >
                  <span className={styles.langFlag}>{l.flag}</span>
                  <span className={styles.langLabel}>{l.label}</span>
                  {isActive && <i className="lni lni-checkmark-circle-3" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
