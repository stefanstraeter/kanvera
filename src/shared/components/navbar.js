
import { applyTheme } from '../utils/theme.js';
import { getCurrentUser } from '../../features/auth/auth.service.js';

/**
 * @description Navbar component responsible for rendering the sidebar navigation and highlighting the active link based on the current URL path.
 * @export
 * @class Navbar
 */
export class Navbar {
    /* ==========================================================================
       LIFECYCLE      
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
            let html = await response.text();
            const user = getCurrentUser();

            if (!user) {
                html = this.getGuestNavbarTemplate(html);
            }
            anchor.innerHTML = html;

            this.highlightActiveLink();
            applyTheme();
        } catch (error) {
            console.error('Error rendering navbar:', error);
        }
    }

    /* ==========================================================================
       NAVIGATION HIGHLIGHTING
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

    /* ==========================================================================
       GUEST NAVBAR TEMPLATE
       ========================================================================== */
    getGuestNavbarTemplate(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const navList = doc.querySelector('.sidebar__list');

        if (navList) {
            navList.innerHTML = `
                <li class="sidebar__item ">
                    <a href="index.html" class="nav-item">
                        <span class="nav-item__icon"><i class="fa-solid fa-arrow-right-to-bracket"></i></span>
                        To Sign Up
                    </a>
                </li>
            `;
        }
        return doc.body.innerHTML;
    }
}
