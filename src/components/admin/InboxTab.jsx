import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { timeAgo } from "../../utils/timeAgo";

export default function InboxTab({ questions }) {
  const { answerQuestion, hideQuestion } = useStore();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [drafts, setDrafts] = useState({});
  const [addToFaqFlags, setAddToFaqFlags] = useState({});

  const handleDraftChange = (id, text) => {
    setDrafts((prev) => ({ ...prev, [id]: text }));
  };

  const handleToggleFaq = (id) => {
    setAddToFaqFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAnswer = async (q) => {
    const text = (drafts[q.id] || "").trim();
    if (!text) {
      showToast(t.emptyAnswerAlert);
      return;
    }
    const shouldAddFaq = !!addToFaqFlags[q.id];
    await answerQuestion(q.id, text, shouldAddFaq, q.text, q.lang || "ko");
    showToast(t.sentAnswerAlert);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="empty">
        <strong>받은 질문이 없습니다</strong>
        QR을 인쇄해 안내판에 붙이면 질문이 여기로 들어옵니다.
      </div>
    );
  }

  return (
    <div className="inbox-list">
      {questions.map((q) => (
        <div key={q.id} className="qrow">
          <div className="meta">
            <span>{q.lang?.toUpperCase() || "?"}</span>
            <span>·</span>
            <span>{timeAgo(q.createdAt)}</span>
          </div>
          <div className="q">{q.text}</div>
          <textarea
            placeholder="답변을 적으세요. 참가자 화면에 바로 나타납니다."
            value={drafts[q.id] !== undefined ? drafts[q.id] : ""}
            onChange={(e) => handleDraftChange(q.id, e.target.value)}
          />
          <div className="row">
            <button
              type="button"
              className="btn amber"
              onClick={() => handleAnswer(q)}
            >
              답변 보내기
            </button>
            <label className="chk">
              <input
                type="checkbox"
                checked={!!addToFaqFlags[q.id]}
                onChange={() => handleToggleFaq(q.id)}
              />
              FAQ에도 추가
            </label>
            <button
              type="button"
              className="btn ghost"
              onClick={() => hideQuestion(q.id)}
            >
              숨기기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
