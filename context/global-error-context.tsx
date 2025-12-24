"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConnectionErrorModal } from "@/components/ui";

interface GlobalErrorContextType {
  triggerGlobalError: () => void;
  clearGlobalError: () => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(
  undefined
);

export function GlobalErrorProvider({ children }: { children: ReactNode }) {
  const [isError, setIsError] = useState(false);

  const triggerGlobalError = () => setIsError(true);

  const clearGlobalError = () => {
    setIsError(false);
    // Opcional: Forzar recarga completa para limpiar estados corruptos
    window.location.href = "/login";
  };

  return (
    <GlobalErrorContext.Provider
      value={{ triggerGlobalError, clearGlobalError }}
    >
      {children}
      {/* El Modal vive aquí, invisible hasta que isError sea true */}
      {isError && <ConnectionErrorModal onRetry={clearGlobalError} />}
    </GlobalErrorContext.Provider>
  );
}

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context)
    throw new Error("useGlobalError debe usarse dentro de GlobalErrorProvider");
  return context;
};
