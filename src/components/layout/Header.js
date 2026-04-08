export class Header {
    constructor() {
        this.templatePath = './templates/header.html';
        this.titleId = 'js-header-title';
        this.actionTextId = 'js-header-action-text';
        this.actionBtnId = 'js-header-action';
    }

    async render(anchorId) {
        const anchor = document.getElementById(anchorId);
        if (!anchor) return;

        try {
            const response = await fetch(this.templatePath);
            const html = await response.text();
            anchor.innerHTML = html;

            this.updateTitle();
            this.updateActionButton();
            this.initDropdown();
        } catch (err) {
        }
    }

    getCurrentPath() {
        return window.location.pathname.toLowerCase();
    }

    updateTitle() {
        const titleElement = document.getElementById(this.titleId);
        if (!titleElement) return;

        const path = this.getCurrentPath();

        if (path.includes('pulse')) {
            titleElement.textContent = 'Daily Standup';
        } else if (path.includes('team')) {
            titleElement.textContent = 'Team Directory';
        } else if (path.includes('add-task')) {
            titleElement.textContent = 'Create New Issue';
        } else if (path.includes('board')) {
            titleElement.textContent = 'Development Sprint';
        } else if (path.includes('legal')) {
            titleElement.textContent = 'Legal Notice';
        } else if (path.includes('privacy')) {
            titleElement.textContent = 'Privacy Policy';
        } else if (path.includes('help')) {
            titleElement.textContent = 'Help & Guide';
        }
        else {
            titleElement.textContent = 'Kanvera Dev-Flow';
        }
    }

    updateActionButton() {
        const actionText = document.getElementById(this.actionTextId);
        const actionBtn = document.getElementById(this.actionBtnId);
        if (!actionText || !actionBtn) return;

        const path = this.getCurrentPath();

        if (path.includes('pulse')) {
            actionBtn.style.display = 'none';
        } else if (path.includes('team')) {
            actionText.textContent = 'Add Member';
        } else if (path.includes('board')) {
            actionText.textContent = 'Add Task';
        } else if (path.includes('add-task')) {
            actionText.textContent = 'Add Task';
        } else {
            actionBtn.style.display = 'none';
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