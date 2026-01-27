"use client";

import { useState } from "react";
import {
  Plus,
  StickyNote,
  Users,
  ListChecks,
  User,
  Shield,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";
import type {
  ClientSentiment,
  InternalVisibility,
  NewNoteInput,
  NoteType,
  TaskUpdateKind,
} from "../types";
import { MOCK_PROJECTS } from "@/modules/projects/utils/mockData";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MOCK_TASK_OPTIONS = [
  { id: "task-001", label: "Install living room keypads" },
  { id: "task-002", label: "Program master bedroom scenes" },
  { id: "task-003", label: "QC check for rack wiring" },
];

interface NoteComposerPanelProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function GlobalNoteComposer() {
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSaved = () => {
    setOpen(false);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      {/* Floating Add Note button - visible on all AppShell pages */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              onClick={() => setOpen(true)}
              className="fixed bottom-6 right-6 lg:right-[360px] z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
              aria-label="Add Note"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Add Note</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <NoteComposerPanel open={open} onClose={() => setOpen(false)} onSaved={handleSaved} />

      {showToast && (
        <div className="fixed bottom-6 right-6 lg:right-[360px] z-40 rounded-full border border-zinc-300 bg-zinc-900/90 px-4 py-2 text-sm text-zinc-50 shadow-lg dark:border-zinc-700">
          Note added to project
        </div>
      )}
    </>
  );
}

function NoteComposerPanel({ open, onClose, onSaved }: NoteComposerPanelProps) {
  const { addNote } = useNotes();
  const { user } = useAuth();

  const [projectId, setProjectId] = useState<string>("");
  const [noteDate, setNoteDate] = useState<string>(() =>
    new Date().toISOString().split("T")[0]
  );
  const [subject, setSubject] = useState<string>("");
  const [type, setType] = useState<NoteType>("GENERAL_NOTE");
  const [body, setBody] = useState<string>("");

  // MOM
  const [meetingWith, setMeetingWith] = useState("");
  const [attendeeInput, setAttendeeInput] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [keyDiscussionPoints, setKeyDiscussionPoints] = useState("");
  const [decisionsTaken, setDecisionsTaken] = useState("");
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [newActionItem, setNewActionItem] = useState("");

  // Task Update
  const [relatedTaskId, setRelatedTaskId] = useState<string>("");
  const [relatedTaskLabel, setRelatedTaskLabel] = useState<string>("");
  const [updateType, setUpdateType] = useState<TaskUpdateKind | undefined>();
  const [updateDetails, setUpdateDetails] = useState("");

  // Client Note
  const [clientName, setClientName] = useState("");
  const [sentiment, setSentiment] = useState<ClientSentiment | undefined>();
  const [followUpRequired, setFollowUpRequired] = useState<boolean | undefined>();

  // Internal Note
  const [visibility, setVisibility] = useState<InternalVisibility | undefined>();
  const [internalContext, setInternalContext] = useState("");

  const resetForm = () => {
    setProjectId("");
    setNoteDate(new Date().toISOString().split("T")[0]);
    setSubject("");
    setType("GENERAL_NOTE");
    setBody("");
    setMeetingWith("");
    setAttendeeInput("");
    setAttendees([]);
    setKeyDiscussionPoints("");
    setDecisionsTaken("");
    setActionItems([]);
    setNewActionItem("");
    setRelatedTaskId("");
    setRelatedTaskLabel("");
    setUpdateType(undefined);
    setUpdateDetails("");
    setClientName("");
    setSentiment(undefined);
    setFollowUpRequired(undefined);
    setVisibility(undefined);
    setInternalContext("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddAttendee = () => {
    const value = attendeeInput.trim();
    if (!value) return;
    setAttendees((prev) =>
      prev.includes(value) ? prev : [...prev, value]
    );
    setAttendeeInput("");
  };

  const handleAttendeeKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAddAttendee();
    }
  };

  const handleAddActionItem = () => {
    const value = newActionItem.trim();
    if (!value) return;
    setActionItems((prev) => [...prev, value]);
    setNewActionItem("");
  };

  const handleSave = () => {
    if (!projectId) return;

    const project = MOCK_PROJECTS.find((p) => p.id === projectId);
    const authorName = user?.name || "You";

    const base: NewNoteInput = {
      projectId,
      projectName: project?.name ?? projectId,
      noteDate,
      subject,
      type,
      body,
      authorName,
      momFields: undefined,
      taskUpdateFields: undefined,
      clientNoteFields: undefined,
      internalNoteFields: undefined,
    };

    if (type === "MOM") {
      base.momFields = {
        meetingWith: meetingWith || undefined,
        attendees: attendees.length ? attendees : undefined,
        keyDiscussionPoints: keyDiscussionPoints || undefined,
        decisionsTaken: decisionsTaken || undefined,
        actionItems: actionItems.length ? actionItems : undefined,
      };
    }

    if (type === "TASK_UPDATE") {
      base.taskUpdateFields = {
        relatedTaskId: relatedTaskId || undefined,
        relatedTaskLabel: relatedTaskLabel || undefined,
        updateType,
        updateDetails: updateDetails || undefined,
      };
    }

    if (type === "CLIENT_NOTE") {
      base.clientNoteFields = {
        clientName: clientName || undefined,
        sentiment,
        followUpRequired,
      };
    }

    if (type === "INTERNAL_NOTE") {
      base.internalNoteFields = {
        visibility,
        internalContext: internalContext || undefined,
      };
    }

    addNote(base);
    resetForm();
    onSaved();
  };

  if (!open) return null;

  return (
    <DetailPanel
      isOpen={open}
      onClose={handleClose}
      title="New Note"
      subtitle="Capture context and attach it to a project"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900/90 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
          <StickyNote className="h-5 w-5" />
        </div>
      }
      width="lg"
      className="top-16"
    >
      <div className="space-y-6">
        {/* Project (TO) & Note Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Project (To)</Label>
            <Select
              value={projectId}
              onValueChange={(value) => setProjectId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PROJECTS.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Note Date</Label>
            <Input
              type="date"
              value={noteDate}
              onChange={(e) => setNoteDate(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              Created on: {new Date().toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Subject & Note Type */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-4 items-end">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short subject (optional)"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Note Type</Label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: "MOM", label: "MOM" },
                    { id: "TASK_UPDATE", label: "Task Update" },
                    { id: "CLIENT_NOTE", label: "Client" },
                    { id: "INTERNAL_NOTE", label: "Internal" },
                    { id: "GENERAL_NOTE", label: "General" },
                  ] as { id: NoteType; label: string }[]
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setType(option.id)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                      type === option.id
                        ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                    }`}
                  >
                    {option.id === "MOM" && (
                      <Users className="h-3.5 w-3.5" />
                    )}
                    {option.id === "TASK_UPDATE" && (
                      <ListChecks className="h-3.5 w-3.5" />
                    )}
                    {option.id === "CLIENT_NOTE" && (
                      <User className="h-3.5 w-3.5" />
                    )}
                    {option.id === "INTERNAL_NOTE" && (
                      <Shield className="h-3.5 w-3.5" />
                    )}
                    {option.id === "GENERAL_NOTE" && (
                      <StickyNote className="h-3.5 w-3.5" />
                    )}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conditional fields */}
        {type === "MOM" && (
          <DetailPanelSection title="Minutes of Meeting">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Meeting With</Label>
                <Input
                  value={meetingWith}
                  onChange={(e) => setMeetingWith(e.target.value)}
                  placeholder="Who was this meeting with?"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Attendees</Label>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {attendees.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-900/90 px-2 py-0.5 text-[11px] text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() =>
                          setAttendees((prev) => prev.filter((a) => a !== name))
                        }
                        className="ml-0.5 text-[10px] opacity-70 hover:opacity-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyDown={handleAttendeeKeyDown}
                  placeholder="Type a name and press Enter"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Key Discussion Points</Label>
                <Textarea
                  value={keyDiscussionPoints}
                  onChange={(e) => setKeyDiscussionPoints(e.target.value)}
                  placeholder="What did you cover?"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Decisions Taken</Label>
                <Textarea
                  value={decisionsTaken}
                  onChange={(e) => setDecisionsTaken(e.target.value)}
                  placeholder="What was decided?"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Action Items</Label>
                <div className="space-y-2">
                  {actionItems.length > 0 && (
                    <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between gap-2">
                          <span className="flex-1 truncate">{item}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setActionItems((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-[11px] text-zinc-400 hover:text-zinc-200"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={newActionItem}
                      onChange={(e) => setNewActionItem(e.target.value)}
                      placeholder="Add action item"
                    />
                    <Button type="button" size="sm" onClick={handleAddActionItem}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DetailPanelSection>
        )}

        {type === "TASK_UPDATE" && (
          <DetailPanelSection title="Task Update">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Related Task</Label>
                <Select
                  value={relatedTaskId}
                  onValueChange={(value) => {
                    setRelatedTaskId(value);
                    const option = MOCK_TASK_OPTIONS.find((t) => t.id === value);
                    setRelatedTaskLabel(option?.label ?? "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select task (mock list)" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TASK_OPTIONS.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Update Type</Label>
                <Select
                  value={updateType ?? ""}
                  onValueChange={(value) =>
                    setUpdateType(value as TaskUpdateKind)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select update type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="PROGRESS">Progress</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Update Details</Label>
                <Textarea
                  value={updateDetails}
                  onChange={(e) => setUpdateDetails(e.target.value)}
                  placeholder="What changed? Any blockers?"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </DetailPanelSection>
        )}

        {type === "CLIENT_NOTE" && (
          <DetailPanelSection title="Client Note">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Client Name</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Which client is this about?"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Sentiment</Label>
                <Select
                  value={sentiment ?? ""}
                  onValueChange={(value) =>
                    setSentiment(value as ClientSentiment)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    <SelectItem value="CONCERN">Concern</SelectItem>
                    <SelectItem value="POSITIVE">Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Follow-up Required?</Label>
                <Select
                  value={
                    typeof followUpRequired === "boolean"
                      ? followUpRequired
                        ? "yes"
                        : "no"
                      : ""
                  }
                  onValueChange={(value) =>
                    setFollowUpRequired(value === "yes")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DetailPanelSection>
        )}

        {type === "INTERNAL_NOTE" && (
          <DetailPanelSection title="Internal Note">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Visibility</Label>
                <Select
                  value={visibility ?? ""}
                  onValueChange={(value) =>
                    setVisibility(value as InternalVisibility)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who can see this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONLY_ME">Only Me</SelectItem>
                    <SelectItem value="PROJECT_TEAM">Project Team</SelectItem>
                    <SelectItem value="MANAGEMENT">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Internal Context</Label>
                <Textarea
                  value={internalContext}
                  onChange={(e) => setInternalContext(e.target.value)}
                  placeholder="Backstory, constraints, or anything that helps your team."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </DetailPanelSection>
        )}

        {/* Note body */}
        <div className="space-y-1.5">
          <Label>Note Body</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[160px] text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-full px-4"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!projectId}
            className="rounded-full px-5"
          >
            Save Note
          </Button>
        </div>
      </div>
    </DetailPanel>
  );
}
