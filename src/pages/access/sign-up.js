// src/pages/access/sign-up.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError } from '../../utils/input-validation.js';
import { AUTH_ERRORS, UI_BUTTON_TEXT } from '../../utils/constants.js';
import { checkIfEmailExists, createNewUser } from '../../services/auth-logic.js';
import { setLoadingStateBtn } from './access-utils.js';


/* ==========================================================================
   FORM VALIDATION & DATA
   ========================================================================== */
/**
 * @description Validates the signup form inputs and toggles error states accordingly
 * @return {boolean} - Returns true if all inputs are valid, false otherwise
 */
function isSignUpFormValid() {
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    const policyCheckbox = document.getElementById('policy');

    const isNameOk = validateNotEmpty(nameInput.value);
    const isEmailOk = validateEmailFormat(emailInput.value);
    const isPassOk = validateMinLength(passInput.value, 8);
    const isMatch = passInput.value === confirmInput.value;
    const isPolicyOk = policyCheckbox.checked;

    toggleError(nameInput, isNameOk, AUTH_ERRORS.NAME);
    toggleError(emailInput, isEmailOk, AUTH_ERRORS.EMAIL_SIGNUP);
    toggleError(passInput, isPassOk, AUTH_ERRORS.PASSWORD_SIGNUP);
    toggleError(confirmInput, isMatch, AUTH_ERRORS.PASSWORD_CONFIRM);
    toggleError(policyCheckbox, isPolicyOk, AUTH_ERRORS.POLICY);

    return isNameOk && isEmailOk && isPassOk && isMatch && isPolicyOk;
}

/**
 * @description Gets data from the form inputs and returns it as an object
 * @return {Object} - Returns an object containing the name, email, and password from the signup form inputs
 */
function getFormData() {
    return {
        name: document.getElementById('signupName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value
    };
}

/* ==========================================================================
   OVERLAYS SUCCESS MESSAGE
   ========================================================================== */
/**
 * @description Displays a success message to the user and redirects to the login page after a short delay
 */
function showSuccessMessage() {
    const overlay = document.getElementById('successOverlay');

    if (overlay) {
        overlay.classList.add('show');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2500);
    } else {
        alert("Signup successful!");
        window.location.href = "index.html";
    }
}

/* ==========================================================================
   SIGN UP LOGIC
   ========================================================================== */
/**
 * @description Handles the sign-up form submission by validating inputs, checking for existing email, creating a new user, and providing feedback to the user.
 * @export
 * @param {Event} event - The form submission event
 * @return {Promise<void>} - Returns a promise that resolves when the sign-up process is complete
 */
export async function handleSignUp(event) {
    event.preventDefault();
    if (!isSignUpFormValid()) return;

    const signupBtn = event.submitter;
    setLoadingStateBtn(signupBtn, true, UI_BUTTON_TEXT.SIGNUP_PENDING, UI_BUTTON_TEXT.SIGNUP_DEFAULT);
    const newUser = getFormData();

    try {
        const emailExists = await checkIfEmailExists(newUser.email);
        if (emailExists) {
            const emailInput = document.getElementById('signupEmail');
            toggleError(emailInput, false, AUTH_ERRORS.EMAIL_EXISTS);
            setLoadingStateBtn(signupBtn, false, "", UI_BUTTON_TEXT.SIGNUP_DEFAULT);
            return;
        }
        await createNewUser(newUser);
        showSuccessMessage();

    } catch (error) {
        console.error("Signup Error:", error);
        setLoadingStateBtn(signupBtn, false, "", UI_BUTTON_TEXT.SIGNUP_DEFAULT);
    }
}


