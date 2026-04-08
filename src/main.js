// src/main.js
import { Navbar } from './components/layout/navbar.js';
import { Header } from './components/layout/header.js';

async function initLayout() {
    const navbar = new Navbar();
    const header = new Header();

    await Promise.all([
        navbar.render('js-sidebar-anchor'),
        header.render('js-header-anchor')
    ]);
}

initLayout();

