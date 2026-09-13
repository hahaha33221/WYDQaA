import React, { useState } from "react";
import { SEED } from "../../constants/seedData";
import { useLanguage } from "../../context/LanguageContext";
import { useStore } from "../../context/StoreContext";
import { useToast } from "../../context/ToastContext";

export default function SeedFaqTab() {
  const { lang, setLang, langs, pick, t } = useLanguage();
  const { faqs, saveSeedAnswer, addCustomFaq, deleteCustomFaq, data } = useStore();
  const { showToast } = useToast();

  const [seedDrafts, setSeedDrafts] = useState({});
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const seedRows = faqs.filter((f) => SEED.some((s) => s.id === f.id));
  const waitingCount = seedRows.filter((f) => f.pending).length;
  const customFaqs = Object.values(data.faq || {});

  const handleSeedDraft = (id, text) => {
    setSeedDrafts((prev) => ({ ...prev, [id]: text }));
  };

  const handleSaveSeed = async (seedItem) => {
    const defaultVal = seedItem.a?.[lang] || "";
    const currentVal = seedDrafts[seedItem.id] !== undefined ? seedDrafts[seedItem.id] : defaultVal;
    await saveSeedAnswer(seedItem.id, lang, (currentVal || "").trim());
    showToast(t.savedAlert);
  };

  const handleAddFaq = async () => {
    const qTrim = newQ.trim();
    const aTrim = newA.trim();
    if (!qTrim || !aTrim) {
      showToast(t.emptyFieldAlert);
      return;
    }
    await addCustomFaq(qTrim, aTrim, lang);
    setNewQ("");
    setNewA("");
    showToast(t.addedFaqAlert);
  };

  const handleDeleteCustom = async (id) => {
    await deleteCustomFaq(id);
    showToast("삭제했습니다");
  };

  return (
    <div className="seed-faq-tab">
      <p className="note" style={{ margin: "0 0 12px" }}>
        미리 넣어둔 질문 {seedRows.length}개 중 {waitingCount}개가 답변을 기다리고 있습니다.
        답변은 언어별로 따로 저장되니, 아래에서 언어를 바꿔가며 채우세요.
      </p>

      <div className="row" style={{ margin: "0 0 22px" }}>
        {langs.map((l) => (
          <button
            key={l.code}
            type="button"
            className="btn ghost"
            onClick={() => setLang(l.code)}
            style={
              l.code === lang
                ? { background: "var(--petrol)", color: "#fff" }
                : {}
            }
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="seed-list">
        {seedRows.map((f) => {
          const defaultAnswer = f.a?.[lang] || "";
          const val = seedDrafts[f.id] !== undefined ? seedDrafts[f.id] : defaultAnswer;

          return (
            <div key={f.id} className="qrow">
              <div className="meta">
                <span>{pick(f.tag, lang)}</span>
                <span>·</span>
                <span>{f.pending ? "답변 없음" : "답변 있음"}</span>
              </div>
              <div className="q">{pick(f.q, lang)}</div>
              <textarea
                placeholder="답변을 적으면 참가자 화면에 바로 나타납니다."
                value={val}
                onChange={(e) => handleSeedDraft(f.id, e.target.value)}
              />
              <div className="row">
                <button
                  type="button"
                  className="btn amber"
                  onClick={() => handleSaveSeed(f)}
                >
                  저장
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="qrow" style={{ marginTop: "28px" }}>
        <div className="meta" style={{ fontSize: "14px", fontWeight: "700" }}>
          새 질문 직접 추가 ({langs.find((l) => l.code === lang)?.name})
        </div>
        <textarea
          placeholder="질문"
          style={{ minHeight: "54px" }}
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
        />
        <textarea
          placeholder="답변"
          value={newA}
          onChange={(e) => setNewA(e.target.value)}
        />
        <div className="row">
          <button type="button" className="btn" onClick={handleAddFaq}>
            FAQ에 추가
          </button>
        </div>
      </div>

      {customFaqs.length > 0 && (
        <div className="custom-faqs" style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "16px", margin: "0 0 12px" }}>직접 추가한 FAQ</h2>
          {customFaqs.map((f) => (
            <div key={f.id} className="qrow">
              <div className="q">{pick(f.q, lang)}</div>
              <div className="note" style={{ marginTop: "6px", whiteSpace: "pre-wrap" }}>
                {pick(f.a, lang)}
              </div>
              <div className="row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => handleDeleteCustom(f.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
