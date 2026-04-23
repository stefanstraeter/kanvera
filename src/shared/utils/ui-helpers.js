// src/shared/utils/ui-helpers.js

import { UI_AUTH_BUTTON_TEXT } from './constants.js';

/* ==========================================================================
   GET INITIALS FOR AVATARS
   ========================================================================== */
/**
 * @description Generates initials from a given name.
 * @export
 * @param {string} name - The name from which to generate initials.
 * @return {string} The generated initials.
 */
export function getInitials(name) {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    const initials = parts.map(part => part.charAt(0).toUpperCase());

    if (initials.length > 1) {
        return initials[0] + initials[initials.length - 1];
    }
    return initials[0];
}

/* ==========================================================================
   BUTTON LOADING STATE
   ========================================================================== */
/**
 * @description Toggles the loading state of a button.
 * @export
 * @param {HTMLElement} btn - The button element to be toggled.
 * @param {boolean} isPending - Loading state.
 * @param {string} [loadingText=UI_AUTH_BUTTON_TEXT.SIGNIN_PENDING] - Text to show during loading.
 * @return {void}
 */
export function setLoadingStateBtn(btn, isPending, loadingText = UI_AUTH_BUTTON_TEXT.SIGNIN_PENDING) {
    if (!btn) return;

    if (isPending) {
        btn.dataset.originalText = btn.innerText;
        btn.innerText = loadingText;
    } else {
        btn.innerText = btn.dataset.originalText || UI_AUTH_BUTTON_TEXT.SIGNIN_DEFAULT;
    }

    btn.disabled = isPending;
    btn.classList.toggle('is-pending', isPending);
}

/**
 * @description Handles asynchronous button actions with loading state.
 * @export
 * @param {HTMLElement} btn - The button element to be toggled.
 * @param {Function} callback - The asynchronous function to execute.
 * @param {Object} texts - An object containing text values for different states.
 * @return {Promise<void>} A promise that resolves when the action is complete.
 */
export async function handleAsyncButtonAction(btn, callback, texts) {
    if (!btn) return;

    setLoadingStateBtn(btn, true, texts.SAVE_PENDING || texts.PENDING);

    try {
        await callback();
    } catch (error) {
        console.error("Action failed:", error);
        setLoadingStateBtn(btn, false, texts.SAVE_DEFAULT || texts.DEFAULT);
    }
}

/* ==========================================================================
   PROGRESS CALCULATION FOR PULSE PAGE & SUBTASKS
   ========================================================================== */
/**
 * @description Calculates the progress percentage based on the number of completed items and the total number of items.
 * @export
 * @param {number} done - The number of completed items.
 * @param {number} total - The total number of items.
 * @returns {number} A percentage value between 0 and 100.
 */
export function calculateProgressPercent(done, total) {
    if (!total || total <= 0) return 0;
    return (done / total) * 100;
}
