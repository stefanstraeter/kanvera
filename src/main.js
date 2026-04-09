import { Navbar } from './components/layout/navbar.js';
import { Header } from './components/layout/header.js';
import { initThemeListeners } from './utils/theme.js';

async function init() {
    initThemeListeners();

    const registerBtn = document.getElementById('toSignupHeader');
    const authSlider = document.getElementById('authSlider');

    if (registerBtn && authSlider) {
        registerBtn.addEventListener('click', () => {
            authSlider.classList.add('slide-to-signup');
        });
    }

    const sidebarAnchor = document.getElementById('js-sidebar-anchor');
    const headerAnchor = document.getElementById('js-header-anchor');

    if (sidebarAnchor || headerAnchor) {
        const navbar = new Navbar();
        const header = new Header();

        const promises = [];
        if (sidebarAnchor) promises.push(navbar.render('js-sidebar-anchor'));
        if (headerAnchor) promises.push(header.render('js-header-anchor'));

        await Promise.all(promises);
    }
}

document.addEventListener('DOMContentLoaded', init);