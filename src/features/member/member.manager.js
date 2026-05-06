import { getMemberById, updateMemberLocally, deleteMemberLocally, initAddMemberValidation, validateMemberForm } from './member.service.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { getInitials, setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { UI_MEMBER_BUTTON_TEXT } from '../../shared/utils/constants.js';
import { createEditModalHtml, createConfirmDeleteHtml, createAddMemberModalHtml } from './member.template.js';
import { getMemberDataFromModal, createNewMemberObject } from './member.utils.js';

/**
 * @description Manager class for member interactions.
 */
export class MemberManager {
    constructor(onUpdateCallback) {
        this.onUpdate = onUpdateCallback;
    }

    /* ==========================================================================
       EDIT MEMBER FLOW
       ========================================================================== */

    /**
     * @description Handle the click event for editing a member.
     * @param {string} memberId - ID of the member to edit
     * @return {void} 
     * @memberof MemberManager
     */
    handleEditClick(memberId) {
        const member = getMemberById(memberId);
        if (!member) return;

        this.renderEditModal(member);
        this.setupModalInteractions(memberId);
    }

    /**
     * @description Render the edit modal for a member.
     * @param {Object} member - The member object to edit
     * @memberof MemberManager
     */
    renderEditModal(member) {
        const initials = getInitials(member.name);
        const role = Array.isArray(member.roles) ? member.roles[0] : member.roles;
        const html = createEditModalHtml(member, initials, role);

        openModal("Edit Profile", html);
    }

    /**
     * @description Handle the save action for editing a member.
     * @param {string} memberId - ID of the member to edit
     * @memberof MemberManager
     */
    async saveChanges(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');
        setLoadingStateBtn(saveBtn, true, UI_MEMBER_BUTTON_TEXT.SAVE_PENDING);

        try {
            await this.processUpdate(memberId);
            closeModal();
            this.notifyUpdate();
        } catch (error) {
            console.error("Update failed:", error);
            setLoadingStateBtn(saveBtn, false, UI_MEMBER_BUTTON_TEXT.SAVE_DEFAULT);
        }
    }

    /**
     * @description Process the update of a member's data.
     * @param {string} memberId - ID of the member to update
     * @memberof MemberManager
     */
    async processUpdate(memberId) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const updatedData = getMemberDataFromModal();

        updateMemberLocally(memberId, updatedData);
    }

    /* ==========================================================================
       DELETE MEMBER FLOW
       ========================================================================== */

    /**
     * @description Handle the delete action for a member, showing a confirmation dialog first.
     * @param {string} memberId - ID of the member to delete
     * @memberof MemberManager
     */
    handleDeleteMember(memberId) {
        const member = getMemberById(memberId);
        const name = member?.name || "this member";

        this.showConfirmDeleteDialog(name, () => this.processDeletion(memberId));
    }

    /**
     * @description Process the deletion of a member after confirmation.
     * @param {string} memberId - ID of the member to delete
     * @memberof MemberManager
     */
    processDeletion(memberId) {
        deleteMemberLocally(memberId);
        this.notifyUpdate();
    }

    /* ==========================================================================
       ADD MEMBER FLOW
       ========================================================================== */

    /**
     * @description Handle the click event for adding a new member, opening the add member modal.
     * @memberof MemberManager
     */
    handleAddMemberClick() {
        const html = createAddMemberModalHtml();

        openModal(
            "Add Member to Collective",
            html,
            (data) => this.saveNewMember(data),
            validateMemberForm
        );
        initAddMemberValidation();
    }

    /**
     * @description
     * @param {*} formData
     * @memberof MemberManager
     */
    async saveNewMember(formData) {
        const submitBtn = document.getElementById('js-add-member-form')?.querySelector('button[type="submit"]');

        setLoadingStateBtn(submitBtn, true, UI_MEMBER_BUTTON_TEXT.ADD_PENDING);

        try {
            await this.processCreation(formData);
            this.notifyUpdate();
        } catch (error) {
            console.error("Save failed:", error);
            setLoadingStateBtn(submitBtn, false, UI_MEMBER_BUTTON_TEXT.ADD_DEFAULT);
        }
    }

    /**
     * @description Process the creation of a new member.
     * @param {Object} formData - The data from the add member form
     * @memberof MemberManager
     */
    async processCreation(formData) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newMember = createNewMemberObject(formData);
        const newId = `member-${Date.now()}`;

        updateMemberLocally(newId, newMember);
    }

    /* ==========================================================================
        UI HELPERS & INTERACTION BINDING
        ========================================================================== */

    /**
     * @description Set up interactions for the modal, including action buttons and field behaviors.
     * @param {*} memberId
     * @memberof MemberManager
     */
    setupModalInteractions(memberId) {
        this.registerActionButtons(memberId);
        this.registerFieldBehaviors();
    }

    /**
     * @description Register the action buttons for a member, such as save and delete.
     * @param {string} memberId - ID of the member
     * @memberof MemberManager
     */
    registerActionButtons(memberId) {
        const saveBtn = document.querySelector('.js-save-inline');
        const deleteBtn = document.querySelector('.js-delete-member');

        if (saveBtn) saveBtn.onclick = () => this.saveChanges(memberId);
        if (deleteBtn) deleteBtn.onclick = () => this.handleDeleteMember(memberId);
    }

    /**
     * @description Register behaviors for input fields in the modal, such as submitting on Enter key press.
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

    /**
     * @description Show a confirmation dialog before deleting a member.
     * @param {string} message - The confirmation message to display
     * @param {Function} onConfirm - Callback function to execute if the user confirms
     * @memberof MemberManager
     */
    showConfirmDeleteDialog(message, onConfirm) {
        closeModal();

        setTimeout(() => {
            const html = createConfirmDeleteHtml(message);
            openModal("Delete Member?", html, null);
            this.bindConfirmDelete(onConfirm);
        }, 200);
    }

    /**
     * @description Bind the confirm delete button in the confirmation dialog to the provided callback function.
     * @param {Function} onConfirm - Callback function to execute if the user confirms
     * @memberof MemberManager
     */
    bindConfirmDelete(onConfirm) {
        const confirmBtn = document.querySelector('.js-confirm-delete-btn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                onConfirm();
                closeModal();
            };
        }
    }

    /**
     * @description Notify the parent component or application that an update has occurred, so it can refresh the member list or perform other necessary actions.
     * @memberof MemberManager
     */
    notifyUpdate() {
        if (this.onUpdate) this.onUpdate();
    }
}