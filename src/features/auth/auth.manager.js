
import { UI_AUTH_BUTTON_TEXT } from '../../shared/utils/constants.js';

/* ==========================================================================
   INITIALIZATION OF AUTHENTICATION SLIDER, PASSWORD TOGGLES, AND DROPDOWN LOGIC
   ========================================================================== */

/**
 * @description Initializes the slider logic for the authentication flow by setting up event listeners for navigation buttons and adjusting the card height accordingly
 * @export
 */
export function initSliderLogic() {
    const authFlow = document.querySelector(".auth-flow");
    const slider = document.getElementById('authFlowStage');
    const signInWrapper = document.getElementById('signInWrapper');
    const signUpWrapper = document.getElementById('signUpWrapper');

    if (!authFlow || !slider) return;

    setupInitialState(authFlow, signInWrapper);

    const navigations = [
        { btnId: 'toSignUpBtn', view: 'signup', wrapper: signUpWrapper },
        { btnId: 'toSignInArrow', view: 'login', wrapper: signInWrapper }
    ];

    navigations.forEach(({ btnId, view, wrapper }) => {
        document.getElementById(btnId)?.addEventListener('click', () => {
            slideTo(slider, view);
            adjustCardHeight(authFlow, wrapper);
        });
    });
}

/* ==========================================================================
   HEADER DROPDOWN FLOW  
   ========================================================================== */

/**
 * @description Toggles the visibility of header elements based on the provided flag
 * @param {boolean} show - Indicates whether to show or hide the header elements
 */
function toggleHeaderElements(show) {
    const navText = document.querySelector('.auth-nav-text');
    const toSignUpBtn = document.getElementById('toSignUpBtn');

    navText?.classList.toggle('u-invisible', !show);
    toSignUpBtn?.classList.toggle('u-invisible', !show);
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
   AUTH FLOW UI  
   ========================================================================== */

/**
 * @description Adjusts the height of the authentication flow element based on the height of the wrapper element
 * @param {HTMLElement} authFlow - The authentication flow element whose height needs to be adjusted
 * @param {HTMLElement} wrapper - The wrapper element used to calculate the height
 */
function adjustCardHeight(authFlow, wrapper) {
    if (!wrapper || !authFlow) return;

    const contentHeight = wrapper.offsetHeight;
    const offset = window.innerWidth < 600 ? 10 : 0;

    authFlow.style.height = `${contentHeight + offset}px`;
}

/**
 * @description Sets up the initial state of the authentication flow by disabling transitions, adjusting height, and then re-enabling transitions for smooth sliding effect
 * @param {HTMLElement} authFlow - The authentication flow element
 * @param {HTMLElement} signInWrapper - The login wrapper element
 * @return {void}
 */
function setupInitialState(authFlow, signInWrapper) {
    if (!authFlow || !signInWrapper) return;

    authFlow.style.transition = 'none';
    adjustCardHeight(authFlow, signInWrapper);

    setTimeout(() => {
        authFlow.style.transition = 'height 0.4s ease-in-out';
    }, 50);
}

/**
 * @description Slide the authentication flow slider to the specified view (login or signup) and toggle header elements accordingly
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
