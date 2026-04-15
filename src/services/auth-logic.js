// src/services/auth-logic.js

import { fetchData, postData } from './firebase-service.js';
import { GUEST_LOGIN_DATA } from '../utils/constants.js';


/* ==========================================================================
   UTILITIES & HELPERS
   ========================================================================== */
/**
 * @description Generates initials from a given name. This is used to create a visual representation of the user's name, especially in cases where a profile picture is not available.
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

/* ==========================================================================
   SIGN IN LOGIC - USER & GUEST
   ========================================================================== */
/**
 * @description Signs in a user by checking the provided email and password against the database. 
 * @export
 * @param {string} email - The email address of the user attempting to sign in.
 * @param {string} password - The password of the user attempting to sign in.
 * @return {Promise<Object|null>} - Returns the user data (excluding the password) if authentication is successful, or null if it fails.
 */
export async function signInAsUser(email, password) {
    const allUsers = await fetchData("users");
    if (!allUsers) return null;

    const userList = Object.entries(allUsers).map(([id, data]) => ({
        id,
        ...data
    }));

    const foundUser = userList.find(user =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (foundUser) {
        const sessionData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        sessionStorage.setItem("loggedInUser", JSON.stringify(sessionData));
        return sessionData;
    }

    return null;
}

/**
 * @description Signs in a guest user by creating a temporary user object with predefined guest credentials and storing it in the session storage. 
 * @export
 * @return {Object} - Returns the guest user data.
 */
export function signInAsGuest() {
    sessionStorage.setItem('loggedInUser', JSON.stringify({
        name: GUEST_LOGIN_DATA.name,
        email: GUEST_LOGIN_DATA.email,
        isGuest: true
    }));
}

/* ==========================================================================
   SIGN UP LOGIC
   ========================================================================== */
/**
 * @description Checks if a given email already exists in the database. This is used during the signup process to prevent duplicate accounts. 
 * @export
 * @param {string} email - The email address to check for existence.
 * @return {Promise<boolean>} - Returns true if the email exists, false otherwise.
 */
export async function checkIfEmailExists(email) {
    const allUsers = await fetchData("users");
    if (!allUsers) return false;

    const userList = Object.values(allUsers);
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
 * @description Gets the currently logged-in user's data from session storage. 
 * @export
 * @return {Object|null} - Returns the user data if a user is logged in, or null if no user is logged in.
 */
export function getCurrentUser() {
    const userData = sessionStorage.getItem('loggedInUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * @description Clears session storage to log out the user.
 * @export
 */
export function performLogout() {
    sessionStorage.clear();
}