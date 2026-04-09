import { applyTheme } from '../../utils/theme.js';

export class Navbar {
    constructor() {
        this.templatePath = './templates/sidebar.html';
    }

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