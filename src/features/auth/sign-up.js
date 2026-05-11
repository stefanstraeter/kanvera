
import { checkIfEmailExists, createNewUser } from './auth.service.js';

import { validateNotEmpty, validateEmailFormat, validateMinLength, toggleError } from '../../shared/utils/input-validation.js';
import { setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { AUTH_ERRORS, UI_AUTH_BUTTON_TEXT } from '../../shared/utils/constants.js';

/* ==========================================================================
   SIGN-UP FLOW  
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
    setLoadingStateBtn(signupBtn, true, UI_AUTH_BUTTON_TEXT.SIGNUP_PENDING);

    try {
        const emailExists = await checkIfEmailExists(formData.email);

        if (emailExists) {
            handleEmailExistsError(signupBtn);
            return;
        }

        await createNewUser(formData);
        showSuccessMessage();

    } catch (error) {
        console.error("SignUp Error:", error);
        setLoadingStateBtn(signupBtn, false, UI_AUTH_BUTTON_TEXT.SIGNUP_DEFAULT, UI_AUTH_BUTTON_TEXT.SIGNUP_PENDING);
    }
}

/* ==========================================================================
   FORM HELPERS  
   ========================================================================== */
/**
 * @description Retrieves the current values from the sign-up form input fields.
 * @return {{name: string, email: string, password: string, confirm: string, policy: boolean}} An object containing the form values.
 */
function getFormData() {
    return {
        name: document.getElementById('signUpName').value.trim(),
        email: document.getElementById('signUpEmail').value.trim(),
        password: document.getElementById('signUpPassword').value,
        confirm: document.getElementById('signUpConfirmPassword').value,
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
        { id: 'signUpName', ok: validateNotEmpty(data.name), err: AUTH_ERRORS.NAME },
        { id: 'signUpEmail', ok: validateEmailFormat(data.email), err: AUTH_ERRORS.EMAIL_SIGNUP },
        { id: 'signUpPassword', ok: validateMinLength(data.password, 8), err: AUTH_ERRORS.PASSWORD_SIGNUP },
        { id: 'signUpConfirmPassword', ok: data.password === data.confirm, err: AUTH_ERRORS.PASSWORD_CONFIRM },
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
    const emailInput = document.getElementById('signUpEmail');
    toggleError(emailInput, false, AUTH_ERRORS.EMAIL_EXISTS);
    setLoadingStateBtn(btn, false, UI_AUTH_BUTTON_TEXT.SIGNUP_DEFAULT, UI_AUTH_BUTTON_TEXT.SIGNUP_PENDING);
}

/**
 * @description Shows the success overlay or an alert and redirects the user.
 */
function showSuccessMessage() {
    const overlay = document.getElementById('authSuccessOverlay');

    if (overlay) {
        overlay.classList.add('show');
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2500);
    } else {
        window.location.href = "index.html";
    }
}
