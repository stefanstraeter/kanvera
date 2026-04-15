// src/pages/access/sign-in.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError, attachLiveValidation } from '../../utils/input-validation.js';
import { AUTH_ERRORS, GUEST_LOGIN_DATA } from '../../utils/constants.js';
import { handleSignUp } from './sign-up.js';
import { signInAsUser, signInAsGuest } from '../../services/auth-logic.js';
import { setLoadingStateBtn } from './access-utils.js';


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
/**
 * @description Initalizes the sign-in page logic by setting up event listeners for form submissions and live input validations
 * @export
 */
export function initSignInLogic() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const guestLoginBtn = document.getElementById('guestLoginBtn');

    setupAllLiveValidations();

    if (loginForm) loginForm.addEventListener('submit', handleSignInSubmit);
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
    if (guestLoginBtn) {
        guestLoginBtn.addEventListener('click', handleGuestLogIn);
    }
}

/* ==========================================================================
   LIVE VALIDATION
   ========================================================================== */
/**
 * @description Sets up live validation for all relevant input fields on the sign-in and sign-up forms by attaching event listeners that validate the input values in real-time and display error messages as needed.
 */
function setupAllLiveValidations() {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPass = document.getElementById('signupPassword');
    const signupConfirm = document.getElementById('signupConfirmPassword');
    const policyCheckbox = document.getElementById('policy');

    if (loginEmail) attachLiveValidation(loginEmail, validateEmailFormat, AUTH_ERRORS.EMAIL_LOGIN);
    if (loginPassword) attachLiveValidation(loginPassword, validateNotEmpty, AUTH_ERRORS.PASSWORD_LOGIN);

    if (signupName) attachLiveValidation(signupName, validateNotEmpty, AUTH_ERRORS.NAME);
    if (signupEmail) attachLiveValidation(signupEmail, validateEmailFormat, AUTH_ERRORS.EMAIL_SIGNUP);
    if (signupPass) attachLiveValidation(signupPass, (val) => validateMinLength(val, 8), AUTH_ERRORS.PASSWORD_SIGNUP);
    if (signupConfirm) attachLiveValidation(signupConfirm, (val) => val === signupPass.value, AUTH_ERRORS.PASSWORD_CONFIRM);

    if (policyCheckbox) attachLiveValidation(policyCheckbox, (val) => val, AUTH_ERRORS.POLICY);
}

/* ==========================================================================
   FORM SUBMISSION HANDLING (SIGN IN & GUEST LOGIN)
   ========================================================================== */
/**
 * @description Handles the sign-in form submission by validating input fields and attempting to sign in the user.
 * @param {Event} event - The form submission event.
 */
async function handleSignInSubmit(event) {
    event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const isEmailValid = validateEmailFormat(emailInput.value);
    const isPassValid = validateNotEmpty(passwordInput.value);

    toggleError(emailInput, isEmailValid, AUTH_ERRORS.EMAIL_LOGIN);
    toggleError(passwordInput, isPassValid, AUTH_ERRORS.PASSWORD_LOGIN);

    if (isEmailValid && isPassValid) {
        const loginBtn = event.submitter;
        setLoadingStateBtn(loginBtn, true);
        const user = await signInAsUser(emailInput.value, passwordInput.value);

        if (user) {
            setTimeout(() => {
                window.location.href = "pulse.html";
            }, 1000);
        } else {
            setLoadingStateBtn(loginBtn, false);
            toggleError(emailInput, false, AUTH_ERRORS.INVALID_AUTH);
        }
    }
}

/**
 * @description Handles the guest login process by pre-filling the form, showing a loading state, and redirecting after a visual delay.
 */
async function handleGuestLogIn() {
    const guestBtn = document.getElementById('guestLoginBtn');
    const emailField = document.getElementById('loginEmail');
    const passwordField = document.getElementById('loginPassword');

    setLoadingStateBtn(guestBtn, true, "Logging in...", "Guest Sign In");

    emailField.value = GUEST_LOGIN_DATA.email;
    passwordField.value = GUEST_LOGIN_DATA.password;

    toggleError(emailField, true);
    toggleError(passwordField, true);

    setTimeout(() => {
        try {
            signInAsGuest();
            window.location.href = "pulse.html";
        } catch (error) {
            console.error("Guest login failed:", error);
            setLoadingStateBtn(guestBtn, false, "", UI_TEXT.GUEST_DEFAULT);
        }
    }, 1000);
}
