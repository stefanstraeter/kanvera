
import { signInAsUser, signInAsGuest } from './auth.service.js';
import { handleSignUp } from './sign-up.js';

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError, attachLiveValidation } from '../../shared/utils/input-validation.js';
import { setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { AUTH_ERRORS, GUEST_LOGIN_DATA, UI_AUTH_BUTTON_TEXT } from '../../shared/utils/constants.js';

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
/**
 * @description Initalizes the sign-in page logic by setting up event listeners for form submissions and guest login, as well as initializing live validation for input fields.
 * @export
 */
export function initSignInLogic() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const guestSignInBtn = document.getElementById('guestSignInBtn');

    setupAllLiveValidations();

    if (signInForm) signInForm.addEventListener('submit', handleSignIn);
    if (signUpForm) signUpForm.addEventListener('submit', handleSignUp);
    if (guestSignInBtn) guestSignInBtn.addEventListener('click', handleGuestSignIn);
}

/* ==========================================================================
   FORM SUBMISSION  
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

    const signInBtn = event.submitter;
    setLoadingStateBtn(signInBtn, true);

    const user = await signInAsUser(email, pass);

    if (user) {
        completeLogin();
    } else {
        setLoadingStateBtn(signInBtn, false, UI_AUTH_BUTTON_TEXT.SIGNIN_DEFAULT, UI_AUTH_BUTTON_TEXT.SIGNIN_PENDING);
        toggleError(document.getElementById('signInEmail'), false, AUTH_ERRORS.INVALID_AUTH);
    }
}

/**
 * @description Handles the guest login process by setting the loading state, filling in guest credentials, and attempting to sign in as a guest.
 * @param {Event} event
 * @return {Promise<void>}
 */
async function handleGuestSignIn(event) {
    const guestBtn = event.currentTarget;

    setLoadingStateBtn(guestBtn, true, UI_AUTH_BUTTON_TEXT.SIGNIN_PENDING, UI_AUTH_BUTTON_TEXT.GUEST_DEFAULT);

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
        { id: 'signInEmail', validator: validateEmailFormat, error: AUTH_ERRORS.EMAIL_SIGNIN },
        { id: 'signInPassword', validator: validateNotEmpty, error: AUTH_ERRORS.PASSWORD_SIGNIN },
        { id: 'signUpName', validator: validateNotEmpty, error: AUTH_ERRORS.NAME },
        { id: 'signUpEmail', validator: validateEmailFormat, error: AUTH_ERRORS.EMAIL_SIGNUP },
        { id: 'signUpPassword', validator: (v) => validateMinLength(v, 8), error: AUTH_ERRORS.PASSWORD_SIGNUP },
        { id: 'policy', validator: (v) => v, error: AUTH_ERRORS.POLICY }
    ];

    inputFields.forEach(field => {
        const inputField = document.getElementById(field.id);
        if (inputField) attachLiveValidation(inputField, field.validator, field.error);
    });

    const signUpPassword = document.getElementById('signUpPassword');
    const signUpConfirm = document.getElementById('signUpConfirmPassword');

    if (signUpConfirm && signUpPassword) {
        attachLiveValidation(signUpConfirm, (val) => val === signUpPassword.value, AUTH_ERRORS.PASSWORD_CONFIRM);
    }
}

/* ==========================================================================
   FORM HELPERS  
   ========================================================================== */
/**
 * @description Retrieves the email and password values from the login form input fields.
 * @return {{email: string, pass: string}} An object containing the email and password values.
 */
function getLoginCredentials() {
    return {
        email: document.getElementById('signInEmail').value,
        pass: document.getElementById('signInPassword').value
    };
}

/**
 * @description Fills the login form visually with guest credentials.
 */
function fillGuestCredentials() {
    const emailField = document.getElementById('signInEmail');
    const passwordField = document.getElementById('signInPassword');

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
    const emailInput = document.getElementById('signInEmail');
    const passwordInput = document.getElementById('signInPassword');

    const isEmailOk = validateEmailFormat(email);
    const isPassOk = validateNotEmpty(password);

    toggleError(emailInput, isEmailOk, AUTH_ERRORS.EMAIL_SIGNIN);
    toggleError(passwordInput, isPassOk, AUTH_ERRORS.PASSWORD_SIGNIN);

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
