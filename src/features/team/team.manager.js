// src/features/team/team.manager.js

/**
 * Team Manager
 * Orchestrates the team page rendering and delegates member actions to MemberManager.
 */

import { getAllTeamMembers } from './team.service.js';
import { showTeamWrapper } from './team.utils.js';
import { getInitials } from '../../shared/utils/ui-helpers.js';
import { createMemberCardHtml } from '../member/member.template.js';
import { MemberManager } from '../member/member.manager.js';


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
     * @description Initializes the team page by rendering the grid and attaching events.
     * @memberof TeamManager
     */
    init() {
        this.renderTeamGrid();
        this.initEventListeners();
        showTeamWrapper();
    }

    /* ==========================================================================
       RENDERING TEAM GRID
       ========================================================================== */

    /**
     * @description Renders the team grid by generating HTML for each member card.
     * @memberof TeamManager
     */
    renderTeamGrid() {
        const gridElement = document.getElementById(this.gridId);
        if (!gridElement) return;

        const teamMembers = getAllTeamMembers();

        gridElement.innerHTML = teamMembers.map(member => {
            const initials = getInitials(member.name);
            const displayRole = Array.isArray(member.roles) ? member.roles[0] : member.roles;
            return createMemberCardHtml(member, initials, displayRole);
        }).join('');

        this.setupAvatarFallbacks(gridElement);
    }

    /* ==========================================================================
       AVATAR INITIALIZATION & FALLBACKS
       ========================================================================== */

    /**
     * @description Scans for avatar images and initializes loading fallbacks.
     * @param {HTMLElement} scope - The container to search within.
     * @memberof TeamManager
     */
    setupAvatarFallbacks(scope) {
        const avatars = scope.querySelectorAll('[data-avatar-image]');
        avatars.forEach(img => this.initAvatarLoading(img));
    }

    /**
     * @description Handles the visual toggle between avatar image and initials placeholder.
     * @param {HTMLImageElement} img - The image element to monitor.
     * @memberof TeamManager
     */
    initAvatarLoading(img) {
        const placeholder = img.parentElement?.querySelector('[data-avatar-placeholder]');
        if (!placeholder) return;

        const toggleUI = (isLoaded) => {
            img.classList.toggle('team-card__avatar-image--hidden', !isLoaded);
            placeholder.classList.toggle('team-card__avatar-placeholder--hidden', isLoaded);
        };

        toggleUI(false);

        if (img.complete && img.naturalWidth > 0) {
            return toggleUI(true);
        }

        img.addEventListener('load', () => toggleUI(true), { once: true });
        img.addEventListener('error', () => toggleUI(false), { once: true });
    }

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */

    /**
     * @description Initializes event listeners for the team page, including member card interactions and header actions.
     * @memberof TeamManager
     */
    initEventListeners() {
        this.registerGridInteractions();
        this.registerHeaderActions();
    }

    /**
     * @description Registers interactions for the team grid (event delegation).
     * @memberof TeamManager
     */
    registerGridInteractions() {
        const grid = document.getElementById(this.gridId);
        if (!grid) return;

        grid.addEventListener('click', (event) => {
            // Ignoriere Klicks auf Links (Email/Telefon)
            if (event.target.closest('a')) return;

            const card = event.target.closest('.team-card--clickable');
            if (card) {
                const memberId = card.dataset.id;
                this.memberManager.handleEditClick(memberId);
            }
        });
    }

    /**
     * @description Registers global actions such as the "Add Member" button.
     * @memberof TeamManager
     */
    registerHeaderActions() {
        const addBtn = document.querySelector('.js-header-add-member');
        if (addBtn) {
            addBtn.onclick = () => this.memberManager.handleAddMemberClick();
        }
    }
}