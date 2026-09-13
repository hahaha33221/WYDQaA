import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { timeAgo } from "../../utils/timeAgo";

export default function RecentAnswered({ questions }) {
  const { t } = useLanguage();

  if (!questions || questions.length === 0) return null;

  return (
    <section className="recent-section">
      <div className="section-title-wrap">
        <h2>{t.recent}</h2>
        <span className="live-pill">LIVE</span>
      </div>
      <div className="recent-cards-list">
        {questions.map((q) => (
          <div key={q.id} className="recent-card">
            <div className="recent-card-meta">
              <span className="lang-tag">{q.lang?.toUpperCase() || "KO"}</span>
              <span className="time-text">{timeAgo(q.answeredAt || q.createdAt)}</span>
            </div>
            <div className="recent-q">Q. {q.text}</div>
            <div className="recent-a">
              <span className="a-marker">A.</span>
              <span>{q.answer}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
