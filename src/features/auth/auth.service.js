
import { fetchData, postData } from '../../core/firebase.config.js';
import { getState, saveToCache } from '../../core/state.js';

import { AUTH_SESSION_KEY, GUEST_LOGIN_DATA } from '../../shared/utils/constants.js';

/* ==========================================================================
   SIGN-IN  
   ========================================================================== */

/**
 * @description Authenticates a user with email and password.
 * @export
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<Object|null>} - Returns user data if authentication succeeds, null otherwise.
 */
export async function signInAsUser(email, password) {
    const userList = await getAllUsersAsArray();
    const foundUser = userList.find(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (foundUser) {
        const sessionData = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            isGuest: false
        };
        saveToSession(sessionData);
        createWelcomeTaskForUser(foundUser.id);
        return sessionData;
    }
    return null;
}

/**
 * @description Signs in the user as a guest.
 * @export
 * @return {Object} - Returns guest user data and saves it to session.
 */
export function signInAsGuest() {
    const guestData = {
        name: GUEST_LOGIN_DATA.name,
        email: GUEST_LOGIN_DATA.email,
        id: 'guest-id',
        isGuest: true
    };
    saveToSession(guestData);
    createWelcomeTaskForUser('guest-id');
    return guestData;
}

/* ==========================================================================
   SIGN-UP  
   ========================================================================== */

/**
 * @description Creates a new user in the database. This is used during the signup process to add a new user.
 * @export
 * @param {Object} userData - The user data to be added to the database.
 * @return {Promise<Object>} - Returns the created user data.
 */
export async function createNewUser(userData) {
    return await postData("users", userData);
}

/**
 * @description Checks if the provided email already exists in the database.
 * @export 
 * @param {string} email - The email address to check for existence.
 * @return {Promise<boolean>} - Returns true if the email exists, false otherwise.
 */
export async function checkIfEmailExists(email) {
    const userList = await getAllUsersAsArray();
    return userList.some(user => user.email.toLowerCase() === email.toLowerCase());
}

/* ==========================================================================
   SESSION MANAGEMENT
   ========================================================================== */

/**
 * @description Saves the authenticated user's data to session storage. 
 * @param {Object} user - The user data to be saved in session storage.
 */
function saveToSession(user) {
    try {
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } catch (error) {
        // Ignore unavailable storage; caller flow should not crash.
    }
}

/**
 * @description Gets the currently logged-in user's data from session storage. 
 * @export
 * @return {Object|null} - Returns the user data if a user is logged in, or null if no user is logged in.
 */
export function getCurrentUser() {
    try {
        const userData = sessionStorage.getItem(AUTH_SESSION_KEY);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        return null;
    }
}

/**
 * @description Clears session storage to log out the user.
 * @export
 */
export function performLogout() {
    try {
        sessionStorage.clear();
    } catch (error) {
        // no-op
    }

    try {
        localStorage.removeItem("kanvera_data");
    } catch (error) {
        // no-op
    }

    window.location.replace('index.html');
}

/* ==========================================================================
    UTILS  
    ========================================================================== */

/**
 * @description Fetches all users from the database and returns them as an array.
 * @return {Promise<Array>} - Returns an array of all users from the database, formatted with their ID and data.
 */
async function getAllUsersAsArray() {
    const allUsers = await fetchData("users");
    if (!allUsers) return [];
    return Object.entries(allUsers).map(([id, data]) => ({
        id,
        ...data
    }));
}

/* ==========================================================================
    WELCOME TASK GENERATION
    ========================================================================== */

/**
 * @description Creates and stores a welcome task for a new user in the session state if one doesn't already exist.
 * @param {string} userId - The ID of the user to create a welcome task for.
 * @return {void}
 */
function createWelcomeTaskForUser(userId) {
    const state = getState();
    const welcomeTaskId = `welcome-${userId}`;

    if (state.tasks[welcomeTaskId]) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateString = dueDate.toISOString().split('T')[0];

    const welcomeTask = {
        title: "Welcome to Kanvera!",
        description: "Explore the board, create tasks, and collaborate with your team. Drag tasks to different columns to update their status.",
        assignedTo: [userId],
        category: "up next",
        priority: "low",
        taskType: "feature",
        dueDate: dueDateString,
        isWelcomeTask: true
    };

    state.tasks[welcomeTaskId] = welcomeTask;
    saveToCache();
}
