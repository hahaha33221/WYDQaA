import React, { useState } from "react";
import { CONFIG } from "../../constants/config";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";

export default function AdminGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const { t } = useLanguage();
  const { showToast } = useToast();

  const handleUnlock = (e) => {
    e.preventDefault();
    if (code.trim() === CONFIG.adminCode) {
      sessionStorage.setItem("lfaq.ok", "1");
      onUnlock();
    } else {
      showToast(t.wrongCode);
    }
  };

  return (
    <div className="gate">
      <h1 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 6px" }}>
        {t.adminTitle}
      </h1>
      <p className="note">{t.enterCode}</p>
      <form onSubmit={handleUnlock}>
        <input
          id="code"
          type="password"
          inputMode="numeric"
          placeholder="••••"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn" style={{ width: "100%" }}>
          {t.unlockBtn}
        </button>
      </form>
    </div>
  );
}
