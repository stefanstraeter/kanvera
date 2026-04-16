// src/pages/access/sign-up.js

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError } from '../../utils/input-validation.js';
import { AUTH_ERRORS, UI_BUTTON_TEXT } from '../../utils/constants.js';
import { checkIfEmailExists, createNewUser } from '../../services/auth-logic.js';
import { setLoadingStateBtn } from './access-utils.js';

/* ==========================================================================
   SIGN UP LOGIC
   ========================================================================== */
/**
 * @description Handles the sign-up form submission by validating the input, showing loading state, checking for existing email, creating a new user, and handling success or error outcomes.
 * @param {Event} event
 * @return {Promise<void>}
 */
export async function handleSignUp(event) {
    event.preventDefault();

    const formData = getFormData();
    if (!isSignUpFormValid(formData)) return;

    const signupBtn = event.submitter;
    setLoadingStateBtn(signupBtn, true, UI_BUTTON_TEXT.SIGNUP_PENDING);

    try {
        const emailExists = await checkIfEmailExists(formData.email);

        if (emailExists) {
            handleEmailExistsError(signupBtn);
            return;
        }

        await createNewUser(formData);
        showSuccessMessage();

    } catch (error) {
        console.error("Signup Error:", error);
        setLoadingStateBtn(signupBtn, false);
    }
}

/* ==========================================================================
   HELPERS FOR SIGN-UP FORM
   ========================================================================== */
/**
 * @description Retrieves the current values from the sign-up form input fields.
 * @return {{name: string, email: string, password: string, confirm: string, policy: boolean}} An object containing the form values.
 */
function getFormData() {
    return {
        name: document.getElementById('signupName').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value,
        confirm: document.getElementById('signupConfirmPassword').value,
        policy: document.getElementById('policy').checked
    };
}

/**
 * @description Validates the sign-up form data using the Array-Pattern (consistent with Sign In).
 * @param {Object} data - The form data to validate.
 * @return {boolean} True if all fields are valid, false otherwise.
 */
function isSignUpFormValid(data) {
    const inputFields = [
        { id: 'signupName', ok: validateNotEmpty(data.name), err: AUTH_ERRORS.NAME },
        { id: 'signupEmail', ok: validateEmailFormat(data.email), err: AUTH_ERRORS.EMAIL_SIGNUP },
        { id: 'signupPassword', ok: validateMinLength(data.password, 8), err: AUTH_ERRORS.PASSWORD_SIGNUP },
        { id: 'signupConfirmPassword', ok: data.password === data.confirm, err: AUTH_ERRORS.PASSWORD_CONFIRM },
        { id: 'policy', ok: data.policy, err: AUTH_ERRORS.POLICY }
    ];

    inputFields.forEach(field => {
        const inputField = document.getElementById(field.id);
        if (inputField) {
            toggleError(inputField, field.ok, field.err);
        }
    });

    return inputFields.every(field => field.ok);
}

/**
 * @description Handles the UI for already existing emails.
 * @param {HTMLElement} btn - The button element to reset.
 */
function handleEmailExistsError(btn) {
    const emailInput = document.getElementById('signupEmail');
    toggleError(emailInput, false, AUTH_ERRORS.EMAIL_EXISTS);
    setLoadingStateBtn(btn, false);
}

/**
 * @description Shows the success overlay or an alert and redirects the user.
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