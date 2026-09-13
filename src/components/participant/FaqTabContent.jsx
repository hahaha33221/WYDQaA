import React, { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import FaqAccordion from "./FaqAccordion";

export default function FaqTabContent({ faqs, onSwitchToQa, initialQuery = "" }) {
  const { lang, pick, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState("all");

  // Extract unique tags
  const tags = useMemo(() => {
    const set = new Set();
    faqs.forEach((item) => {
      if (item.tag) {
        const text = pick(item.tag, lang);
        if (text) set.add(text);
      }
    });
    return Array.from(set);
  }, [faqs, lang, pick]);

  // Filter by search query and category tag
  const filtered = useMemo(() => {
    let list = faqs;
    if (selectedTag !== "all") {
      list = list.filter((item) => item.tag && pick(item.tag, lang) === selectedTag);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    const words = q.split(/\s+/);
    return list.filter((item) => {
      const hay = (
        Object.values(item.q || {}).join(" ") +
        " " +
        Object.values(item.a || {}).join(" ")
      ).toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [faqs, searchQuery, selectedTag, lang, pick]);

  return (
    <div className="faq-tab-container">
      {/* Search Input Bar */}
      <div className="wyd-search-box">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder={t.ph}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label={t.ph}
        />
        {searchQuery ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery("")}
            aria-label="clear"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* Category Filter Chips */}
      {tags.length > 0 && (
        <div className="category-scroll-wrapper" role="tablist" aria-label="Categories">
          <button
            type="button"
            className={`category-chip ${selectedTag === "all" ? "active" : ""}`}
            onClick={() => setSelectedTag("all")}
          >
            {t.allCategories}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`category-chip ${selectedTag === tag ? "active" : ""}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Count Indicator */}
      <div className="faq-count-badge">
        <span>{t.found(filtered.length)}</span>
      </div>

      {/* Accordion List */}
      <FaqAccordion items={filtered} />

      {/* Jump to Q&A Prompt Banner */}
      <div className="ask-banner-card">
        <div className="ask-banner-info">
          <strong>{t.emptyT}</strong>
          <p>{t.emptyB}</p>
        </div>
        <button
          type="button"
          className="ask-banner-btn"
          onClick={() => onSwitchToQa(searchQuery)}
        >
          <span>{t.goToQaBtn}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
