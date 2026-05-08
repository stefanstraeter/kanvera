import { getAllTeamMembers } from './team.service.js';
import { showTeamWrapper } from './team.utils.js';

import { MemberManager } from '../member/member.manager.js';

import { getInitials } from '../../shared/utils/ui-helpers.js';

import { createMemberCardHtml } from '../member/member.template.js';

/**
 * @description Page class for managing the team view and member grid.
 * @export
 * @class TeamManager
 */
export class TeamManager {
    constructor() {
        this.gridId = 'js-team-grid';
        this.memberManager = new MemberManager(() => this.renderTeamGrid());
    }

    /**
     * @description Initializes the team manager by rendering the grid and setting up event listeners.
     * @memberof TeamManager
     */
    init() {
        this.renderTeamGrid();
        this.initEventListeners();
        showTeamWrapper();
    }

    /* ==========================================================================
       RENDERING
       ========================================================================== */

    /**
     * @description Renders the team grid by fetching members and updating the DOM.
     * @return {void} 
     * @memberof TeamManager
     */
    renderTeamGrid() {
        const gridElement = document.getElementById(this.gridId);
        if (!gridElement) return;

        const teamMembers = getAllTeamMembers();
        this.updateGridContent(gridElement, teamMembers);
        this.setupAvatarFallbacks(gridElement);
    }

    /**
     * @description Updates the grid content with member cards based on the provided members array.
     * @param {*} gridElement - The DOM element representing the team grid.
     * @param {*} members - An array of team member objects to display in the grid.
     * @memberof TeamManager
     */
    updateGridContent(gridElement, members) {
        gridElement.innerHTML = members.map(member => {
            const initials = getInitials(member.name);
            const role = this.getFirstRole(member.roles);
            return createMemberCardHtml(member, initials, role);
        }).join('');
    }

    /**
     * @description
     * @param {*} roles
     * @return {*} 
     * @memberof TeamManager
     */
    getFirstRole(roles) {
        return Array.isArray(roles) ? roles[0] : roles;
    }

    /* ==========================================================================
       AVATAR LOGIC UI Task
       ========================================================================= */

    /**
     * @description Sets up avatar image loading with fallbacks for all avatar images within the given scope.
     * @param {HTMLElement} scope - The DOM element within which to search for avatar images.
     * @memberof TeamManager
     */
    setupAvatarFallbacks(scope) {
        const avatars = scope.querySelectorAll('[data-avatar-image]');
        avatars.forEach(img => this.initAvatarLoading(img));
    }

    /**
     * @description Initializes avatar image loading by checking if the image is already loaded or setting up event listeners for load and error events.
     * @param {HTMLImageElement} img - The avatar image element to initialize.
     * @return {void} 
     * @memberof TeamManager
     */
    initAvatarLoading(img) {
        const placeholder = img.parentElement?.querySelector('[data-avatar-placeholder]');
        if (!placeholder) return;

        if (img.complete && img.naturalWidth > 0) {
            this.showAvatarImage(img, placeholder);
            return;
        }
        this.bindAvatarLoadEvents(img, placeholder);
    }

    /**
     * @description Binds load and error events to the avatar image to handle displaying the image or fallback placeholder.
     * @param {HTMLImageElement} img - The avatar image element.
     * @param {HTMLElement} placeholder - The placeholder element to show if the image fails to load.
     * @memberof TeamManager
     */
    bindAvatarLoadEvents(img, placeholder) {
        img.addEventListener('load', () => this.showAvatarImage(img, placeholder), { once: true });
        img.addEventListener('error', () => this.showPlaceholder(img, placeholder), { once: true });
    }

    /**
     * @description Shows the avatar image and hides the placeholder when the image loads successfully.
     * @param {HTMLImageElement} img - The avatar image element.
     * @param {HTMLElement} placeholder - The placeholder element to hide when the image loads.
     * @memberof TeamManager
     */
    showAvatarImage(img, placeholder) {
        img.classList.remove('team-card__avatar-image--hidden');
        placeholder.classList.add('team-card__avatar-placeholder--hidden');
    }

    /**
     * @description Shows the placeholder and hides the avatar image when the image fails to load.
     * @param {HTMLImageElement} img - The avatar image element.
     * @param {HTMLElement} placeholder - The placeholder element to show when the image fails to load.
     * @memberof TeamManager
     */
    showPlaceholder(img, placeholder) {
        img.classList.add('team-card__avatar-image--hidden');
        placeholder.classList.remove('team-card__avatar-placeholder--hidden');
    }

    /* ==========================================================================
       EVENT LISTENERS 
       ========================================================================== */

    /**
     * @description Initializes event listeners for the team grid and header actions.
     * @memberof TeamManager
     */
    initEventListeners() {
        this.registerGridClicks();
        this.registerHeaderActions();
    }

    /**
     * @description Registers click event listeners on the team grid to handle clicks on member cards while ignoring clicks on links.
     * @memberof TeamManager
     */
    registerGridClicks() {
        const grid = document.getElementById(this.gridId);
        grid?.addEventListener('click', (event) => this.handleGridClick(event));
    }


    /**
     * @description Handles click events on the grid, checking for links and clickable cards.
     * @param {MouseEvent} event - The click event.
     * @memberof TeamManager
     */
    handleGridClick(event) {
        if (event.target.closest('a')) return;

        const card = event.target.closest('.team-card--clickable');
        if (card) {
            this.processEditAction(card.dataset.id);
        }
    }

    /**
     * @description Processes the edit action for a team member.
     * @param {string} memberId - The ID of the member to edit.
     * @memberof TeamManager
     */
    processEditAction(memberId) {
        this.memberManager.handleEditClick(memberId);
    }

    /**
     * @description Registers click event listeners for header actions, such as adding a new team member.
     * @memberof TeamManager
     */
    registerHeaderActions() {
        const addBtn = document.querySelector('.js-header-add-member');
        if (addBtn) {
            addBtn.onclick = () => this.memberManager.handleAddMemberClick();
        }
    }
}