import React, { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageModal({ isOpen, onClose }) {
  const { lang, setLang, langs, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="sheet"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div
        className="sheet-box"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="lang-modal-title">{t.lang}</h2>
        <div className="langs">
          {langs.map((l) => (
            <button
              key={l.code}
              type="button"
              aria-pressed={l.code === lang}
              onClick={() => {
                setLang(l.code);
                onClose();
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
