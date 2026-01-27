export type NoteType =
  | "MOM"
  | "TASK_UPDATE"
  | "CLIENT_NOTE"
  | "INTERNAL_NOTE"
  | "GENERAL_NOTE";

export interface BaseNote {
  id: string;
  projectId: string;
  /**
   * Stored redundantly for faster display and to avoid repeated lookups.
   * Backend can always canonicalise using projectId.
   */
  projectName: string;
  /** ISO date string (YYYY-MM-DD) representing the operational date of the note. */
  noteDate: string;
  /** ISO timestamp when the note was created in the system. */
  createdAt: string;
  /** Display name of the author at the time of creation. */
  authorName: string;
  /** Short subject line shown in lists and headers. */
  subject: string;
  type: NoteType;
  body: string;
}

export interface MomNoteFields {
  meetingWith?: string;
  attendees?: string[];
  keyDiscussionPoints?: string;
  decisionsTaken?: string;
  actionItems?: string[];
}

export type TaskUpdateKind = "COMPLETED" | "BLOCKED" | "PROGRESS" | "INFO";

export interface TaskUpdateFields {
  relatedTaskId?: string;
  relatedTaskLabel?: string;
  updateType?: TaskUpdateKind;
  updateDetails?: string;
}

export type ClientSentiment = "NEUTRAL" | "CONCERN" | "POSITIVE";

export interface ClientNoteFields {
  clientName?: string;
  sentiment?: ClientSentiment;
  followUpRequired?: boolean;
}

export type InternalVisibility = "ONLY_ME" | "PROJECT_TEAM" | "MANAGEMENT";

export interface InternalNoteFields {
  visibility?: InternalVisibility;
  internalContext?: string;
}

export type Note = BaseNote & {
  momFields?: MomNoteFields;
  taskUpdateFields?: TaskUpdateFields;
  clientNoteFields?: ClientNoteFields;
  internalNoteFields?: InternalNoteFields;
};

export type NewNoteInput = Omit<
  Note,
  "id" | "createdAt" | "authorName"
> & {
  /**
   * Author is supplied by the caller (e.g. from AuthContext) to keep
   * NotesContext decoupled from auth.
   */
  authorName: string;
};
