/**
 * Member Manager
 * Handles individual member actions: editing, deleting, and adding new members.
 */

import { getMemberById, updateMemberLocally, deleteMemberLocally, initAddMemberValidation, validateMemberForm } from './member.service.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { getInitials, setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { UI_MEMBER_BUTTON_TEXT } from '../../shared/utils/constants.js';
import { createEditModalHtml, createConfirmDeleteHtml, createAddMemberModalHtml } from './member.template.js';
import { getMemberDataFromModal, createNewMemberObject } from './member.utils.js';

/**
 * @description Manager class for member-specific interactions and modal logic.
 * @export
 * @class MemberManager
 */
export class MemberManager {
    constructor(onUpdateCallback) {
        this.onUpdate = onUpdateCallback;
    }

    /* ==========================================================================
       EDIT MEMBER
       ========================================================================== */

    /**
     * @description Opens the edit modal for a specific member.
     * @param {string} memberId 
     * @memberof MemberManager
     */
    handleEditClick(memberId) {
        const member = getMemberById(memberId);
        if (!member) return;

        const initials = getInitials(member.name);
        const displayRole = Array.isArray(member.roles) ? member.roles[0] : member.roles;
        const bodyHtml = createEditModalHtml(member, initials, displayRole);

        openModal("Edit Profile", bodyHtml);
        this.setupModalInteractions(memberId);
    }

    /**
     * @description Persists changes made in the edit modal.
     * @param {string} memberId 
     * @memberof MemberManager
     */
    async saveChanges(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');
        setLoadingStateBtn(saveBtn, true, UI_MEMBER_BUTTON_TEXT.SAVE_PENDING);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const updatedData = getMemberDataFromModal();
            updateMemberLocally(memberId, updatedData);
            closeModal();
            if (this.onUpdate) this.onUpdate();
        } catch (error) {
            console.error("Update failed:", error);
            setLoadingStateBtn(saveBtn, false, UI_MEMBER_BUTTON_TEXT.SAVE_DEFAULT);
        }
    }

    /* ==========================================================================
       DELETE MEMBER 
       ========================================================================== */

    /**
     * @description Shows a confirmation dialog before deleting a member.
     * @param {string} title 
     * @param {string} message 
     * @param {Function} onConfirm 
     * @memberof MemberManager
     */
    showConfirmDeleteMemberDialog(title, message, onConfirm) {
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
     * @description Handles the full deletion process of a member.
     * @param {string} memberId 
     * @memberof MemberManager
     */
    async handleDeleteMember(memberId) {
        const member = getMemberById(memberId);
        const name = member ? member.name : "this member";

        this.showConfirmDeleteMemberDialog(
            "Delete Member?",
            name,
            () => {
                deleteMemberLocally(memberId);
                if (this.onUpdate) this.onUpdate();
            }
        );
    }

    /* ==========================================================================
       ADD MEMBER 
       ========================================================================== */

    /**
     * @description Opens the modal to add a new member.
     * @memberof MemberManager
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
     * @description Processes and saves the new member from form data.
     * @param {Object} formData 
     * @memberof MemberManager
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

            if (this.onUpdate) this.onUpdate();
        } catch (error) {
            console.error("Save failed:", error);
            setLoadingStateBtn(submitBtn, false, UI_MEMBER_BUTTON_TEXT.ADD_DEFAULT);
        }
    }

    /* ==========================================================================
        EVENT LISTENERS & FIELD BEHAVIORS
        ========================================================================== */

    /**
    * @description Initializes modal interactions: button actions and field behaviors.
    * @param {string} memberId 
    * @memberof MemberManager
    */
    setupModalInteractions(memberId) {
        this.registerModalActions(memberId);
        this.registerFieldBehaviors();
    }

    /**
     * @description Registers click events for the modal buttons (Save, Delete).
     * @param {string} memberId 
     * @memberof MemberManager
     */
    registerModalActions(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');

        if (saveBtn) {
            saveBtn.onclick = () => this.saveChanges(memberId);
        }

        const deleteBtn = document.querySelector('.js-delete-member');
        if (deleteBtn) {
            deleteBtn.onclick = () => this.handleDeleteMember(memberId);
        }
    }

    /**
     * @description Controls the behavior of input fields (e.g., Enter key handling).
     * @memberof MemberManager
     */
    registerFieldBehaviors() {
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





}