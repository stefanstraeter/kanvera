// src/features/auth/auth.service.js

/**
 * Authentication Service
 * Handles user login, signup, and session management
 */

import { fetchData, postData } from '../../core/firebase.config.js';
import { AUTH_SESSION_KEY, GUEST_LOGIN_DATA } from '../../shared/utils/constants.js';

/* ==========================================================================
   USER & GUEST SIGN-IN
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
        isGuest: true
    };
    saveToSession(guestData);
    return guestData;
}

/* ==========================================================================
   SIGN UP CHECKS & USER CREATION
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
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

/**
 * @description Gets the currently logged-in user's data from session storage. 
 * @export
 * @return {Object|null} - Returns the user data if a user is logged in, or null if no user is logged in.
 */
export function getCurrentUser() {
    const userData = sessionStorage.getItem(AUTH_SESSION_KEY);
    return userData ? JSON.parse(userData) : null;
}

/**
 * @description Clears session storage to log out the user.
 * @export
 */
export function performLogout() {
    sessionStorage.clear();
    localStorage.removeItem("kanvera_data");
    window.location.replace('index.html');
}

/* ==========================================================================
    INTERNAL UTILS & HELPERS
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
