/** 
 * @description A collection of error messages related to authentication processes, such as login and signup.
 * 
*/
export const AUTH_ERRORS = {
    NAME: "Your name is required.",
    EMAIL_LOGIN: "Please enter your email.",
    EMAIL_SIGNUP: "Please enter a valid email.",
    PASSWORD_LOGIN: "Please enter your password.",
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
    name: "Guest",
    email: "guest@mail.com",
    password: "********"
};


/** 
 * @description Default UI button text used for various authentication actions.
 */
export const UI_BUTTON_TEXT = {
    LOGIN_PENDING: "Logging in...",
    LOGIN_DEFAULT: "Sign In",
    SIGNUP_PENDING: "Creating account...",
    SIGNUP_DEFAULT: "Sign Up",
    GUEST_DEFAULT: "Guest Sign In"
};