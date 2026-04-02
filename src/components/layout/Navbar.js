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
        } catch (error) {
            console.error("Navbar konnte nicht geladen werden", error);
        }
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-item');

        links.forEach(link => {
            // Wir prüfen, ob der href im aktuellen Pfad enthalten ist
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('nav-item--active');
            }
        });
    }
}