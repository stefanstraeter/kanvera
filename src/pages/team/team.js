// src/pages/team.js

import { initDataService, getAllTeamMembers } from '../../services/data-service.js';
import { getInitials } from '../../services/auth-logic.js';
import { openModal, closeModal } from '../../components/shared/modal.js';
import { createMemberCardHtml, createEditModalHtml } from './team-template.js';

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

    /**
     * @description Saves the changes made to a team member's information
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamPage
     */
    async saveChanges(memberId) {
        const getFieldValue = (fieldName) => {
            const element = document.querySelector(`[data-field="${fieldName}"]`);
            return element ? element.innerText.trim() : "";
        };

        const updatedData = {
            name: getFieldValue('name'),
            roles: [getFieldValue('role')],
            email: getFieldValue('email'),
            phone: getFieldValue('phone')
        };

        const memberManager = await import('../../services/data-service.js');
        memberManager.updateMemberLocally(memberId, updatedData);

        closeModal();
        this.renderTeamGrid();
    }

    /**
     * @description Handles the deletion of a team member
     * @param {string} memberId - The ID of the team member
     * @return {void} 
     * @memberof TeamPage
     */
    async handleDeleteMember(memberId) {
        if (confirm("Möchtest du dieses Team-Mitglied wirklich löschen?")) {
            const memberManager = await import('../../services/data-service.js');

            memberManager.deleteMemberLocally(memberId);

            closeModal();
            this.renderTeamGrid();
        }
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

        grid.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                return;
            }
            const card = e.target.closest('.team-card--clickable');
            if (card) {
                const memberId = card.dataset.id;
                this.handleEditClick(memberId);
            }
        });
    }
}