// src/main.js

import { initSplashScreen } from './utils/splash-screen.js';
import { Navbar } from './components/layout/navbar.js';
import { Header } from './components/layout/header.js';
import { initThemeListeners } from './utils/theme.js';
import { initPasswordToggles, initSliderLogic, initDropdownLogic } from './pages/access/access-utils.js';
import { initSignInLogic } from './pages/access/sign-in.js';
import { initPulsePage } from './pages/pulse/pulse.js';
import { TeamPage } from './pages/team/team.js'

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
async function init() {
    initThemeListeners();

    if (document.getElementById('gatewaySlider')) {
        initSplashScreen();
        initSliderLogic();
        initPasswordToggles();
        initSignInLogic();
    }

    if (document.getElementById('totalTasks')) {
        await initPulsePage();
    }

    if (document.getElementById('js-team-grid')) {
        const teamPage = new TeamPage();
        await teamPage.init();
    }

    if (document.getElementById('js-menu-trigger')) {
        initDropdownLogic();
    }

    await initLayout();
}

/* ==========================================================================
   LAYOUT RENDERING
   ========================================================================== */
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

/* ==========================================================================
   DOM READY EVENT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', init);