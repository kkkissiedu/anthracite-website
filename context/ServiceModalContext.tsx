"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type ServiceId =
  | "architectural-structural"
  | "sculptor"
  | "real-estate";

type ServiceModalContextType = {
  activeServiceId: ServiceId | null;
  openServiceModal: (id: ServiceId) => void;
  closeServiceModal: () => void;
};

const ServiceModalContext = createContext<ServiceModalContextType | null>(null);

export function useServiceModal(): ServiceModalContextType {
  const ctx = useContext(ServiceModalContext);
  if (!ctx)
    throw new Error("useServiceModal must be used within ServiceModalProvider");
  return ctx;
}

export function ServiceModalProvider({ children }: { children: ReactNode }) {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId | null>(
    null
  );

  const openServiceModal = useCallback((id: ServiceId) => {
    setActiveServiceId(id);
  }, []);

  const closeServiceModal = useCallback(() => {
    setActiveServiceId(null);
  }, []);

  return (
    <ServiceModalContext.Provider
      value={{ activeServiceId, openServiceModal, closeServiceModal }}
    >
      {children}
    </ServiceModalContext.Provider>
  );
}
