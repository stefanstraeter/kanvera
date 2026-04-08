// src/main.js
import { Navbar } from './components/layout/Navbar.js';
import { Header } from './components/layout/Header.js';

async function initLayout() {
    const navbar = new Navbar();
    const header = new Header();

    await Promise.all([
        navbar.render('js-sidebar-anchor'),
        header.render('js-header-anchor')
    ]);
}

initLayout();

