
function updateLogos(theme) {
    const logos = document.querySelectorAll('.sidebar__logo, .access-logo');

    logos.forEach(logo => {
        if (theme === 'dark') {
            logo.src = 'assets/icons/logo-light.svg';
        } else {
            logo.src = 'assets/icons/logo-dark.svg';
        }
    });
}


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


export function applyTheme(theme = null) {
    const activeTheme = theme || localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme', activeTheme);

    updateLogos(activeTheme);
    syncToggles(activeTheme);
}


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