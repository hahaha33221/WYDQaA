import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import HeaderPanel from "./HeaderPanel";
import FaqTabContent from "./FaqTabContent";
import QaTabContent from "./QaTabContent";
import LanguageModal from "../common/LanguageModal";

export default function ParticipantView() {
  const { t } = useLanguage();
  const { live, isCloud, faqs, mine, data } = useStore();
  const [activeTab, setActiveTab] = useState("faq"); // 'faq' | 'qa'
  const [prefilledQuestion, setPrefilledQuestion] = useState("");
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Count answered questions for the user
  const questionsMap = data.questions || {};
  const myPendingCount = (mine || []).filter(
    (id) => questionsMap[id] && questionsMap[id].status !== "answered"
  ).length;

  const handleSwitchToQa = (queryText = "") => {
    setPrefilledQuestion(queryText);
    setActiveTab("qa");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="participant-view-root">
      {/* Top Header with Centered WYD Seoul Logo */}
      <HeaderPanel onOpenLangModal={() => setIsLangModalOpen(true)} />

      {/* Main Container */}
      <main className="participant-main">
        {/* Connection Status Bar */}
        <div className="live-status-bar">
          <div className="status-indicator">
            <span className={`status-dot ${live || !isCloud ? "online" : "offline"}`} />
            <span className="status-text">
              {isCloud ? t.live : t.local}
            </span>
          </div>
        </div>

        {/* Sticky Mobile Segmented Tabs: FAQ vs Q&A */}
        <div className="segmented-tabs-wrapper" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "faq"}
            className={`tab-btn ${activeTab === "faq" ? "active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
            <span>{t.tabFaq}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "qa"}
            className={`tab-btn ${activeTab === "qa" ? "active" : ""}`}
            onClick={() => setActiveTab("qa")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{t.tabQa}</span>
            {myPendingCount > 0 && (
              <span className="tab-bubble-badge">{myPendingCount}</span>
            )}
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="tab-content-area">
          {activeTab === "faq" ? (
            <FaqTabContent
              faqs={faqs}
              onSwitchToQa={handleSwitchToQa}
              initialQuery={prefilledQuestion}
            />
          ) : (
            <QaTabContent initialQuestion={prefilledQuestion} />
          )}
        </div>
      </main>

      {/* Language Selector Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </div>
  );
}
