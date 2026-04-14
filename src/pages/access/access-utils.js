// access-utils.js

import { UI_BUTTON_TEXT } from '../../utils/constants.js';

/* ==========================================================================
   DROPDOWN & NAVIGATION UI
   ========================================================================== */
/**
 * @description Toggles the visibility of header elements based on the provided flag
 * @param {boolean} show - Indicates whether to show or hide the header elements
 */
function toggleHeaderElements(show) {
    const navText = document.querySelector('.access-nav-text');
    const toSignupBtn = document.getElementById('toSignupBtn');

    if (show) {
        navText?.classList.remove('u-invisible');
        toSignupBtn?.classList.remove('u-invisible');
    } else {
        navText?.classList.add('u-invisible');
        toSignupBtn?.classList.add('u-invisible');
    }
}

/**
 * @description Closes the dropdown menu by removing the 'is-active' class from the content element
 * @param {HTMLElement} content - The dropdown content element
 */
function closeMenu(content) {
    content.classList.remove('is-active');
}

/**
 * @description Toggles the dropdown menu visibility by adding or removing the 'is-active' class on the content element, and stops event propagation to prevent unintended side effects
 * @param {Event} event - The event object
 * @param {HTMLElement} content - The dropdown content element
 */
function toggleMenu(event, content) {
    event.stopPropagation();
    content.classList.toggle('is-active');
}

/**
 * @description Initializes the dropdown menu logic by setting up event listeners for the trigger, content, and document to handle opening and closing of the menu
 * @export
 * @return {void} 
 */
export function initDropdownLogic() {
    const trigger = document.getElementById('js-menu-trigger');
    const content = document.getElementById('js-menu-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', (event) => toggleMenu(event, content));
    content.addEventListener('click', (event) => event.stopPropagation());
    document.addEventListener('click', () => closeMenu(content));
}

/* ==========================================================================
   PASSWORD VISIBILITY TOGGLE
   ========================================================================== */
/**
 * @description Toggles Font Awesome classes and input type for password visibility
 * @param {HTMLInputElement} input - The password input element
 * @param {HTMLElement} icon - The icon element used to toggle visibility
 */
function togglePasswordVisibility(input, icon) {
    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');

}

/**
 * @description Initializes the password visibility toggle functionality by adding click event listeners to all password input fields and their associated icons
 * @export
 */
export function initPasswordToggles() {
    const passwordFields = document.querySelectorAll('input[type="password"]');

    passwordFields.forEach(input => {
        const group = input.closest('.field-group');
        const icon = group?.querySelector('.field-icon');

        if (!input || !icon) return;

        icon.style.cursor = 'pointer';

        icon.addEventListener('click', () => {
            togglePasswordVisibility(input, icon);
        });
    });
}

/* ==========================================================================
   GATEWAY SLIDER & CARD LOGIC
   ========================================================================== */
/**
 * @description Adjusts the height of the gateway element based on the height of the wrapper element
 * @param {*} gateway - The gateway element whose height needs to be adjusted
 * @param {*} wrapper - The wrapper element used to calculate the height
 */
function adjustCardHeight(gateway, wrapper) {
    if (wrapper && gateway) {

        const contentHeight = wrapper.getBoundingClientRect().height;
        const offset = window.innerWidth < 600 ? 10 : 0;

        gateway.style.height = `${contentHeight + offset}px`;
    }
}

/**
 * @description Sets up the initial state of the gateway slider by disabling transitions, adjusting height, and then re-enabling transitions for smooth sliding effect
 * @param {HTMLElement} gateway - The gateway element
 * @param {HTMLElement} loginWrapper - The login wrapper element
 * @return {void}
 */
function setupInitialState(gateway, loginWrapper) {
    if (!gateway || !loginWrapper) return;

    gateway.style.transition = 'none';
    adjustCardHeight(gateway, loginWrapper);

    setTimeout(() => {
        gateway.style.transition = 'height 0.4s ease-in-out';
    }, 50);
}

/**
 * @description Slides the gateway slider to the specified view (signup or login) and toggles header elements accordingly
 * @param {HTMLElement} slider - The slider element to be moved
 * @param {string} view - The target view ('signup' or 'login')
 * @return {void}
 */
function slideTo(slider, view) {
    if (!slider) return;

    if (view === 'signup') {
        slider.style.transform = 'translateX(-50%)';
        toggleHeaderElements(false);
    } else {
        slider.style.transform = 'translateX(0%)';
        toggleHeaderElements(true);
    }
}

/* ==========================================================================
   UI FEEDBACK
   ========================================================================== */

/**
 * @description Toggles the loading state of a button
 * @export
 * @param {HTMLElement} btn - The button element to be toggled
 * @param {boolean} isPending - Loading state
 * @param {string} [loadingText=UI_BUTTON_TEXT.LOGIN_PENDING] - Text to show during loading
 * @param {string} [originalText=UI_BUTTON_TEXT.LOGIN_DEFAULT] - Text to show after loading
 * @return {void} 
 */
export function setLoadingStateBtn(
    btn,
    isPending,
    loadingText = UI_BUTTON_TEXT.LOGIN_PENDING,
    originalText = UI_BUTTON_TEXT.LOGIN_DEFAULT
) {
    if (!btn) return;
    btn.disabled = isPending;
    btn.innerText = isPending ? loadingText : originalText;
    btn.style.opacity = isPending ? "0.5" : "1";
    btn.style.cursor = isPending ? "not-allowed" : "pointer";
}

/* ==========================================================================
   INITIALIZATION & EXPORT
   ========================================================================== */
/**
 * @description Initializes the slider logic for the gateway by setting up event listeners for navigation buttons and adjusting the card height accordingly
 * @export
 */
export function initSliderLogic() {
    const gateway = document.querySelector(".gateway");
    const slider = document.getElementById('gatewaySlider');
    const loginWrapper = document.getElementById('loginWrapper');
    const signupWrapper = document.getElementById('signupWrapper');
    const toSignupBtn = document.getElementById('toSignupBtn');
    const toLoginArrow = document.getElementById('toLoginArrow');

    setupInitialState(gateway, loginWrapper);

    toSignupBtn?.addEventListener('click', () => {
        slideTo(slider, 'signup');
        adjustCardHeight(gateway, signupWrapper);
    });

    toLoginArrow?.addEventListener('click', () => {
        slideTo(slider, 'login');
        adjustCardHeight(gateway, loginWrapper);
    });
}
