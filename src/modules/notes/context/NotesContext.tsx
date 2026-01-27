"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import type { NewNoteInput, Note } from "../types";
import { MOCK_NOTES } from "../utils/mockNotesData";

interface NotesContextValue {
  notes: Note[];
  addNote: (input: NewNoteInput) => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => MOCK_NOTES);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      addNote: (input: NewNoteInput) => {
        const now = new Date();
        const newNote: Note = {
          ...input,
          id: `note-${Date.now()}`,
          createdAt: now.toISOString(),
        };
        setNotes((prev) => [newNote, ...prev]);
      },
    }),
    [notes]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return ctx;
}
