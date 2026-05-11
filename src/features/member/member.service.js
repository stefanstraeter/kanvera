import { getState, saveToCache } from '../../core/state.js';
import { getMemberDataFromModal, createNewMemberObject } from './member.utils.js';

import { toggleError, validateNotEmpty, validateEmailFormat, validatePhoneFormat, attachLiveValidation } from '../../shared/utils/input-validation.js';
import { VALIDATION_ERRORS } from '../../shared/utils/constants.js';

/* ==========================================================================
    READ ACCESS
    ========================================================================== */

/**
 * @description Get a member by ID
 * @export
 * @param {string} memberId
 * @return {Object|null} Member object or null if not found
 */
export function getMemberById(memberId) {
    const state = getState();

    return state.team[memberId] || null;
}

/* ==========================================================================
   WRITE OPERATIONS
   ========================================================================== */

/**
 * @description Updates a member's data locally in the state and cache.
 * @export
 * @param {string} memberId - The ID of the member to update
 * @param {Object} updatedData - An object containing the updated member data
 */
export function updateMemberLocally(memberId, updatedData) {
    const state = getState();

    if (!state.team[memberId]) {
        state.team[memberId] = {};
    }

    state.team[memberId] = {
        ...state.team[memberId],
        ...updatedData
    };
    saveToCache();
}


/**
 * @description Deletes a member's data locally from the state and cache.
 * @export
 * @param {string} memberId - The ID of the member to delete
 */
export function deleteMemberLocally(memberId) {
    const state = getState();
    if (state.team[memberId]) {
        delete state.team[memberId];
        saveToCache();
    }
}

/**
 * @description Updates an existing member with data read from the edit modal.
 * @export
 * @param {string} memberId - The ID of the member to update.
 */
export function updateMemberFromModal(memberId) {
    const updatedData = getMemberDataFromModal();
    updateMemberLocally(memberId, updatedData);
}

/**
 * @description Creates a new member from add-form data and saves it locally.
 * @export
 * @param {Object} formData - Raw add-member form data.
 */
export function createMemberLocallyFromForm(formData) {
    const newMember = createNewMemberObject(formData);
    const newId = `member-${Date.now()}`;

    updateMemberLocally(newId, newMember);
}

/* ==========================================================================
   INLINE VALIDATION
   ========================================================================== */

/**
 * @description Shows or hides an inline validation error message.
 * @export
 * @param {HTMLElement|null} errorEl - Error element in the modal.
 * @param {boolean} isValid - Whether field value is valid.
 * @param {string} message - Message shown when invalid.
 */
export function toggleInlineError(errorEl, isValid, message) {
    if (!errorEl) return;

    if (!isValid) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        return;
    }

    errorEl.textContent = '';
    errorEl.classList.remove('show');
}

/**
 * @description Validates editable email and phone fields in the edit modal.
 * @export
 * @return {boolean} True when both fields are valid.
 */
export function validateInlineMemberFields() {
    const emailSpan = document.querySelector('[data-field="email"]');
    const phoneSpan = document.querySelector('[data-field="phone"]');
    const emailError = document.querySelector('[data-error="email"]');
    const phoneError = document.querySelector('[data-error="phone"]');

    const emailValue = emailSpan?.innerText.trim() || '';
    const phoneValue = phoneSpan?.innerText.trim() || '';

    const isEmailValid = validateEmailFormat(emailValue);
    const isPhoneValid = validatePhoneFormat(phoneValue);

    toggleInlineError(emailError, isEmailValid, VALIDATION_ERRORS.EMAIL_INVALID);
    toggleInlineError(phoneError, isPhoneValid, VALIDATION_ERRORS.PHONE_INVALID);

    return isEmailValid && isPhoneValid;
}

/* ==========================================================================
    ADD FORM VALIDATION
    ========================================================================== */

export function initAddMemberValidation() {
    const form = document.getElementById('js-add-member-form');

    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    attachLiveValidation(nameInput, validateNotEmpty, VALIDATION_ERRORS.FULL_NAME);
    attachLiveValidation(emailInput, validateEmailFormat, VALIDATION_ERRORS.EMAIL_INVALID);
    attachLiveValidation(phoneInput, validatePhoneFormat, VALIDATION_ERRORS.PHONE_INVALID);
}

export function validateMemberForm(form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');

    const isNameValid = validateNotEmpty(nameInput.value);
    const isEmailValid = validateEmailFormat(emailInput.value);

    toggleError(nameInput, isNameValid, VALIDATION_ERRORS.FULL_NAME);
    toggleError(emailInput, isEmailValid, VALIDATION_ERRORS.EMAIL_INVALID);

    return isNameValid && isEmailValid;
}