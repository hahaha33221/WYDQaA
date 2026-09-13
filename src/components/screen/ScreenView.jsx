import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ScreenView() {
  const { data } = useStore();
  const { t } = useLanguage();

  const answeredList = useMemo(() => {
    return Object.values(data.questions || {})
      .filter((q) => q.status === "answered" && q.answer)
      .sort((a, b) => (b.answeredAt || 0) - (a.answeredAt || 0))
      .slice(0, 6);
  }, [data.questions]);

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>{t.screenTitle}</h1>
        <span className="badge-live">실시간 송출 중</span>
      </div>

      {answeredList.length > 0 ? (
        answeredList.map((q) => (
          <div key={q.id} className="item">
            <div className="q">Q. {q.text}</div>
            <div className="a">A. {q.answer}</div>
          </div>
        ))
      ) : (
        <div className="item">
          <div className="a">{t.screenEmpty}</div>
        </div>
      )}
    </div>
  );
}
