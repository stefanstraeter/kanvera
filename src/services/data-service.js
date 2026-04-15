// src/services/data-service.js

import { fetchData } from './firebase-service.js';

const STORE_KEY = "kanvera_data";

let state = {
    tasks: {},
    team: {},
    users: {}
};

/* ==========================================================================
   DATA MANAGEMENT - PUBLIC API
   ========================================================================== */
/**
 * @description Fetches the latest data for tasks, team, and users from the backend and updates the state and cache.
 * @export
 */
export async function refreshAllData() {
    const [tasks, team, users] = await Promise.all([
        fetchData("tasks"),
        fetchData("team"),
        fetchData("users")
    ]);

    state.tasks = tasks || {};
    state.team = team || {};
    state.users = users || {};

    saveToCache();
}

/* ==========================================================================
   TASKS & PULSE STATS - PUBLIC API
   ========================================================================== */
/**
 * @description Returns an array of all tasks with their IDs included in the task objects.
 * @export
 * @return {Array<Object>} An array of task objects with their IDs included
 */
export function getAllTasks() {
    return Object.keys(state.tasks).map(id => ({
        id,
        ...state.tasks[id]
    }));
}

/**
 * @description Returns the statistics for the Pulse page based on the current tasks.
 * @export
 * @return {Object} An object containing the task statistics
 */
export function getPulseStats() {
    const tasks = getAllTasks();
    return {
        total: tasks.length,
        todo: tasks.filter(task => task.category === 'to do').length,
        doing: tasks.filter(task => task.category === 'in progress').length,
        await: tasks.filter(task => task.category === 'await feedback').length,
        done: tasks.filter(task => task.category === 'done').length,
        urgent: tasks.filter(task => task.priority === 'urgent').length,
        nextDeadline: tasks
            .filter(task => task.priority === 'urgent' && task.dueDate)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || null
    };
}

/* ==========================================================================
   TEAM MEMBERS - PUBLIC API
   ========================================================================== */
/**
 * @description Returns an array of all team members with their IDs included in the team member objects.
 * @export
 * @return {Array<Object>} An array of team member objects with their IDs included
 */
export function getAllTeamMembers() {
    return Object.keys(state.team).map(id => ({
        id,
        ...state.team[id]
    }));
}

/* ==========================================================================
   INTERNAL UTILS - LOCAL ONLY
   ========================================================================== */
/**
* @description Saves the current state to session storage for caching purposes.
*/
function saveToCache() {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(state));
}

/* ==========================================================================
    INITIALIZATION
   ========================================================================== */
/**
 * @description Initializes the data service by loading cached data or fetching fresh data if no cache exists.
 * @export
 */
export async function initDataService() {
    const cached = sessionStorage.getItem(STORE_KEY);

    if (cached) {
        state = JSON.parse(cached);
    } else {
        await refreshAllData();
    }
}