
import { performLogout, getCurrentUser } from '../../features/auth/auth.service.js';
import { getInitials } from '../utils/ui-helpers.js';

/**
 * @description Header component responsible for rendering the header and managing the dropdown menu and logout functionality.
 * @export
 * @class Header
 */
export class Header {
    /* ==========================================================================
       INITIALIZATION
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
            this.manageAuthVisibility();
            this.initDropdown();
        } catch (err) {
            console.error('Error loading header template:', err);
        }
    }

    /* ==========================================================================
       HEADER CONTENT      
       ========================================================================== */
    /**
     * @description Gets the current URL path to determine which page the user is on.
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
            titleElement.textContent = 'The Collective';
        } else if (path.includes('inbox')) {
            titleElement.textContent = 'Inbox';
        } else if (path.includes('board')) {
            titleElement.textContent = 'Development Sprint';
        } else if (path.includes('legal')) {
            titleElement.textContent = 'Legal Notice';
        } else if (path.includes('privacy')) {
            titleElement.textContent = 'Privacy Policy';
        } else if (path.includes('help')) {
            titleElement.textContent = 'Help & Guide';
        } else {
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
            actionBtn.classList.add('js-header-add-member');
        } else if (path.includes('board')) {
            actionText.textContent = 'Add Task';
            actionBtn.classList.add('js-header-add-task');
        } else if (path.includes('inbox')) {
            actionBtn.style.display = 'none';
        } else {
            actionBtn.style.display = 'none';
        }
    }

    /* ==========================================================================
       DROPDOWN      
       ========================================================================== */
    /**
     * @description Initializes the dropdown menu by setting up event listeners for toggling the menu visibility.
     */
    initDropdown() {
        const trigger = document.getElementById('js-menu-trigger');
        const content = document.getElementById('js-menu-content');

        if (!trigger || !content) return;

        this.setupDropdownToggle(trigger, content);
        this.setupExternalClose(content);
        this.setupLogout();
    }

    /**
     * @description Sets up the event listener for toggling the dropdown menu visibility when the trigger element is clicked.
     * @param {HTMLElement} trigger - The element that triggers the dropdown menu.
     * @param {HTMLElement} content - The dropdown menu content element.
     * @memberof Header
     */
    setupDropdownToggle(trigger, content) {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            content.classList.toggle('is-active');
        });

        content.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    /**
     * @description Handles closing the dropdown menu when clicking outside of it.
     * @param {HTMLElement} content - The dropdown menu content element.
     * @memberof Header
     */
    setupExternalClose(content) {
        document.addEventListener('click', () => {
            content.classList.remove('is-active');
        });
    }

    /**
     * @description Binds the logout functionality to the logout link in the dropdown menu.
     * @memberof Header
     */
    setupLogout() {
        const logoutLink = document.getElementById('logoutLink');
        if (!logoutLink) return;

        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            performLogout();
        });
    }

    /**
     * @description Manages the visibility of authentication-related elements in the header based on the user's login status.
     * @memberof Header
     */
    manageAuthVisibility() {
        const user = getCurrentUser();
        const logoutLink = document.getElementById('logoutLink');
        const divider = logoutLink?.previousElementSibling;

        if (!user) {
            if (logoutLink) logoutLink.style.display = 'none';
            if (divider && divider.tagName === 'HR') divider.style.display = 'none';
        }
    }

    /* ==========================================================================
       AVATAR      
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
