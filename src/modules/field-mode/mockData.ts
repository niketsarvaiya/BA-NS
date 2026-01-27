"use client";

import { MOCK_PROJECTS } from "@/modules/projects/utils/mockData";
import { generateTasksFromBOQ } from "@/modules/tasks/generators/generateTasksFromBOQ";
import { taskTemplates } from "@/modules/tasks/templates/taskTemplates";
import { MOCK_BOQ_ITEMS, MOCK_ROOMS } from "@/modules/projects/utils/mockBOQData";
import type { FieldSite, FieldTask } from "./types";

// Treat projects as sites for Field Mode mock data
export const FIELD_SITES: FieldSite[] = MOCK_PROJECTS.map((p) => ({
  siteId: p.id,
  name: p.name,
  code: p.code,
  clientName: p.clientName,
  location: p.location,
}));

// For now, generate tasks only for the primary demo site proj-001
const PRIMARY_SITE_ID = "proj-001";

export function generateFieldTasksForSite(siteId: string): FieldTask[] {
  const projectId = siteId;

  const baseTasks = generateTasksFromBOQ({
    projectId,
    boqItems: MOCK_BOQ_ITEMS,
    rooms: MOCK_ROOMS,
    taskTemplates,
  });

  return baseTasks.map((task) => ({
    base: task,
    siteId,
    photos: [],
    flag: { isFlagged: false },
    block: { isBlocked: task.status === "BLOCKED", reason: task.blockerReason },
  }));
}

export function getInitialFieldTasks(): FieldTask[] {
  return generateFieldTasksForSite(PRIMARY_SITE_ID);
}
