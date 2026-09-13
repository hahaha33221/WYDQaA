import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import MyQuestions from "./MyQuestions";
import RecentAnswered from "./RecentAnswered";

export default function QaTabContent({ initialQuestion = "" }) {
  const { lang, t } = useLanguage();
  const { addQuestion, data } = useStore();
  const { showToast } = useToast();

  const [questionText, setQuestionText] = useState(initialQuestion);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recent answered list
  const recentAnswered = Object.values(data.questions || {})
    .filter((q) => q.status === "answered" && q.answer)
    .sort((a, b) => (b.answeredAt || 0) - (a.answeredAt || 0))
    .slice(0, 4);

  const trimmed = questionText.trim();
  const canSubmit = trimmed.length >= 2 && !isSubmitting;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await addQuestion(trimmed, lang);
      setQuestionText("");
      showToast(t.sent);
    } catch (err) {
      console.error(err);
      showToast(t.networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="qa-tab-container">
      {/* Question Form Card */}
      <div className="qa-submit-card">
        <div className="qa-card-header">
          <div className="qa-badge">
            <span className="qa-badge-dot" />
            <span>NEW QUESTION</span>
          </div>
          <h2>{t.tabQa}</h2>
          <p>{t.qaDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="qa-form">
          <div className="qa-textarea-wrap">
            <textarea
              className="qa-textarea"
              rows={3}
              placeholder={t.askPlaceholder}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              maxLength={300}
            />
            <div className="qa-char-count">{questionText.length}/300</div>
          </div>

          <div className="qa-form-footer">
            <div className="qa-privacy-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>{t.hint}</span>
            </div>

            <button
              type="submit"
              className="qa-submit-btn"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm" />
                  <span>{t.sending}</span>
                </>
              ) : (
                <>
                  <span>{t.send}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* My Questions Section */}
      <div className="qa-my-questions-wrap">
        <MyQuestions />
      </div>

      {/* Recent Answered Feed */}
      <div className="qa-recent-feed-wrap">
        <RecentAnswered questions={recentAnswered} />
      </div>
    </div>
  );
}
