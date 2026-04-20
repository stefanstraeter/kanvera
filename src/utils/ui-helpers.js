// src/utils/ui-helpers.js

import { UI_BUTTON_TEXT } from '../utils/constants.js';

/* ==========================================================================
    UI COMPONENT HELPERS
   ========================================================================== */
/**
* @description Generates initials from a given name. 
* @export
* @param {string} name - The name from which to generate initials.
* @return {string} - The generated initials.
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
 * @description Toggles the loading state of a button
 * @export
 * @param {HTMLElement} btn - The button element to be toggled
 * @param {boolean} isPending - Loading state
 * @param {string} [loadingText=UI_BUTTON_TEXT.SIGNIN_PENDING] - Text to show during loading
 * @return {void} 
 * @return {void} 
 */
export function setLoadingStateBtn(btn, isPending, loadingText = UI_BUTTON_TEXT.SIGNIN_PENDING) {
    if (!btn) return;

    if (isPending) {
        btn.dataset.originalText = btn.innerText;
        btn.innerText = loadingText;
    } else {
        btn.innerText = btn.dataset.originalText || UI_BUTTON_TEXT.SIGNIN_DEFAULT;
    }

    btn.disabled = isPending;
    btn.classList.toggle('is-pending', isPending);
}