// src/services/task-service.js

import { getState, convertToArrayList } from './data-service.js';

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
 * @description Gets the details of assignees based on their contact IDs.
 * @export
 * @param {Array} contactIds - An array of contact IDs.
 * @return {Array} An array of assignee objects.
 */
export function resolveMemberDetails(contactIds) {
    if (!contactIds || !Array.isArray(contactIds)) return [];

    const state = getState();
    const team = state.team || {};

    return contactIds
        .map(id => team[id])
        .filter(member => !!member && member.name);
}