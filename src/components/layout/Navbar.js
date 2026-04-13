// src/components/layout/navbar.js

import { applyTheme } from '../../utils/theme.js';

/**
 * @description Navbar component responsible for rendering the sidebar navigation and highlighting the active link based on the current URL path. 
 * @export
 * @class Navbar 
 */
export class Navbar {
    /* ==========================================================================
       LIFECYCLE & RENDERING
       ========================================================================== */
    constructor() {
        this.templatePath = './templates/sidebar.html';
    }

    /**
     * @description Renders the navbar, highlights the active link, and ensures the current theme is applied.
     * @param {string} anchorId - The ID of the element to render the navbar into.
     */
    async render(anchorId) {
        const anchor = document.getElementById(anchorId);
        if (!anchor) return;

        try {
            const response = await fetch(this.templatePath);
            const html = await response.text();
            anchor.innerHTML = html;

            this.highlightActiveLink();
            applyTheme();
        } catch (error) {
        }
    }

    /* ==========================================================================
       NAVIGATION LOGIC
       ========================================================================== */
    /**
     * @description Highlights the active link in the navbar based on the current URL path.
     */
    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-item');

        links.forEach(link => {
            const href = link.getAttribute('href');

            if (href && currentPath.includes(href)) {
                link.classList.add('nav-item--active');
            }
        });
    }
}