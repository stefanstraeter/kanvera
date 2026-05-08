import { getState, saveToCache } from '../../core/state.js';

import { toggleError, validateNotEmpty, validateEmailFormat, attachLiveValidation } from '../../shared/utils/input-validation.js';
import { VALIDATION_ERRORS } from '../../shared/utils/constants.js';

/* ==========================================================================
    MEMBER SERVICE READ AND WRITE
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

/* ==========================================================================
   FORM VALIDATION AND BEHAVIORS
   ========================================================================== */

export function initAddMemberValidation() {
    const form = document.getElementById('js-add-member-form');

    if (!form) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');

    attachLiveValidation(nameInput, validateNotEmpty, VALIDATION_ERRORS.FULL_NAME);
    attachLiveValidation(emailInput, validateEmailFormat, VALIDATION_ERRORS.EMAIL_INVALID);
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