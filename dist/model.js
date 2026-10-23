// Union types restrict tasks to the three supported states and priorities.
// This keeps invalid values out of normal TypeScript code.
export function addTask(tasks, title, priority = "medium", dueDate) {
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id), -1);
    const task = { id: maxId + 1, title, status: "todo", priority, ...(dueDate ? { dueDate } : {}) };
    return [...tasks, task];
}
export function advanceTask(tasks, id) {
    // Record requires a transition for every TaskStatus, catching missing states at compile time.
    const transitions = {
        todo: "in-progress",
        "in-progress": "done",
        done: "done"
    };
    return tasks.map((task) => task.id === id ? { ...task, status: transitions[task.status] } : task);
}
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
export function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
export function filterByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}
export function countByStatus(tasks, status) {
    return filterByStatus(tasks, status).length;
}
export function isTask(x) {
    if (typeof x !== "object" || x === null)
        return false;
    const candidate = x;
    const validStatus = candidate.status === "todo" || candidate.status === "in-progress" || candidate.status === "done";
    const validPriority = candidate.priority === "low" || candidate.priority === "medium" || candidate.priority === "high";
    const validDueDate = candidate.dueDate === undefined || typeof candidate.dueDate === "string";
    return typeof candidate.id === "number" && Number.isFinite(candidate.id)
        && typeof candidate.title === "string"
        && validStatus && validPriority && validDueDate;
}
