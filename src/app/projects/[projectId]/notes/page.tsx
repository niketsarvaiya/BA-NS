"use client";

import { useParams } from "next/navigation";
import { useNotes } from "@/modules/notes/context/NotesContext";
import { NotesList } from "@/modules/notes/components/NotesList";
import { getProjectById } from "@/modules/projects/utils/mockData";

export default function ProjectNotesTabPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { notes } = useNotes();
  const project = getProjectById(projectId);

  const projectNotes = notes.filter((note) => note.projectId === projectId);

  return (
    <NotesList
      notes={projectNotes}
      title="Project Notes"
      subtitle={
        project
          ? `Notes, MOMs, and internal context for ${project.name}.`
          : "Notes linked to this project."
      }
    />
  );
}
