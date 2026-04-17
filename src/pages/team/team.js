// src/pages/team.js

import { initDataService, getAllTeamMembers, updateMemberLocally } from '../../services/data-service.js';
import { getInitials } from '../../services/auth-logic.js';
import { openModal, closeModal } from '../../components/shared/modal.js';
import { createMemberCardHtml, createEditModalHtml, createConfirmDeleteHtml, createAddMemberModalHtml } from './team-template.js';
import { getMemberDataFromModal, createNewMemberObject } from './team-utils.js';

/**
 * @description Page class for the Team page.
 * @export
 * @class TeamPage
 */
export class TeamPage {
    constructor() {
        this.gridId = 'js-team-grid';
    }

    async init() {
        await initDataService();
        this.renderTeamGrid();
        this.initEventListeners();
    }

    /* ==========================================================================
       RENDERING TEAM GRID
       ========================================================================== */
    /**
     * @description Render the team grid by fetching all team members and generating HTML for each member card, then inserting it into the DOM
     * @export
     * @return {void} 
     * @memberof TeamPage
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
    }

    /* ==========================================================================
       TEAM CARD - EDIT & DELETE
       ========================================================================== */
    /**
     * @description Handles the click event on a team member card, opening the edit modal
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamPage
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
     * @memberof TeamPage
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


    async saveChanges(memberId) {
        const updatedData = getMemberDataFromModal();

        updateMemberLocally(memberId, updatedData);
        closeModal();

        this.renderTeamGrid();
    }

    /**
     * @description  Shows a confirmation dialog before deleting a team member, and executes the provided callback if confirmed
     * @param {string} title - Title of the confirmation dialog
     * @param {string} message - The text content (e.g., the name of the member)
     * @param {Function} onConfirm - The action to perform when the DELETE button is clicked
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
     * @description  Handles the deletion process for a team member
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamPage
     */
    async handleDeleteMember(memberId) {
        const memberManager = await import('../../services/data-service.js');
        const member = memberManager.getAllTeamMembers().find(m => m.id === memberId);
        const name = member ? member.name : "this member";

        this.showConfirmDialog(
            "Delete Member?",
            name,
            () => {
                memberManager.deleteMemberLocally(memberId);
                this.renderTeamGrid();
            }
        );
    }

    /* ==========================================================================
       ADD MEMBER LOGIC
       ========================================================================== */
    /**
     * @description Öffnet das Modal für einen neuen Member
     */
    handleAddMemberClick() {
        const bodyHtml = createAddMemberModalHtml();

        // Nutzt deine Modal-Logik: openModal(title, body, onSaveCallback)
        openModal("Add Member to Collective", bodyHtml, (data) => {
            this.saveNewMember(data);
        });
    }

    async saveNewMember(formData) {
        const newMember = createNewMemberObject(formData);
        const newId = `member-${Date.now()}`;

        updateMemberLocally(newId, newMember);
        this.renderTeamGrid();
    }

    /* ==========================================================================
       EVENTS
       ========================================================================== */
    /**
     * @description Initializes the event listeners for the team page
     * @return {void} 
     * @memberof TeamPage
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