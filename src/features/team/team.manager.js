// src/features/team/team.manager.js

/**
 * Team Manager
 * Orchestrates the team page rendering and member interactions
 */

import { getCurrentUser } from '../auth/auth.service.js';
import { getAllTeamMembers, updateMemberLocally, deleteMemberLocally, initAddMemberValidation, validateMemberForm } from './team.service.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { getInitials, setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { UI_MEMBER_BUTTON_TEXT } from '../../shared/utils/constants.js';
import { createMemberCardHtml } from './team-card.template.js';
import { createEditModalHtml, createConfirmDeleteHtml, createAddMemberModalHtml } from './team-modal.template.js';
import { getMemberDataFromModal, createNewMemberObject } from './team.utils.js';

/**
 * @description Page class for the Team page.
 * @export
 * @class TeamManager
 */
export class TeamManager {
    constructor() {
        this.gridId = 'js-team-grid';
    }

    init() {
        this.renderTeamGrid();
        this.initEventListeners();
        this.showTeamWrapper();
    }

    /* ==========================================================================
       RENDERING TEAM GRID
       ========================================================================== */

    /**
     * @description Render the team grid by fetching all team members and generating HTML for each member card, then inserting it into the DOM
     * @export
     * @return {void} 
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

    /**
     * @description Sets up avatar fallbacks for all images within the given scope.
     * @param {HTMLElement} scope - The container element to search for avatar images.
     * @memberof TeamManager
     */
    setupAvatarFallbacks(scope) {
        const avatars = scope.querySelectorAll('[data-avatar-image]');
        avatars.forEach(img => this.initAvatarLoading(img));
    }

    /**
     * @description Initializes the avatar loading process, handling the display of the image and its placeholder.
     * @param {HTMLImageElement} img - The avatar image element.
     * @return {void} 
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

    /**
     * @description Show the team wrapper by adding the 'is-visible' class to it, making the content visible to the user
     * @memberof TeamManager
     */
    showTeamWrapper() {
        const wrapper = document.querySelector('.team-wrapper');
        if (wrapper) {
            wrapper.classList.add('is-visible');
        }
    }

    /* ==========================================================================
       TEAM CARD - EDIT & DELETE
       ========================================================================== */

    /**
     * @description Handles the click event on a team member card, opening the edit modal
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamManager
     */
    handleEditClick(memberId) {
        const members = getAllTeamMembers();
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        const initials = getInitials(member.name);
        const displayRole = Array.isArray(member.roles) ? member.roles[0] : member.roles;
        const bodyHtml = createEditModalHtml(member, initials, displayRole);

        openModal("Edit Profile", bodyHtml);
        this.setupModalInteractions(memberId);
    }

    /**
     * @description Sets up the interactions for the modal, including save and delete buttons, and enter-key handling
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamManager
     */
    setupModalInteractions(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');
        if (saveBtn) {
            saveBtn.onclick = () => this.saveChanges(memberId);
        }

        const deleteBtn = document.querySelector('.js-delete-member');
        if (deleteBtn) {
            deleteBtn.onclick = () => this.handleDeleteMember(memberId);
        }

        const fields = document.querySelectorAll('.js-edit-field');
        fields.forEach(field => {
            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    field.blur();
                }
            });
        });
    }

    /**
     * @description Save changes for a team member with loading state
     * @param {string} memberId - The ID of the team member
     * @memberof TeamManager
     */
    async saveChanges(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');

        setLoadingStateBtn(saveBtn, true, UI_MEMBER_BUTTON_TEXT.SAVE_PENDING);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const updatedData = getMemberDataFromModal();

            updateMemberLocally(memberId, updatedData);
            closeModal();
            this.renderTeamGrid();

        } catch (error) {
            console.error("Update failed:", error);
            setLoadingStateBtn(saveBtn, false, UI_MEMBER_BUTTON_TEXT.SAVE_DEFAULT);
        }
    }

    /**
     * @description Shows a confirmation dialog before deleting a team member, and executes the provided callback if confirmed
     * @param {string} title - Title of the confirmation dialog
     * @param {string} message - The text content (e.g., the name of the member)
     * @param {Function} onConfirm - The action to perform when the DELETE button is clicked
     * @memberof TeamManager
     */
    showConfirmDialog(title, message, onConfirm) {
        closeModal();

        setTimeout(() => {
            const bodyHtml = createConfirmDeleteHtml(message);
            openModal(title, bodyHtml, null);
            const confirmBtn = document.querySelector('.js-confirm-delete-btn');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    onConfirm();
                    closeModal();
                };
            }
        }, 200);
    }

    /**
     * @description Handles the deletion process for a team member
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamManager
     */
    async handleDeleteMember(memberId) {
        const member = getAllTeamMembers().find(m => m.id === memberId);
        const name = member ? member.name : "this member";

        this.showConfirmDialog(
            "Delete Member?",
            name,
            () => {
                deleteMemberLocally(memberId);
                this.renderTeamGrid();
            }
        );
    }

    /* ==========================================================================
       ADD MEMBER LOGIC
       ========================================================================== */

    /**
     * @description Opens the modal for adding a new member
     * @memberof TeamManager
     */
    handleAddMemberClick() {
        const bodyHtml = createAddMemberModalHtml();

        openModal(
            "Add Member to Collective",
            bodyHtml, (data) => this.saveNewMember(data),
            validateMemberForm
        );
        initAddMemberValidation();
    }

    /**
     * @description Saves a new team member
     * @param {*} formData - The data from the add member form
     * @memberof TeamManager
     */
    async saveNewMember(formData) {
        const form = document.getElementById('js-add-member-form');
        const submitBtn = form?.querySelector('button[type="submit"]');

        setLoadingStateBtn(submitBtn, true, UI_MEMBER_BUTTON_TEXT.ADD_PENDING);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newMember = createNewMemberObject(formData);
            const newId = `member-${Date.now()}`;
            updateMemberLocally(newId, newMember);
            this.renderTeamGrid();

        } catch (error) {
            console.error("Save failed:", error);
            setLoadingStateBtn(submitBtn, false, UI_MEMBER_BUTTON_TEXT.ADD_DEFAULT);
        }
    }

    /* ==========================================================================
       EVENTS LISTENERS
       ========================================================================== */

    /**
     * @description Initializes the event listeners for the team page
     * @return {void} 
     * @memberof TeamManager
     */
    initEventListeners() {
        const grid = document.getElementById(this.gridId);
        if (!grid) return;

        grid.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                return;
            }
            const card = event.target.closest('.team-card--clickable');
            if (card) {
                const memberId = card.dataset.id;
                this.handleEditClick(memberId);
            }
        });

        const addBtn = document.querySelector('.js-header-add-member');
        if (addBtn) {
            addBtn.onclick = () => this.handleAddMemberClick();
        }
    }
}
