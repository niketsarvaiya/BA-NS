"use client";

import { useNotes } from "@/modules/notes/context/NotesContext";
import { NotesList } from "@/modules/notes/components/NotesList";

export default function ProjectsNotesPage() {
  const { notes } = useNotes();

  return (
    <NotesList
      notes={notes}
      title="Notes"
      subtitle="All project notes in one place, grouped by date. Use the Add Note button to capture new context from anywhere."
    />
  );
}
