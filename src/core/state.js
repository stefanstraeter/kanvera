
import { fetchData } from './firebase.config.js';
import { DATA_CACHE_KEY } from '../shared/utils/constants.js';

/* ==========================================================================
    STATE STORE
    ========================================================================== */

let state = { tasks: {}, team: {}, users: {} };

/**
 * Returns the current in-memory app state.
 * @export
 * @return {Object} State object with tasks, team, and users.
 */
export const getState = () => state;

/* ==========================================================================
     INITIALIZATION
     ========================================================================== */

/**
 * @description Initializes the data service by loading cached data or fetching fresh data if no cache exists.
 * @export
 */
export async function initState() {
    const cached = safeSessionGetItem(DATA_CACHE_KEY);

    if (cached) {
        try {
            state = JSON.parse(cached);
        } catch (error) {
            state = { tasks: {}, team: {}, users: {} };
            await refreshAllData();
        }
    } else {
        await refreshAllData();
    }
}

/* ==========================================================================
    DATA LOADING
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
    CACHE & NOTIFICATION
    ========================================================================== */

/**
 * @description Saves the current state to session storage and notifies listeners.
 * @export
 */
export function saveToCache() {
    safeSessionSetItem(DATA_CACHE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('kanvera:state-changed'));
}

/* ==========================================================================
    UTILS
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

/**
 * Safely reads a session storage value. Safari private mode or strict policies can throw.
 * @param {string} key
 * @return {string|null}
 */
function safeSessionGetItem(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

/**
 * Safely writes a session storage value. Rendering must continue even when storage is unavailable.
 * @param {string} key
 * @param {string} value
 * @return {void}
 */
function safeSessionSetItem(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        // Ignore storage write failures so app state remains usable in-memory.
    }
}
