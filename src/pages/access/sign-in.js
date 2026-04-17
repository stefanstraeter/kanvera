// src/pages/access/sign-in.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError, attachLiveValidation } from '../../utils/input-validation.js';
import { AUTH_ERRORS, GUEST_LOGIN_DATA, UI_BUTTON_TEXT } from '../../utils/constants.js';
import { handleSignUp } from './sign-up.js';
import { signInAsUser, signInAsGuest } from '../../services/auth-service.js';
import { setLoadingStateBtn } from './access-utils.js';

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
/**
 * @description Initalizes the sign-in page logic by setting up event listeners for form submissions and guest login, as well as initializing live validation for input fields.
 * @export
 */
export function initSignInLogic() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const guestLoginBtn = document.getElementById('guestLoginBtn');

    setupAllLiveValidations();

    if (loginForm) loginForm.addEventListener('submit', handleSignIn);
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (guestLoginBtn) guestLoginBtn.addEventListener('click', handleGuestSignIn);
}

/* ==========================================================================
   FORM SUBMISSION HANDLING
   ========================================================================== */
/**
 * @description Handles the sign-in form submission by validating the input, showing loading state, attempting to sign in the user, and handling success or error outcomes.
 * @param {Event} event
 * @return {Promise<void>} 
 */
async function handleSignIn(event) {
    event.preventDefault();
    const { email, pass } = getLoginCredentials();

    if (!isLoginValid(email, pass)) return;

    const loginBtn = event.submitter;
    setLoadingStateBtn(loginBtn, true);

    const user = await signInAsUser(email, pass);

    if (user) {
        completeLogin();
    } else {
        setLoadingStateBtn(loginBtn, false);
        toggleError(document.getElementById('loginEmail'), false, AUTH_ERRORS.INVALID_AUTH);
    }
}

/**
 * @description Handles the guest login process by setting the loading state, filling in guest credentials, and attempting to sign in as a guest.
 * @param {Event} event
 * @return {Promise<void>} 
 */
async function handleGuestSignIn(event) {
    const guestBtn = event.currentTarget;

    setLoadingStateBtn(guestBtn, true, UI_BUTTON_TEXT.LOGIN_PENDING, UI_BUTTON_TEXT.GUEST_DEFAULT);

    fillGuestCredentials();
    signInAsGuest();
    completeLogin();
}

/* ==========================================================================
   LIVE VALIDATION
   ========================================================================== */
/**
 * @description Setup live validation for all relevant input fields on the sign-in and sign-up forms by attaching appropriate validation functions and error messages.
 * @return {void}
 */
function setupAllLiveValidations() {
    const inputFields = [
        { id: 'loginEmail', validator: validateEmailFormat, error: AUTH_ERRORS.EMAIL_LOGIN },
        { id: 'loginPassword', validator: validateNotEmpty, error: AUTH_ERRORS.PASSWORD_LOGIN },
        { id: 'signupName', validator: validateNotEmpty, error: AUTH_ERRORS.NAME },
        { id: 'signupEmail', validator: validateEmailFormat, error: AUTH_ERRORS.EMAIL_SIGNUP },
        { id: 'signupPassword', validator: (v) => validateMinLength(v, 8), error: AUTH_ERRORS.PASSWORD_SIGNUP },
        { id: 'policy', validator: (v) => v, error: AUTH_ERRORS.POLICY }
    ];

    inputFields.forEach(field => {
        const inputField = document.getElementById(field.id);
        if (inputField) attachLiveValidation(inputField, field.validator, field.error);
    });

    const signupPass = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirmPassword');

    if (signupConfirm && signupPass) {
        attachLiveValidation(signupConfirm, (val) => val === signupPass.value, AUTH_ERRORS.PASSWORD_CONFIRM);
    }
}


/* ==========================================================================
   HELPERS FOR FORM HANDLING
   ========================================================================== */
/**
 * @description Retrieves the email and password values from the login form input fields.
 * @return {{email: string, pass: string}} An object containing the email and password values.
 */
function getLoginCredentials() {
    return {
        email: document.getElementById('loginEmail').value,
        pass: document.getElementById('loginPassword').value
    };
}

/**
 * @description Fills the login form visually with guest credentials.
 */
function fillGuestCredentials() {
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    emailField.value = GUEST_LOGIN_DATA.email;
    passwordField.value = GUEST_LOGIN_DATA.password;

    toggleError(emailField, true);
    toggleError(passwordField, true);
}

/**
 * @description Validates the login inputs visually.
 * @param {string} email
 * @param {string} password
 * @return {boolean} True if both email and password are valid, false otherwise.
 */
function isLoginValid(email, password) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const isEmailOk = validateEmailFormat(email);
    const isPassOk = validateNotEmpty(password);

    toggleError(emailInput, isEmailOk, AUTH_ERRORS.EMAIL_LOGIN);
    toggleError(passwordInput, isPassOk, AUTH_ERRORS.PASSWORD_LOGIN);

    return isEmailOk && isPassOk;
}

/**
 * @description Handles the redirection after a successful login.
 */
function completeLogin() {
    setTimeout(() => {
        window.location.href = "pulse.html";
    }, 1000);
}

