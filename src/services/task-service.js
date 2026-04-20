// src/services/task-service.js

import { getState, convertToArrayList, saveToCache } from './data-service.js';

/* ==========================================================================
   TASKS SERVICE 
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
    const allTasks = getAllTasks();
    return allTasks.filter(task => task.category === category);
}

/**
 * @description Updates the category of a task and marks all subtasks as done if the new category is "done".
 * @export
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newCategory - The new category to assign to the task.
 * @return {Promise<void>} 
 */
export async function updateTaskCategory(taskId, newCategory) {
    const state = getState();
    const task = state.tasks[taskId];

    if (!task) return;

    task.category = newCategory;

    if (newCategory === 'done' && task.subtasks) {
        task.subtasks.forEach(st => st.done = true);
    }
    saveToCache();
}

/**
 * @description Gets the details of assignees based on their contact IDs.
 * @export
 * @param {Array<string>} contactIds - An array of contact IDs.
 * @return {Array<Object>} An array of assignee objects.
 */
export function resolveMemberDetails(contactIds) {
    if (!contactIds || !Array.isArray(contactIds)) return [];

    const state = getState();
    const team = state.team || {};

    return contactIds
        .map(id => team[id])
        .filter(member => !!member && member.name);
}