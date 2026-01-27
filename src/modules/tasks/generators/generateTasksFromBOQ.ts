import type { ProjectTask, TaskTemplate } from "../types";
import type { BOQItem } from "@/modules/projects/types/boq";
import type { Room } from "@/modules/projects/types/boq";
import { systemTasks } from "../templates/taskTemplates";

/**
 * Task Generation Engine
 *
 * ⚠️ BACKEND NOTE:
 * This function is pure and deterministic. When integrating with backend:
 * 1. Move this logic to backend API endpoint
 * 2. Replace taskTemplates parameter with database query
 * 3. Persist generated tasks to database
 * 4. Return persisted tasks to frontend
 *
 * The function signature and logic should remain identical.
 */

interface GenerateTasksParams {
  projectId: string;
  boqItems: BOQItem[];
  rooms: Room[];
  taskTemplates: TaskTemplate[];
}

export function generateTasksFromBOQ({
  projectId,
  boqItems,
  rooms,
  taskTemplates,
}: GenerateTasksParams): ProjectTask[] {
  const tasks: ProjectTask[] = [];
  const now = new Date().toISOString();

  // Generate system-level tasks
  systemTasks.forEach((template, index) => {
    tasks.push({
      id: `task-system-${index + 1}`,
      projectId,
      taskTemplateId: template.id,
      boqItemId: undefined,
      roomId: undefined,
      title: template.title,
      description: template.description,
      stakeholder: template.stakeholder,
      status: "NOT_STARTED",
      priority: template.priority || "HIGH",
      dueDate: undefined,
      blockerReason: undefined,
      createdFrom: "TEMPLATE",
      createdAt: now,
      updatedAt: now,
    });
  });

  // Generate BOQ-item-based tasks
  boqItems.forEach((boqItem) => {
    // Find matching templates for this BOQ item
    const matchingTemplates = taskTemplates.filter((template) => {
      // Match by category
      const categoryMatch = template.productCategory === boqItem.category;

      // If template has subcategory, match it too
      if (template.productSubCategory) {
        // Note: BOQ items don't have subCategory field yet, so this is future-proof
        return categoryMatch; // For now, just match category
      }

      return categoryMatch;
    });

    // Generate tasks for each matching template
    matchingTemplates.forEach((template) => {
      const taskId = `task-${boqItem.id}-${template.id}`;

      tasks.push({
        id: taskId,
        projectId,
        taskTemplateId: template.id,
        boqItemId: boqItem.id,
        roomId: undefined, // Room allocation happens in BOQ module
        title: `${template.title} - ${boqItem.name}`,
        description: template.description,
        stakeholder: template.stakeholder,
        status: "NOT_STARTED",
        priority: template.priority || "MEDIUM",
        dueDate: undefined,
        blockerReason: undefined,
        createdFrom: "TEMPLATE",
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  return tasks;
}

/**
 * Helper: Create a manual task
 *
 * ⚠️ BACKEND NOTE:
 * When integrating with backend, this becomes a POST /api/tasks endpoint
 */
export function createManualTask(
  projectId: string,
  taskData: Partial<ProjectTask>
): ProjectTask {
  const now = new Date().toISOString();

  return {
    id: `task-manual-${Date.now()}`,
    projectId,
    taskTemplateId: undefined,
    boqItemId: taskData.boqItemId,
    roomId: taskData.roomId,
    title: taskData.title || "Untitled Task",
    description: taskData.description,
    stakeholder: taskData.stakeholder || "SITE_SUPERVISOR",
    status: "NOT_STARTED",
    priority: taskData.priority || "MEDIUM",
    dueDate: taskData.dueDate,
    blockerReason: undefined,
    createdFrom: "MANUAL",
    createdAt: now,
    updatedAt: now,
  };
}
