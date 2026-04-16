// src/services/auth-logic.js

import { fetchData, postData } from './firebase-service.js';
import { AUTH_SESSION_KEY, GUEST_LOGIN_DATA } from '../utils/constants.js';


/* ==========================================================================
   SIGN IN LOGIC - USER & GUEST
   ========================================================================== */

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
   SIGN UP LOGIC
   ========================================================================== */
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

/**
 * @description Creates a new user in the database. This is used during the signup process to add a new user.
 * @export
 * @param {Object} userData - The user data to be added to the database.
 * @return {Promise<Object>} - Returns the created user data.
 */
export async function createNewUser(userData) {
    return await postData("users", userData);
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
    sessionStorage.removeItem(AUTH_SESSION_KEY);
}

/* ==========================================================================
   UTILITIES & HELPERS
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

/**
* @description Generates initials from a given name. 
* @export
* @param {string} name - The name from which to generate initials.
* @return {string} - The generated initials.
*/
export function getInitials(name) {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    const initials = parts.map(part => part.charAt(0).toUpperCase());

    if (initials.length > 1) {
        return initials[0] + initials[initials.length - 1];
    }
    return initials[0];
}


