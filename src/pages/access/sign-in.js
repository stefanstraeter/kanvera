// src/pages/access/sign-in.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError, attachLiveValidation } from '../../utils/input-validation.js';
import { AUTH_ERRORS } from '../../utils/constants.js';
import { handleSignup } from './sign-up.js';
import { loginAsUser, loginAsGuest } from '../../services/auth-logic.js';


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
    const guestBtn = document.getElementById('guestBtn');

    setupAllLiveValidations();

    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (guestBtn) {
        guestBtn.addEventListener('click', handleGuestLogin);
    }
}

/* ==========================================================================
   LIVE VALIDATION SETUP
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
   FORM SUBMISSION HANDLING
   ========================================================================== */
/**
 * @description Handles the login form submission by validating input fields and attempting to log in the user.
 * @param {Event} event - The form submission event.
 */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const isEmailValid = validateEmailFormat(emailInput.value);
    const isPassValid = validateNotEmpty(passwordInput.value);

    toggleError(emailInput, isEmailValid, AUTH_ERRORS.EMAIL_LOGIN);
    toggleError(passwordInput, isPassValid, AUTH_ERRORS.PASSWORD_LOGIN);

    if (isEmailValid && isPassValid) {
        const user = await loginAsUser(emailInput.value, passwordInput.value);

        if (user) {
            window.location.href = "pulse.html";
        } else {
            toggleError(emailInput, false, AUTH_ERRORS.INVALID_AUTH);
        }
    }
}

/**
 * @description Handles the guest login process by pre-filling the login form with guest credentials and then programmatically triggering the login process, ultimately redirecting the user to the main application page if successful.
 */
async function handleGuestLogin() {
    document.getElementById('loginEmail').value = "guest@mail.com";
    document.getElementById('loginPassword').value = "********";

    loginAsGuest();
    window.location.href = "pulse.html";
}
