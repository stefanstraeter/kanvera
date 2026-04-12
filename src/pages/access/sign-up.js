// src/pages/access/sign-up.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError } from '../../utils/input-validation.js';
import { AUTH_ERRORS } from '../../utils/constants.js';

/**
 * @description Validates the signup form inputs and toggles error states accordingly
 * @return {boolean} - Returns true if all inputs are valid, false otherwise
 */
function isSignupFormValid() {
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
 * @description Handles the signup form submission, validates the inputs, and prepares data for Firebase authentication
 * @export
 * @param {Event} event - The event object from the form submission
 * @return {Promise<void>} - A promise that resolves when the signup process is complete
 */
export async function handleSignup(event) {
    event.preventDefault();

    const isValid = isSignupFormValid();

    if (!isValid) {
        console.log("Validierung fehlgeschlagen.");
        return;
    }

    console.log("Signup-Daten okay, jetzt Firebase...");

    // Hier kannst du die Daten für Firebase sammeln
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // ... hier kommt später der Firebase-Call hin
}