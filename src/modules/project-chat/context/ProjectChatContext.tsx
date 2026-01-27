"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface ProjectChatContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const ProjectChatContext = createContext<ProjectChatContextValue | undefined>(
  undefined
);

interface ProjectChatProviderProps {
  children: React.ReactNode;
}

export function ProjectChatProvider({ children }: ProjectChatProviderProps) {
  // Desktop chat should start collapsed so it never competes with the main dashboard
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const value: ProjectChatContextValue = {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    openMobile,
    closeMobile,
  };

  return (
    <ProjectChatContext.Provider value={value}>
      {children}
    </ProjectChatContext.Provider>
  );
}

export function useProjectChat(): ProjectChatContextValue {
  const ctx = useContext(ProjectChatContext);
  if (!ctx) {
    throw new Error("useProjectChat must be used within a ProjectChatProvider");
  }
  return ctx;
}

export function useOptionalProjectChat(): ProjectChatContextValue | undefined {
  return useContext(ProjectChatContext);
}
