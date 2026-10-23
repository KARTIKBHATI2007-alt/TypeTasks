export type TaskStatus = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
}

// Union types restrict tasks to the three supported states and priorities.
// This keeps invalid values out of normal TypeScript code.
export function addTask(tasks: Task[], title: string, priority: Priority = "medium", dueDate?: string): Task[] {
  const maxId: number = tasks.reduce((max: number, task: Task) => Math.max(max, task.id), -1);
  const task: Task = { id: maxId + 1, title, status: "todo", priority, ...(dueDate ? { dueDate } : {}) };
  return [...tasks, task];
}

export function advanceTask(tasks: Task[], id: number): Task[] {
  // Record requires a transition for every TaskStatus, catching missing states at compile time.
  const transitions: Record<TaskStatus, TaskStatus> = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done"
  };
  return tasks.map((task: Task): Task => task.id === id ? { ...task, status: transitions[task.status] } : task);
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task: Task): Task => task.id === id ? { ...task, status: "done" } : task);
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task: Task): boolean => task.id !== id);
}

export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task: Task): boolean => task.status === status);
}

export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return filterByStatus(tasks, status).length;
}

export function isTask(x: unknown): x is Task {
  if (typeof x !== "object" || x === null) return false;
  const candidate = x as Record<string, unknown>;
  const validStatus: boolean = candidate.status === "todo" || candidate.status === "in-progress" || candidate.status === "done";
  const validPriority: boolean = candidate.priority === "low" || candidate.priority === "medium" || candidate.priority === "high";
  const validDueDate: boolean = candidate.dueDate === undefined || typeof candidate.dueDate === "string";
  return typeof candidate.id === "number" && Number.isFinite(candidate.id)
    && typeof candidate.title === "string"
    && validStatus && validPriority && validDueDate;
}

