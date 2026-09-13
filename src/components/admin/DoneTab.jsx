import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";
import { timeAgo } from "../../utils/timeAgo";

export default function DoneTab({ questions }) {
  const { answerQuestion, reopenQuestion } = useStore();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState({});

  const handleDraftChange = (id, text) => {
    setDrafts((prev) => ({ ...prev, [id]: text }));
  };

  const handleUpdate = async (q) => {
    const currentVal = drafts[q.id] !== undefined ? drafts[q.id] : q.answer;
    const trimmed = (currentVal || "").trim();
    if (!trimmed) {
      showToast("답변 내용을 적어주세요");
      return;
    }
    await answerQuestion(q.id, trimmed, false);
    showToast("답변을 수정했습니다");
  };

  const handleReopen = async (id) => {
    await reopenQuestion(id);
    showToast("질문을 접수함으로 이동했습니다");
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="empty">
        <strong>아직 답변한 질문이 없습니다</strong>
        접수함에서 답변하면 여기에 쌓입니다.
      </div>
    );
  }

  return (
    <div className="done-list">
      {questions.map((q) => {
        const val = drafts[q.id] !== undefined ? drafts[q.id] : q.answer || "";
        return (
          <div key={q.id} className="qrow">
            <div className="meta">
              <span>{q.lang?.toUpperCase() || "?"}</span>
              <span>·</span>
              <span>{timeAgo(q.answeredAt || q.createdAt)}</span>
            </div>
            <div className="q">{q.text}</div>
            <textarea
              value={val}
              onChange={(e) => handleDraftChange(q.id, e.target.value)}
            />
            <div className="row">
              <button
                type="button"
                className="btn"
                onClick={() => handleUpdate(q)}
              >
                답변 수정
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => handleReopen(q.id)}
              >
                다시 대기로
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
