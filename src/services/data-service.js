// src/services/data-service.js

import { fetchData } from './firebase-service.js';
import { DATA_CACHE_KEY, GUEST_LOGIN_DATA } from '../utils/constants.js';
import { getCurrentUser } from './auth-logic.js';

let state = { tasks: {}, team: {}, users: {} };

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
 * @description Gibt alle Tasks als Array zurück.
 */
export function getAllTasks() {
    return convertToArrayList(state.tasks);
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
   TEAM MEMBERS - PUBLIC API & LOCAL UPDATES
   ========================================================================== */
/**
 * @description Get a list of all team members, including the current user if they are not already in the team list. 
 * @export
 * @return {Array} - An array of team members.
 */
export function getAllTeamMembers() {
    let members = convertToArrayList(state.team);
    const currentUser = getCurrentUser();

    if (!currentUser) return members;

    const isAlreadyInList = members.some(m => m.email === currentUser.email);

    if (!isAlreadyInList) {
        members.push(createVirtualMember(currentUser));
    }
    return members;
}

/**
 * @description Creates a virtual team member based on the current user.
 * @param {Object} user - The current user object.
 * @return {Object} - A virtual team member object.
 */
function createVirtualMember(user) {
    return {
        id: user.id || "guest-id",
        name: user.name,
        email: user.email,
        roles: user.isGuest ? ["@guest"] : ["@team member"],
        imageUrl: "",
        phone: user.isGuest ? "demo mode" : "no phone",
        isMe: true
    };
}

/**
 * @description Updates a team member's data locally in the state and cache. If the member does not exist, it will be created.
 * @export
 * @param {string} id - The ID of the member.
 * @param {Object} newData - The new data (e.g., {name, roles}).
 */
export function updateMemberLocally(id, newData) {
    if (state.team && state.team[id]) {
        state.team[id] = { ...state.team[id], ...newData };
    } else {
        state.team[id] = { id, ...newData };
    }
    saveToCache();
}

/**
 * @description Deletes a team member locally from the state and cache.
 * @export
 * @param {string} id - The ID of the member.
 * @return {void}
 */
export function deleteMemberLocally(id) {
    if (state.team && state.team[id]) {
        delete state.team[id];
    }
    saveToCache();
}


/* ==========================================================================
   INTERNAL UTILS & HELPERS
   ========================================================================== */
/**
 * @description Converts a Firebase object into an array of objects.
 * @param {Object} firebaseObject - The Firebase object to convert.
 * @return {Array} - An array of objects.
 */
function convertToArrayList(firebaseObject) {
    if (!firebaseObject) return [];
    return Object.keys(firebaseObject).map(id => ({
        id,
        ...firebaseObject[id]
    }));
}


/**
* @description Saves the current state to session storage.
*/
function saveToCache() {
    sessionStorage.setItem(DATA_CACHE_KEY, JSON.stringify(state));
}

/* ==========================================================================
    INITIALIZATION
   ========================================================================== */
/**
 * @description Initializes the data service by loading cached data or fetching fresh data if no cache exists.
 * @export
 */
export async function initDataService() {
    const cached = sessionStorage.getItem(DATA_CACHE_KEY);

    if (cached) {
        state = JSON.parse(cached);
    } else {
        await refreshAllData();
    }
}
