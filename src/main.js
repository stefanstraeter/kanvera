// src/main.js
import { Navbar } from './components/layout/Navbar.js';
import { Header } from './components/layout/Header.js';

async function initLayout() {
    const navbar = new Navbar();
    const header = new Header();

    // Wir laden beide parallel für beste Performance
    await Promise.all([
        navbar.render('js-sidebar-anchor'),
        header.render('js-header-anchor')
    ]);

    console.log("Layout erfolgreich geladen.");
}

// Globaler Startschuss
initLayout();

