
import { initState } from './core/state.js';

import { initSplashScreen } from './shared/utils/splash-screen.js';
import { initThemeListeners } from './shared/utils/theme.js';

import { Navbar } from './shared/components/navbar.js';
import { Header } from './shared/components/header.js';

import { getCurrentUser } from './features/auth/auth.service.js';
import { initPasswordToggles, initSliderLogic, initDropdownLogic } from './features/auth/auth.manager.js';
import { initSignInLogic } from './features/auth/sign-in.js';
import { PulseManager } from './features/pulse/pulse.manager.js';
import { TeamManager } from './features/team/team.manager.js';
import { BoardManager } from './features/board/board.manager.js';
import { InboxManager } from './features/inbox/inbox.manager.js';

/* ==========================================================================
   ROUTE GUARD
   ========================================================================== */
/**
 * @description Guards routes by checking if the user is authenticated.
 * @return {void} 
 */
function guardRoute() {
    const isAuthPage = document.getElementById('authFlowStage');
    const isStaticPage = document.body.dataset.page === 'static';
    if (isAuthPage || isStaticPage) return;

    const user = getCurrentUser();
    if (!user) {
        window.location.replace('index.html');
    }
}

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */

/**
 * @description Initializes the application by setting up route guards, theme listeners, loading layout components, and initializing feature managers based on the current page.
 * @return {Promise<void>} A promise that resolves when initialization is complete.
 */
async function init() {
    guardRoute();

    initThemeListeners();

    const isAuthPage = document.getElementById('authFlowStage');

    if (isAuthPage) {
        await initSplashScreen();
        initSliderLogic();
        initPasswordToggles();
        initSignInLogic();
    }

    await initState();

    const isStaticPage = !document.getElementById('js-header-anchor');
    if (isStaticPage && document.getElementById('js-menu-trigger')) {
        initDropdownLogic();
    }

    await initLayout();

    if (document.getElementById('totalTasks')) {
        const pulseManager = new PulseManager();
        pulseManager.init();
    }

    if (document.getElementById('js-team-grid')) {
        const teamManager = new TeamManager();
        teamManager.init();
    }

    if (document.getElementById('jsBoardColumns')) {
        const boardManager = new BoardManager();
        boardManager.init();
    }

    if (document.getElementById('js-inbox-list')) {
        const inboxManager = new InboxManager();
        inboxManager.init();
    }
}

/* ==========================================================================
   LAYOUT RENDERING
   ========================================================================== */

/**
 * @description Initializes the layout by rendering the navbar and header components if their respective anchor elements are present in the DOM.
 */
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