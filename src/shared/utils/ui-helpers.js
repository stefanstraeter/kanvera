
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
 * @description Sets the loading state of a button.
 * @export
 * @param {HTMLElement} btn - The button element to be toggled.
 * @param {boolean} isPending - Loading state.
 * @param {string} [loadingText] - Text to show during loading.
 * @return {void}
 */
export function setLoadingStateBtn(btn, isPending, loadingText) {
    if (!btn) return;

    if (isPending) {
        btn.dataset.originalText = btn.innerText;
        btn.innerText = loadingText || btn.innerText;
    } else {
        btn.innerText = btn.dataset.originalText || btn.innerText;
    }

    btn.disabled = isPending;
    btn.classList.toggle('is-pending', isPending);
}

/**
 * @description Handles the asynchronous action of a button, showing a loading state while the action is in progress and reverting it back once done.
 * @export
 * @param {HTMLElement} btn - The button element to be toggled.
 * @param {Function} callback - The asynchronous function to be executed.
 * @param {Object} texts - An object containing button text for different states.
 * @return {Promise<void>} A promise that resolves when the action is complete.
 */
export async function handleAsyncButtonAction(btn, callback, texts) {
    if (!btn) return;

    const pendingText = texts.SAVE_PENDING || texts.SIGNIN_PENDING || texts.PENDING || "Loading...";
    setLoadingStateBtn(btn, true, pendingText);

    try {
        await callback();
    } catch (error) {
        setLoadingStateBtn(btn, false);
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

/* ==========================================================================
   TOAST FEEDBACK
   ========================================================================== */

/**
 * @description Shows a temporary toast message and removes it automatically.
 * @export
 * @param {string} message - Message to show.
 * @param {Object} [options={}] - Optional toast settings.
 * @param {number} [options.duration=1800] - Auto close time in milliseconds.
 * @param {string} [options.type='success'] - Visual style modifier (success|info|warning).
 * @return {void}
 */
export function showToast(message, options = {}) {
    if (!message) return;

    const { duration = 1800, type = 'success' } = options;
    const existingToast = document.querySelector('.app-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `app-toast app-toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
    });

    window.setTimeout(() => {
        toast.classList.remove('is-visible');
        window.setTimeout(() => toast.remove(), 220);
    }, duration);
}
