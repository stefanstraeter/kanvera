// src/utils/constants.js

/** 
 * @description Key used to store the authenticated user's session data in session storage. 
 */
export const AUTH_SESSION_KEY = "loggedInUser";

/**  
 * @description Key used to store the application's main data (tasks, team, users) in local storage for caching purposes.
*/
export const DATA_CACHE_KEY = "kanvera_data";

/** 
 * @description A collection of error messages related to authentication processes.
 */
export const AUTH_ERRORS = {
    NAME: "Your name is required.",
    EMAIL_SIGNIN: "Please enter your email.",
    EMAIL_SIGNUP: "Please enter a valid email.",
    PASSWORD_SIGNIN: "Please enter your password.",
    PASSWORD_SIGNUP: "At least 8 characters.",
    PASSWORD_CONFIRM: "Passwords do not match.",
    INVALID_AUTH: "Invalid email or password.",
    POLICY: "Please accept the privacy policy.",
    EMAIL_EXISTS: "This email is already registered."
};

/** 
 * @description Default guest user data used for guest login functionality.
 */
export const GUEST_LOGIN_DATA = {
    name: "Guest User",
    email: "guest.user@kanvera.dev",
    password: "********"
};

/** 
 * @description Default UI button text used for various authentication actions.
 */
export const UI_BUTTON_TEXT = {
    SIGNIN_PENDING: "Signing in...",
    SIGNIN_DEFAULT: "Sign In",
    SIGNUP_PENDING: "Creating account...",
    SIGNUP_DEFAULT: "Sign Up",
    GUEST_DEFAULT: "Guest Sign In"
};

/** 
 * @description Predefined greeting messages based on the time of day for the Pulse dashboard.
 */
export const GREETING_MESSAGES = {
    MORNING: {
        title: "Start your day",
        subline: "Ready to tackle your tasks?"
    },
    AFTERNOON: {
        title: "Stay in the flow",
        subline: "You're making great progress!"
    },
    EVENING: {
        title: "Finish strong",
        subline: "Let's check what's left for today."
    },
    NIGHT: {
        title: "Night owl mode",
        subline: "Still working? Don't forget to rest!"
    }
};

/** * @description UI Button texts for member management
 */
export const MEMBER_UI_TEXT = {
    ADD_PENDING: "Adding...",
    ADD_DEFAULT: "Add Member",
    SAVE_PENDING: "Saving...",
    SAVE_DEFAULT: "Save Changes"
};

/** * @description General validation error messages
 */
export const VALIDATION_ERRORS = {
    FIELD_REQUIRED: "This field is required.",
    FULL_NAME: "Please enter a full name.",
    EMAIL_INVALID: "Please enter a valid email.",
    PHONE_INVALID: "Please check the phone number."
};
