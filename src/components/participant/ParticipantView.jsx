import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import HeaderPanel from "./HeaderPanel";
import FaqTabContent from "./FaqTabContent";
import LanguageModal from "../common/LanguageModal";

export default function ParticipantView() {
  const { faqs } = useStore();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  return (
    <div className="participant-view-root">
      {/* Top Header with Centered WYD Seoul Logo */}
      <HeaderPanel onOpenLangModal={() => setIsLangModalOpen(true)} />

      {/* Main Container */}
      <main className="participant-main">
        {/* FAQ Content Display */}
        <div className="tab-content-area">
          <FaqTabContent faqs={faqs} />
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
