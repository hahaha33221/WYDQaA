import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { timeAgo } from "../../utils/timeAgo";

export default function MyQuestions() {
  const { t } = useLanguage();
  const { data, mine } = useStore();

  const questionsMap = data.questions || {};
  const myQuestionsList = (mine || [])
    .map((id) => questionsMap[id])
    .filter(Boolean)
    .reverse();

  if (myQuestionsList.length === 0) {
    return (
      <div className="mine-empty-card">
        <div className="mine-empty-icon">💬</div>
        <strong>{t.mine}</strong>
        <p>아직 제출한 질문이 없습니다. 궁금한 점을 위에 작성해 보세요!</p>
      </div>
    );
  }

  return (
    <section className="mine-section">
      <div className="section-title-wrap">
        <h2>{t.mine}</h2>
        <span className="count-pill">{myQuestionsList.length}</span>
      </div>

      <div className="my-questions-list">
        {myQuestionsList.map((q) => {
          const isDone = q.status === "answered";
          return (
            <div key={q.id} className={`my-q-card ${isDone ? "answered" : "waiting"}`}>
              <div className="my-q-header">
                <span className={`status-tag ${isDone ? "done" : "wait"}`}>
                  <span className="status-bullet" />
                  {isDone ? t.done : t.wait}
                </span>
                <span className="my-q-time">{timeAgo(q.createdAt)}</span>
              </div>

              <div className="my-q-text">
                <span className="q-prefix">Q.</span>
                <span>{q.text}</span>
              </div>

              {q.answer ? (
                <div className="my-a-box">
                  <div className="my-a-badge">
                    <span className="staff-icon">✓</span>
                    <span>안내 데스크 답변</span>
                    {q.answeredAt && (
                      <span className="a-time">{timeAgo(q.answeredAt)}</span>
                    )}
                  </div>
                  <div className="my-a-text">{q.answer}</div>
                </div>
              ) : (
                <div className="my-waiting-box">
                  <div className="waiting-spinner-pulse" />
                  <span>담당자가 확인 중입니다. 곧 답변이 등록됩니다.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
