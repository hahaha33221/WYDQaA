import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import logoImg from "../../assets/logo.png";

export default function HeaderPanel({ onOpenLangModal }) {
  const { lang, langs, t } = useLanguage();
  const currentLangName = langs.find((l) => l.code === lang)?.name || "Language";

  return (
    <header className="wyd-header">
      <div className="wyd-header-top">
        <div className="header-badge">
          <span className="live-indicator-dot" />
          <span>INFO DESK</span>
        </div>
        <button
          type="button"
          className="lang-selector-btn"
          onClick={onOpenLangModal}
          aria-haspopup="dialog"
          aria-label={t.lang}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" />
          </svg>
          <span>{currentLangName}</span>
        </button>
      </div>

      {/* Centered WYD Seoul 2027 Official Logo */}
      <div className="wyd-logo-wrapper">
        <img
          src={logoImg}
          alt="WYD SEOUL 2027"
          className="wyd-main-logo"
        />
      </div>

      <div className="wyd-header-text">
        <h1 className="wyd-title">{t.title}</h1>
      </div>
    </header>
  );
}
