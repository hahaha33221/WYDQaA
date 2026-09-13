import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import AdminGate from "./AdminGate";
import InboxTab from "./InboxTab";
import DoneTab from "./DoneTab";
import SeedFaqTab from "./SeedFaqTab";
import QrTab from "./QrTab";
import SettingsTab from "./SettingsTab";

export default function AdminView() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("lfaq.ok") === "1"
  );
  const [currentTab, setCurrentTab] = useState("inbox");
  const { data } = useStore();

  const qs = useMemo(() => Object.values(data.questions || {}), [data.questions]);

  const inboxQuestions = useMemo(
    () =>
      qs
        .filter((q) => q.status !== "answered" && q.status !== "hidden")
        .sort((a, b) => b.createdAt - a.createdAt),
    [qs]
  );

  const doneQuestions = useMemo(
    () =>
      qs
        .filter((q) => q.status === "answered")
        .sort((a, b) => (b.answeredAt || 0) - (a.answeredAt || 0)),
    [qs]
  );

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />;
  }

  const tabList = [
    { key: "inbox", label: `접수함 (${inboxQuestions.length})` },
    { key: "done", label: `답변완료 (${doneQuestions.length})` },
    { key: "faq", label: "예상 질문" },
    { key: "qr", label: "QR 코드" },
    { key: "set", label: "설정" }
  ];

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <h1>운영자 화면</h1>
          <p className="sub">
            받은 질문 {inboxQuestions.length}개 대기 · 답변 {doneQuestions.length}개
          </p>
        </div>
        <a
          href="#"
          className="btn ghost"
          style={{ textDecoration: "none", fontSize: "13px" }}
        >
          ← 참가자 화면 보기
        </a>
      </div>

      <div className="tabs" role="tablist">
        {tabList.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={currentTab === key}
            onClick={() => setCurrentTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {currentTab === "inbox" && <InboxTab questions={inboxQuestions} />}
      {currentTab === "done" && <DoneTab questions={doneQuestions} />}
      {currentTab === "faq" && <SeedFaqTab />}
      {currentTab === "qr" && <QrTab />}
      {currentTab === "set" && <SettingsTab />}
    </div>
  );
}
