// access-utils.js

import { UI_BUTTON_TEXT } from '../../utils/constants.js';

/* ==========================================================================
   INITIALIZATION OF GATEWAY
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

    if (!gateway || !slider) return;

    setupInitialState(gateway, loginWrapper);

    const navigations = [
        { btnId: 'toSignupBtn', view: 'signup', wrapper: signupWrapper },
        { btnId: 'toLoginArrow', view: 'login', wrapper: loginWrapper }
    ];

    navigations.forEach(({ btnId, view, wrapper }) => {
        document.getElementById(btnId)?.addEventListener('click', () => {
            slideTo(slider, view);
            adjustCardHeight(gateway, wrapper);
        });
    });
}

/* ==========================================================================
   HEADER ELEMENTS TOGGLE & DROPDOWN LOGIC
   ========================================================================== */
/**
 * @description Toggles the visibility of header elements based on the provided flag
 * @param {boolean} show - Indicates whether to show or hide the header elements
 */
function toggleHeaderElements(show) {
    const navText = document.querySelector('.access-nav-text');
    const toSignupBtn = document.getElementById('toSignupBtn');

    navText?.classList.toggle('u-invisible', !show);
    toSignupBtn?.classList.toggle('u-invisible', !show);
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
   GATEWAY SLIDER & CARD HEIGHT ADJUSTMENT
   ========================================================================== */
/**
 * @description Adjusts the height of the gateway element based on the height of the wrapper element
 * @param {*} gateway - The gateway element whose height needs to be adjusted
 * @param {*} wrapper - The wrapper element used to calculate the height
 */
function adjustCardHeight(gateway, wrapper) {
    if (!wrapper || !gateway) return;

    const contentHeight = wrapper.offsetHeight;
    const offset = window.innerWidth < 600 ? 10 : 0;

    gateway.style.height = `${contentHeight + offset}px`;
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
 * @description Slide the gateway slider to the specified view (login or signup) and toggle header elements accordingly
 * @param {HTMLElement} slider - The slider element to be moved
 * @param {string} view - The target view ('signup' or 'login')
 * @return {void} 
 */
function slideTo(slider, view) {
    if (!slider) return;
    const isSignup = view === 'signup';

    slider.style.transform = isSignup ? 'translateX(-50%)' : 'translateX(0%)';
    toggleHeaderElements(!isSignup);
}

/* ==========================================================================
   BUTTON LOADING STATE
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
export function setLoadingStateBtn(btn, isPending, loadingText = UI_BUTTON_TEXT.LOGIN_PENDING) {
    if (!btn) return;

    if (isPending) {
        btn.dataset.originalText = btn.innerText;
        btn.innerText = loadingText;
    } else {
        btn.innerText = btn.dataset.originalText || UI_BUTTON_TEXT.LOGIN_DEFAULT;
    }

    btn.disabled = isPending;
    btn.classList.toggle('is-pending', isPending);
}


