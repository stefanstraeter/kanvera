// src/services/data-service.js

import { fetchData } from './firebase-service.js';
import { DATA_CACHE_KEY, GUEST_LOGIN_DATA } from '../utils/constants.js';
import { getCurrentUser } from './auth-service.js';


/* ==========================================================================
   STATE MANAGEMENT 
   ========================================================================== */
let state = { tasks: {}, team: {}, users: {} };
export const getState = () => state;

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

/* ==========================================================================
    DATA REFRESH 
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
   CACHE MANAGEMENT
   ========================================================================== */
/**
* @description Saves the current state to session storage.
* @export
*/
export function saveToCache() {
    sessionStorage.setItem(DATA_CACHE_KEY, JSON.stringify(state));
}

/* ==========================================================================
   INTERNAL UTILS & HELPERS
   ========================================================================== */
/**
 * @description Converts a Firebase object into an array of objects.
 * @param {Object} firebaseObject - The Firebase object to convert.
 * @return {Array} - An array of objects.
 */
export function convertToArrayList(firebaseObject) {
    if (!firebaseObject) return [];

    return Object.keys(firebaseObject).map(id => ({
        id,
        ...firebaseObject[id]
    }));
}



