"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type SanityProject = {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  /** Portable Text blocks */
  overview?: unknown[];
  mainImage?: unknown;
  gallery?: unknown[];
  videoUrl?: string;
  videoFile?: { asset: { url: string } };
  model3d?: { asset: { url: string } };
  panorama?: unknown[];
  client?: string;
  location?: string;
  year?: number;
};

type ModalContextType = {
  activeProject: SanityProject | null;
  openModal: (project: SanityProject) => void;
  closeModal: () => void;
};

const ProjectModalContext = createContext<ModalContextType | null>(null);

export function useProjectModal(): ModalContextType {
  const ctx = useContext(ProjectModalContext);
  if (!ctx) throw new Error("useProjectModal must be used within ProjectModalProvider");
  return ctx;
}

export function ProjectModalProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<SanityProject | null>(null);

  const openModal = useCallback((project: SanityProject) => {
    setActiveProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <ProjectModalContext.Provider value={{ activeProject, openModal, closeModal }}>
      {children}
    </ProjectModalContext.Provider>
  );
}
