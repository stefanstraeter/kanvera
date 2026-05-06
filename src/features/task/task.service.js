import { getState, convertToArrayList, saveToCache } from '../../core/state.js';

/* ==========================================================================
   SORTING HELPERS FOR TASKS
   ========================================================================== */

const sortByPosition = (a, b) => a.id.localeCompare(b.id);
const sortByUpdatedDate = (a, b) => (a.updatedAt || 0) - (b.updatedAt || 0);

/* ==========================================================================
   TASKS SERVICE READ
   ========================================================================== */

/**
 * @description Returns an array of all tasks in the current state.
 * @export
 * @return {Array} An array of task objects.
 */
export function getAllTasks() {
    const state = getState();

    return convertToArrayList(state.tasks);
}

/**
 * @description Gets all tasks that belong to a specific category by filtering and sorting.
 * @export
 * @param {string} category - The category of tasks to retrieve.
 * @return {Array} An array of task objects that belong to the specified category.
 */
export function getTasksByCategory(category) {
    const allTasks = convertToArrayList(getState().tasks);

    return allTasks
        .filter(task => task.category === category)
        .sort(sortByPosition);
}

/**
 * @description Gets the details of a task based on its ID.
 * @export
 * @param {string} taskId - The ID of the task to retrieve.
 * @return {Object|null} The task object if found, otherwise null.
 */
export function getTaskById(taskId) {
    const state = getState();

    return state.tasks[taskId] || null;
}

/**
 * @description Gets the details of assignees based on their member IDs.
 * @export
 * @param {Array<string>} memberIds - An array of member IDs.
 * @return {Array<Object>} An array of assignee objects.
 */
export function resolveMemberDetails(memberIds) {
    if (!memberIds || !Array.isArray(memberIds)) return [];

    const state = getState();
    const team = state.team || {};

    return memberIds
        .map(id => team[id])
        .filter(member => !!member && member.name);
}

/* ==========================================================================
   TASKS SERVICE WRITE
   ========================================================================== */

/**
 * @description Updates the category of a task and marks all subtasks as done if the new category is "done".
 * @export
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newCategory - The new category to assign to the task.
 * @return {void}
 */
export function updateTaskCategory(taskId, newCategory) {
    const state = getState();
    const task = state.tasks[taskId];

    if (!task) return;

    task.category = newCategory;
    task.updatedAt = Date.now();

    if (newCategory === 'done' && task.subtasks) {
        task.subtasks.forEach(st => st.done = true);
    }
    saveToCache();
}

/**
 * @description Updates the details of a task with the provided updated data.
 * @export
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedData - The updated data for the task.
 * @return {void}
 */
export function updateTaskLocally(taskId, updatedData) {
    const state = getState();
    const currentTask = state.tasks[taskId];

    if (!currentTask) return;

    state.tasks[taskId] = {
        ...currentTask,
        ...updatedData
    };
    saveToCache();
}

/**
 * @description Deletes a task from the local state and syncs with cache.
 * @export
 * @param {string} taskId - ID of the task to delete
 */
export function deleteTaskLocally(taskId) {
    const state = getState();

    if (state.tasks[taskId]) {
        delete state.tasks[taskId];
        saveToCache();
    }
}

/* ==========================================================================
   SUBTASKS SERVICE
   ========================================================================== */

/**
 * @description Adds a new subtask to a task. 
 * @export
 * @param {string} taskId - The ID of the task to which the subtask will be added.
 * @param {string} [title=""] - The title of the new subtask.
 * @return {void}
 */
export function addSubtask(taskId, title = "") {
    const state = getState();
    const task = state.tasks[taskId];

    if (!task) return;

    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push({ title, done: false });
    saveToCache();
}

/**
 * @description Removes a subtask from a task.
 * @export
 * @param {string} taskId - The ID of the task from which the subtask will be removed.
 * @param {number} index - The index of the subtask to remove.
 * @return {void}
 */
export function removeSubtask(taskId, index) {
    const state = getState();
    const task = state.tasks[taskId];

    if (!task || !task.subtasks) return;

    task.subtasks.splice(index, 1);
    saveToCache();
}

/**
 * @description Updates the title of a subtask.
 * @export
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} index - The index of the subtask to update.
 * @param {string} newTitle - The new title for the subtask.
 * @return {void}
 */
export function updateSubtaskTitle(taskId, index, newTitle) {
    const state = getState();
    const task = state.tasks[taskId];

    if (!task || !task.subtasks[index]) return;

    task.subtasks[index].title = newTitle;
    saveToCache();
}