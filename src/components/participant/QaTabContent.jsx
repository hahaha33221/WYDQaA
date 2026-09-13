import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { CONFIG } from "../../constants/config";
import qrImg from "../../assets/pigeonhole-qr.jpg";

export default function QaTabContent() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const qaUrl = CONFIG.pigeonholeUrl || "https://pigeonhole.at/5DESEEV8JCGZ";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qaUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = qaUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="qa-tab-container">
      {/* Main Pigeonhole Q&A Access Card */}
      <div className="pigeonhole-card">
        <div className="pigeonhole-badge">
          <span className="live-bullet" />
          <span>LIVE Q&A</span>
        </div>

        <h2 className="pigeonhole-title">{t.qaTitle}</h2>
        <p className="pigeonhole-desc">
          {t.qaGuide}
        </p>

        {/* QR Code Frame */}
        <div className="pigeonhole-qr-frame">
          <img
            src={qrImg}
            alt={t.qrAlt}
            className="pigeonhole-qr-img"
          />
          <span className="qr-scan-label">{t.qrScan}</span>
        </div>

        {/* Direct Link Action Button */}
        <a
          href={qaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pigeonhole-primary-btn"
        >
          <span>{t.qaGoBtn}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>

        {/* URL Box with Copy Button */}
        <div className="pigeonhole-url-box">
          <span className="pigeonhole-url-text">{qaUrl}</span>
          <button
            type="button"
            className="pigeonhole-copy-btn"
            onClick={handleCopy}
            aria-label={t.urlCopy}
          >
            {copied ? t.urlCopied : t.urlCopy}
          </button>
        </div>

        {/* Info Notice */}
        <div className="pigeonhole-notice">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>{t.hint}</span>
        </div>
      </div>
    </div>
  );
}
