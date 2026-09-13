import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { CONFIG } from "../constants/config";
import { SEED } from "../constants/seedData";

const StoreContext = createContext();

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

class LocalStore {
  constructor() {
    this.live = false;
    this.subs = [];
    window.addEventListener("storage", (e) => {
      if (e.key === "lfaq") this.emit();
    });
    this.ch = "BroadcastChannel" in window ? new BroadcastChannel("lfaq") : null;
    if (this.ch) {
      this.ch.onmessage = () => this.emit();
    }
  }
  read() {
    let d;
    try {
      d = JSON.parse(localStorage.getItem("lfaq"));
    } catch {
      d = null;
    }
    d = d || {};
    d.faq = d.faq || {};
    d.questions = d.questions || {};
    d.answers = d.answers || {};
    return d;
  }
  write(d) {
    localStorage.setItem("lfaq", JSON.stringify(d));
    if (this.ch) this.ch.postMessage(1);
    this.emit();
  }
  emit() {
    const d = this.read();
    this.subs.forEach((f) => f(d, false));
  }
  subscribe(f) {
    this.subs.push(f);
    f(this.read(), false);
    return () => {
      this.subs = this.subs.filter((s) => s !== f);
    };
  }
  async add(path, obj) {
    const d = this.read();
    d[path] = d[path] || {};
    const id = uid();
    d[path][id] = { ...obj, id };
    this.write(d);
    return id;
  }
  async patch(path, id, obj) {
    const d = this.read();
    d[path] = d[path] || {};
    d[path][id] = { ...(d[path][id] || {}), ...obj };
    this.write(d);
  }
  async remove(path, id) {
    const d = this.read();
    if (d[path]) delete d[path][id];
    this.write(d);
  }
}

class FireStore {
  constructor(url) {
    this.url = url.replace(/\/$/, "");
    this.live = false;
    this.subs = [];
    this.data = { faq: {}, questions: {}, answers: {} };
    this.es = null;
    this.connect();
  }
  connect() {
    try {
      this.es = new EventSource(this.url + "/.json");
      this.es.addEventListener("put", (e) => this.apply(JSON.parse(e.data), true));
      this.es.addEventListener("patch", (e) => this.apply(JSON.parse(e.data), false));
      this.es.onopen = () => {
        this.live = true;
        this.emit();
      };
      this.es.onerror = () => {
        this.live = false;
        this.emit();
      };
    } catch {
      this.live = false;
      this.emit();
    }
  }
  apply(msg, isPut) {
    const parts = (msg.path || "").split("/").filter(Boolean);
    if (!parts.length) {
      this.data = msg.data || {};
    } else {
      let node = this.data;
      for (let i = 0; i < parts.length - 1; i++) {
        node[parts[i]] = node[parts[i]] || {};
        node = node[parts[i]];
      }
      const k = parts[parts.length - 1];
      if (isPut) {
        if (msg.data === null) delete node[k];
        else node[k] = msg.data;
      } else {
        Object.assign((node[k] = node[k] || {}), msg.data);
      }
    }
    this.data.faq = this.data.faq || {};
    this.data.questions = this.data.questions || {};
    this.data.answers = this.data.answers || {};
    this.emit();
  }
  emit() {
    this.subs.forEach((f) => f(this.data, this.live));
  }
  subscribe(f) {
    this.subs.push(f);
    f(this.data, this.live);
    return () => {
      this.subs = this.subs.filter((s) => s !== f);
    };
  }
  async add(path, obj) {
    const r = await fetch(`${this.url}/${path}.json`, {
      method: "POST",
      body: JSON.stringify(obj)
    });
    const j = await r.json();
    await fetch(`${this.url}/${path}/${j.name}.json`, {
      method: "PATCH",
      body: JSON.stringify({ id: j.name })
    });
    return j.name;
  }
  async patch(path, id, obj) {
    await fetch(`${this.url}/${path}/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify(obj)
    });
  }
  async remove(path, id) {
    await fetch(`${this.url}/${path}/${id}.json`, {
      method: "DELETE"
    });
  }
}

const storeInstance = CONFIG.dbUrl ? new FireStore(CONFIG.dbUrl) : new LocalStore();

export function StoreProvider({ children }) {
  const [data, setData] = useState({ faq: {}, questions: {}, answers: {} });
  const [live, setLive] = useState(false);
  const [mine, setMine] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lfaq.mine") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = storeInstance.subscribe((newData, isLive) => {
      setData({
        faq: newData.faq || {},
        questions: newData.questions || {},
        answers: newData.answers || {}
      });
      setLive(isLive);
    });
    return () => unsubscribe();
  }, []);

  const addQuestion = useCallback(async (text, lang) => {
    const id = await storeInstance.add("questions", {
      text,
      lang,
      status: "new",
      createdAt: Date.now()
    });
    setMine((prev) => {
      const next = [...prev, id];
      localStorage.setItem("lfaq.mine", JSON.stringify(next));
      return next;
    });
    return id;
  }, []);

  const answerQuestion = useCallback(async (id, answer, addToFaq = false, questionText = "", lang = "ko") => {
    await storeInstance.patch("questions", id, {
      answer,
      status: "answered",
      answeredAt: Date.now()
    });
    if (addToFaq && questionText) {
      await storeInstance.add("faq", {
        q: { [lang]: questionText },
        a: { [lang]: answer },
        createdAt: Date.now()
      });
    }
  }, []);

  const hideQuestion = useCallback(async (id) => {
    await storeInstance.patch("questions", id, { status: "hidden" });
  }, []);

  const reopenQuestion = useCallback(async (id) => {
    await storeInstance.patch("questions", id, { status: "new" });
  }, []);

  const saveSeedAnswer = useCallback(async (seedId, lang, answer) => {
    await storeInstance.patch("answers", seedId, { [lang]: answer });
  }, []);

  const addCustomFaq = useCallback(async (q, a, lang) => {
    await storeInstance.add("faq", {
      q: { [lang]: q },
      a: { [lang]: a },
      createdAt: Date.now()
    });
  }, []);

  const deleteCustomFaq = useCallback(async (id) => {
    await storeInstance.remove("faq", id);
  }, []);

  const wipeAllQuestions = useCallback(async () => {
    const qIds = Object.keys(data.questions || {});
    for (const id of qIds) {
      await storeInstance.remove("questions", id);
    }
  }, [data.questions]);

  // Combined FAQ list with Seed overrides and pending status
  const faqs = useMemo(() => {
    const ov = data.answers || {};
    const seeds = SEED.map((it) => {
      const a = { ...(it.a || {}), ...(ov[it.id] || {}) };
      Object.keys(a).forEach((k) => {
        if (!a[k] || !String(a[k]).trim()) delete a[k];
      });
      return {
        ...it,
        a,
        pending: Object.keys(a).length === 0
      };
    });
    const custom = Object.values(data.faq || {});
    return [...seeds, ...custom].sort((a, b) => (a.pending ? 1 : 0) - (b.pending ? 1 : 0));
  }, [data.answers, data.faq]);

  return (
    <StoreContext.Provider
      value={{
        data,
        live,
        mine,
        faqs,
        isCloud: !!CONFIG.dbUrl,
        addQuestion,
        answerQuestion,
        hideQuestion,
        reopenQuestion,
        saveSeedAnswer,
        addCustomFaq,
        deleteCustomFaq,
        wipeAllQuestions
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
