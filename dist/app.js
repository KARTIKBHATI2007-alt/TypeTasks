import { addTask, countByStatus, deleteTask, advanceTask, isTask } from "./model.js";
const STORAGE_KEY = "typetasks";
const statuses = ["todo", "in-progress", "done"];
let tasks = loadTasks();
let activeFilter = "all";
function requiredElement(selector) {
    const element = document.querySelector(selector);
    if (!element)
        throw new Error(`Missing required element: ${selector}`);
    return element;
}
const form = requiredElement("#task-form");
const titleInput = requiredElement("#title");
const priorityInput = requiredElement("#priority");
const dueDateInput = requiredElement("#due-date");
const list = requiredElement("#task-list");
const emptyState = requiredElement("#empty-state");
const filterContainer = requiredElement("#filters");
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isTask) : [];
    }
    catch {
        return [];
    }
}
function saveAndRender() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    render();
}
function visibleTasks() {
    return activeFilter === "all" ? tasks : tasks.filter((task) => task.status === activeFilter);
}
function renderFilters() {
    filterContainer.replaceChildren();
    const filters = ["all", ...statuses];
    for (const status of filters) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-chip";
        button.setAttribute("aria-pressed", String(activeFilter === status));
        const count = status === "all" ? tasks.length : countByStatus(tasks, status);
        button.textContent = `${status} (${count})`;
        button.addEventListener("click", () => { activeFilter = status; render(); });
        filterContainer.append(button);
    }
}
function render() {
    renderFilters();
    list.replaceChildren();
    const shown = visibleTasks();
    emptyState.hidden = shown.length > 0;
    for (const task of shown) {
        const item = document.createElement("li");
        item.className = `task-item priority-${task.priority}${task.status === "done" ? " is-done" : ""}`;
        if (task.dueDate && task.dueDate < new Date().toISOString().slice(0, 10) && task.status !== "done") {
            item.classList.add("is-overdue");
        }
        const content = document.createElement("div");
        content.className = "task-content";
        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;
        const meta = document.createElement("div");
        meta.className = "task-meta";
        const status = document.createElement("span");
        status.className = "status-label";
        status.textContent = task.status;
        const priority = document.createElement("span");
        priority.className = "priority-label";
        priority.textContent = `${task.priority} priority`;
        meta.append(status, priority);
        if (task.dueDate) {
            const dueDate = document.createElement("span");
            dueDate.className = "due-date";
            dueDate.textContent = task.dueDate;
            meta.append(dueDate);
        }
        if (item.classList.contains("is-overdue")) {
            const overdue = document.createElement("span");
            overdue.className = "overdue-label";
            overdue.textContent = "overdue";
            meta.append(overdue);
        }
        content.append(title, meta);
        const actions = document.createElement("div");
        actions.className = "task-actions";
        const advance = document.createElement("button");
        advance.type = "button";
        advance.className = "advance-button";
        advance.textContent = "advance →";
        advance.disabled = task.status === "done";
        advance.setAttribute("aria-label", `Advance ${task.title}`);
        advance.addEventListener("click", () => { tasks = advanceTask(tasks, task.id); saveAndRender(); });
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "delete-button";
        remove.textContent = "✕";
        remove.setAttribute("aria-label", `Delete ${task.title}`);
        remove.addEventListener("click", () => { tasks = deleteTask(tasks, task.id); saveAndRender(); });
        actions.append(advance, remove);
        item.append(content, actions);
        list.append(item);
    }
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
        titleInput.setCustomValidity("Please enter a task title.");
        titleInput.reportValidity();
        return;
    }
    titleInput.setCustomValidity("");
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value || undefined;
    tasks = addTask(tasks, title, priority, dueDate);
    form.reset();
    titleInput.focus();
    saveAndRender();
});
titleInput.addEventListener("input", () => titleInput.setCustomValidity(""));
render();
