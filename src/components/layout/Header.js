// src/components/layout/header.js

import { performLogout, getCurrentUser, getInitials } from '../../services/auth-logic.js';

/**
 * @description Header component responsible for rendering the header and managing the dropdown menu and logout functionality.
 * @export
 * @class Header
 */
export class Header {
    /* ==========================================================================
       LIFECYCLE & INITIALIZATION
       ========================================================================== */
    constructor() {
        this.templatePath = './templates/header.html';
        this.titleId = 'js-header-title';
        this.actionTextId = 'js-header-action-text';
        this.actionBtnId = 'js-header-action';
    }

    /**
     * @description Renders the header by fetching the HTML template, inserting it into the specified anchor element, and initializing the header's dynamic content and dropdown functionality. It also updates the header title and action button based on the current page.
     * @param {string} anchorId - The ID of the anchor element where the header will be rendered.
     * @return {void} 
     * @memberof Header
     */
    async render(anchorId) {
        const anchor = document.getElementById(anchorId);
        if (!anchor) return;

        try {
            const response = await fetch(this.templatePath);
            const html = await response.text();
            anchor.innerHTML = html;

            this.updateTitle();
            this.updateActionButton();
            this.updateUserAvatar();
            this.manageAuthVisibility()
            this.initDropdown();
        } catch (err) {
            console.error('Error loading header template:', err);
        }
    }

    /* ==========================================================================
       UI & CONTENT UPDATES
       ========================================================================== */
    /**
     * @description Gets the current URL path to determine which page the user is on. ion button accordingly.
     * @return {string} - The current URL path in lowercase.
     * @memberof Header
     */
    getCurrentPath() {
        return window.location.pathname.toLowerCase();
    }

    /**
     * @description Updates the header title based on the current page by checking the URL path and setting the appropriate title text.
     * @return {void} 
     * @memberof Header
     */
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

    /**
     * @description Updates the action button in the header based on the current page. 
     * @return {void} 
     * @memberof Header
     */
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

    /* ==========================================================================
       INTERACTIVE ELEMENTS (Events)
       ========================================================================== */
    /**
     * @description Initializes the dropdown menu for the user avatar in the header, including event listeners for opening/closing the menu and handling logout functionality.
     * @memberof Header
     */
    initDropdown() {
        const trigger = document.getElementById('js-menu-trigger');
        const content = document.getElementById('js-menu-content');
        const logoutLink = document.getElementById('logoutLink');

        if (trigger && content) {
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                content.classList.toggle('is-active');
            });

            if (logoutLink) {
                logoutLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    performLogout();
                    window.location.href = 'index.html';
                });
            }

            content.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            document.addEventListener('click', () => {
                content.classList.remove('is-active');
            });
        }
    }

    manageAuthVisibility() {
        const user = getCurrentUser();
        const logoutLink = document.getElementById('logoutLink');
        const actionBtn = document.getElementById(this.actionBtnId);
        const divider = logoutLink?.previousElementSibling;

        if (!user) {
            if (logoutLink) logoutLink.style.display = 'none';
            if (divider && divider.tagName === 'HR') divider.style.display = 'none';
        }
    }

    /* ==========================================================================
       USER AVATAR
       ========================================================================== */
    /**
      * @description Updates the user avatar in the header based on the current user's initials.
      * @return {void} 
      * @memberof Header
      */
    updateUserAvatar() {
        const avatarBtn = document.getElementById('js-menu-trigger');
        if (!avatarBtn) return;

        const user = getCurrentUser();

        if (user && user.name) {
            avatarBtn.textContent = getInitials(user.name);
        } else {
            avatarBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            avatarBtn.classList.add('user-avatar--guest');
        }
    }
}