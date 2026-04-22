// src/shared/utils/theme.js

/* ==========================================================================
   THEME UI HELPERS
   ========================================================================== */
/**
 * @description Updates the logos based on the current theme.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @returns {void}
 */
function updateLogos(theme) {
    const logos = document.querySelectorAll('.sidebar__logo, .access-logo, .header__logo-img, #headerLogoFinal');

    logos.forEach(logo => {
        if (theme === 'dark') {
            logo.src = 'assets/icons/logo-light.svg';
        } else {
            logo.src = 'assets/icons/logo-dark.svg';
        }
    });
}

/**
 * @description Synchronizes the state of all theme toggle elements (checkboxes) to match the current theme.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @returns {void}
 */
function syncToggles(theme) {
    const toggles = document.querySelectorAll('#theme-toggle, #theme-toggle-dropdown');

    toggles.forEach(toggle => {
        if (theme === 'dark') {
            toggle.checked = true;
        } else {
            toggle.checked = false;
        }
    });
}

/* ==========================================================================
   THEME CORE LOGIC
   ========================================================================== */
/**
 * @description Applies the specified theme to the application by setting a data attribute on the document root, updating logos, and synchronizing toggle states.
 * @returns {void}
 * @export
 * @param {string} [theme=null] - The theme to apply ('light' or 'dark').
 */
export function applyTheme(theme = null) {
    const activeTheme = theme || localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', activeTheme);

    updateLogos(activeTheme);
    syncToggles(activeTheme);
}

/**
 * @description Initializes event listeners for theme toggle elements and applies the current theme on page load.
 * @export
 */
export function initThemeListeners() {
    document.addEventListener('change', (event) => {
        const element = event.target;

        if (element.id === 'theme-toggle' || element.id === 'theme-toggle-dropdown') {
            const newTheme = element.checked ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
    applyTheme();
}
