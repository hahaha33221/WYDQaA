import React, { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { StoreProvider } from "./context/StoreContext";
import { ToastProvider } from "./context/ToastContext";
import ParticipantView from "./components/participant/ParticipantView";
import AdminView from "./components/admin/AdminView";
import ScreenView from "./components/screen/ScreenView";

function AppContent() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (hash === "#admin") {
    return <AdminView />;
  }

  if (hash === "#screen") {
    return <ScreenView />;
  }

  return <ParticipantView />;
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </StoreProvider>
    </LanguageProvider>
  );
}
