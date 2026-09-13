import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function FaqAccordion({ items }) {
  const { lang, pick, t } = useLanguage();
  const [openIds, setOpenIds] = useState({});

  const toggle = (id) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty">
        <strong>{t.emptyT}</strong>
        {t.emptyB}
      </div>
    );
  }

  return (
    <div className="faq-list">
      {items.map((it) => {
        const isOpen = !!openIds[it.id];
        const questionText = pick(it.q, lang);
        const tagText = it.tag ? pick(it.tag, lang) : null;
        const answerText = pick(it.a, lang);

        return (
          <div key={it.id} className={`qa-card ${isOpen ? "open" : ""}`}>
            <div
              className="qa-summary"
              onClick={() => toggle(it.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(it.id);
                }
              }}
              aria-expanded={isOpen}
            >
              <div className="qa-summary-content">
                {tagText && <span className="category-pill-tag">{tagText}</span>}
                <div className="qa-question-title">{questionText}</div>
              </div>
              <span className="qa-summary-arrow" aria-hidden="true" />
            </div>

            {isOpen && (
              <div className="qa-body-content">
                {it.pending ? (
                  <div className="pending-notice-box">
                    <span className="pill wait">{t.preparing}</span>
                    <p className="pending-text">{t.soon}</p>
                  </div>
                ) : (
                  <div className="answer-text-wrap">{answerText}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
