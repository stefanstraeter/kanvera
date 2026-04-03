export class Header {
    constructor() {

        this.templatePath = './templates/header.html';
        this.titleId = 'js-header-title';
    }

    async render(anchorId) {
        const anchor = document.getElementById(anchorId);
        if (!anchor) return;

        try {
            const response = await fetch(this.templatePath);
            const html = await response.text();
            anchor.innerHTML = html;

            this.updateTitle();
            this.initDropdown();
        } catch (err) {
            console.error("Header konnte nicht geladen werden:", err);
        }
    }

    updateTitle() {
        const titleElement = document.getElementById(this.titleId);
        if (!titleElement) return;

        const path = window.location.pathname.toLowerCase();

        if (path.includes('pulse')) {
            titleElement.textContent = 'Daily Standup';
        } else if (path.includes('team')) {
            titleElement.textContent = 'Team Directory';
        } else if (path.includes('add-task')) {
            titleElement.textContent = 'Create New Issue';
        } else if (path.includes('board')) {
            titleElement.textContent = 'Development Sprint';
        } else {

            titleElement.textContent = 'Kanvera Dev-Flow';
        }
    }

    initDropdown() {
        const trigger = document.getElementById('js-menu-trigger');
        const content = document.getElementById('js-menu-content');

        if (trigger && content) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                content.classList.toggle('is-active');
            });

            document.addEventListener('click', () => {
                content.classList.remove('is-active');
            });
        }
    }
}