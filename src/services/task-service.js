// src/services/task-service.js

import { getState, convertToArrayList, saveToCache } from './data-service.js';


const sortByPosition = (a, b) => {
    return a.id.localeCompare(b.id);
};

/* ==========================================================================
   COMMON HELPERS
   ========================================================================== */
/**
 * @description Sorts tasks by their updated date in ascending order. 
 * @param {Object} a - The first task object to compare.
 * @param {Object} b - The second task object to compare.
 * @return {number} A negative number if a should come before b, a positive number if a should come after b, or 0 if they are equal.
 */
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
 * @description Gets all tasks that belong to a specific category (e.g., "to do", "in progress", "await feedback", "done") by filtering the list of all tasks based on their category property.
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

/* ==========================================================================
   TASKS SERVICE WRITE
   ========================================================================== */
/**
 * @description Updates the category of a task and marks all subtasks as done if the new category is "done".
 * @export
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newCategory - The new category to assign to the task.
 * @return {Promise<void>} A promise that resolves when the task category has been updated.
 */
export async function updateTaskCategory(taskId, newCategory) {
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

/* ==========================================================================
   MEMBER DETAILS 
   ========================================================================== */
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

