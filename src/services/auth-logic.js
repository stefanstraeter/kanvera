// src/services/auth-logic.js

import { getData, postData } from './firebase-service.js';


/**
 * @description Checks if a given email already exists in the database. This is used during the signup process to prevent duplicate accounts. 
 * @export
 * @param {string} email - The email address to check for existence.
 * @return {Promise<boolean>} - Returns true if the email exists, false otherwise.
 */
export async function checkIfEmailExists(email) {
    const allUsers = await getData("users");
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


/**
 * @description Logs in a user by checking the provided email and password against the database. If a matching user is found, their data (excluding the password) is stored in the session storage to keep track of the logged-in user. This function is used during the login process to authenticate users.
 * @export
 * @param {string} email - The email address of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @return {Promise<Object|null>} - Returns the user data (excluding the password) if authentication is successful, or null if it fails.
 */
export async function loginUser(email, password) {
    const allUsers = await getData("users");
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