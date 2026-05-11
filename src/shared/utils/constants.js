
/* ==========================================================================
   KEY NAMES FOR STORAGE   
   ========================================================================== */

/**
 * @description Key used to store the authenticated user's session data in session storage.
 */
export const AUTH_SESSION_KEY = "loggedInUser";

/**
 * @description Key used to store the application's main data (tasks, team, users) in local storage for caching purposes.
 */
export const DATA_CACHE_KEY = "kanvera_data";


/* ==========================================================================
   TASK TYPES FOR TASK CREATION     
   ========================================================================== */

/**
 * @description An array of task types with their corresponding values and labels, used for task creation throughout the application.
 */
export const TASK_TYPES = [
    { value: 'feature', label: 'Feature' },
    { value: 'ui/ux', label: 'UI/UX' },
    { value: 'bug fix', label: 'Bug Fix' },
];


/* ==========================================================================
   TASK TYPES LABELS FOR DISPLAY    
   ========================================================================== */

/** 
 * @description A mapping of task type values to their display labels, used for rendering task types in the UI when only the value is stored.
 */
export const TASK_TYPE_LABELS = {
    'feature': 'Feature',
    'ui/ux': 'UI/UX',
    'bug fix': 'Bug Fix',
};


/* ==========================================================================
   MEMBER ROLE OPTIONS   
   ========================================================================== */

/**
 * @description An array of available member role values used across the member management feature.
 */
export const MEMBER_ROLE_OPTIONS = ['@founder', '@programmer', '@product', '@design', '@data-science', '@mobile', '@marketing', '@ux'];


/* ==========================================================================
   INPUT VALIDATION ERROR MESSAGES    
   ========================================================================== */

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

/* ==========================================================================
   DEFAULT GUEST DATA  
   ========================================================================== */

/**
 * @description Default guest user data used for guest login functionality.
 */
export const GUEST_LOGIN_DATA = {
    name: "Guest User",
    email: "guest.user@kanvera.dev",
    password: "********"
};


/* ==========================================================================
   BUTTON TEXT CONSTANTS
   ========================================================================== */

/**
 * @description Default UI button text used for various authentication actions.
 */
export const UI_AUTH_BUTTON_TEXT = {
    SIGNIN_PENDING: "Signing in...",
    SIGNIN_DEFAULT: "Sign In",
    SIGNUP_PENDING: "Creating account...",
    SIGNUP_DEFAULT: "Sign Up",
    GUEST_DEFAULT: "Guest Sign In"
};

/**
 * @description UI button texts for member management.
 */
export const UI_MEMBER_BUTTON_TEXT = {
    ADD_PENDING: "Adding...",
    ADD_DEFAULT: "Add Member",
    SAVE_PENDING: "Saving...",
    SAVE_DEFAULT: "Save Changes"
};

/**
 * @description UI button texts for task management.
 */
export const UI_TASK_BUTTON_TEXT = {
    ADD_PENDING: "Adding...",
    ADD_DEFAULT: "Add Task",
    SAVE_PENDING: "Saving...",
    SAVE_DEFAULT: "Save Changes",
    CREATE_PENDING: "Creating...",
    CREATE_DEFAULT: "Create Task"
};

/**
 * @description General validation error messages.
 */
export const VALIDATION_ERRORS = {
    FIELD_REQUIRED: "This field is required.",
    FULL_NAME: "Please enter a full name.",
    EMAIL_INVALID: "Please enter a valid email.",
    PHONE_INVALID: "Please check the phone number.",
    TITLE_REQUIRED: "Please enter a title.",
    DATE_EMPTY: "Please select a date.",
    DATE_INVALID: "Date cannot be in the past."
};

/* ==========================================================================
    GREETING MESSAGES PULSE    
   ========================================================================== */

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