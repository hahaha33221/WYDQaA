import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";

export default function FloatingAskBar({ query, setQuery }) {
  const { lang, t } = useLanguage();
  const { addQuestion } = useStore();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);

  const trimmed = query.trim();
  const isTyped = trimmed.length >= 2;

  const handleSend = async () => {
    if (!isTyped || sending) return;
    setSending(true);
    try {
      await addQuestion(trimmed, lang);
      setQuery("");
      showToast(t.sent);
    } catch (err) {
      console.error(err);
      showToast(t.networkError);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ask">
      <div className="ask-inner">
        <button
          type="button"
          onClick={handleSend}
          disabled={!isTyped || sending}
        >
          {sending ? t.sending : t.send}
        </button>
        <small>{t.hint}</small>
      </div>
    </div>
  );
}
