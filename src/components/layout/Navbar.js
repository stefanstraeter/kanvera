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
            this.applyCurrentTheme();
            this.initThemeToggles();
        } catch (error) {
            console.error("Navbar konnte nicht geladen werden:", error);
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

    applyCurrentTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateLogo(savedTheme);
    }

    updateLogo(theme) {
        const logo = document.querySelector('.sidebar__logo');
        if (logo) {
            logo.src = theme === 'dark' ? 'assets/icons/logo-light.svg' : 'assets/icons/logo-dark.svg';
        }
    }

    initThemeToggles() {
        const setup = () => {
            const toggles = document.querySelectorAll('#theme-toggle, #theme-toggle-dropdown');
            const currentTheme = localStorage.getItem('theme') || 'light';

            toggles.forEach(toggle => {
                toggle.checked = (currentTheme === 'dark');
                toggle.onclick = () => {
                    const newTheme = toggle.checked ? 'dark' : 'light';
                    this.setTheme(newTheme);
                };
            });
        };
        setup();
        setTimeout(setup, 100);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateLogo(theme);
        const allToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-dropdown');
        allToggles.forEach(t => t.checked = (theme === 'dark'));
    }
}