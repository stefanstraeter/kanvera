import { Navbar } from './components/layout/navbar.js';
import { Header } from './components/layout/header.js';
import { initThemeListeners } from './utils/theme.js';
import { initPasswordToggles, initSliderLogic, initDropdownLogic } from './pages/access/access-utils.js';
import { initSignInLogic } from './pages/access/sign-in.js';

async function init() {
    initThemeListeners();

    if (document.getElementById('gatewaySlider')) {
        initSliderLogic();
        initPasswordToggles();
        initSignInLogic();
    }

    if (document.getElementById('js-menu-trigger')) {
        initDropdownLogic();
    }

    await initLayout();
}


async function initLayout() {
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