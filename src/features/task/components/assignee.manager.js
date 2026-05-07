import { updateTaskLocally, getTaskById } from '../task.service.js';
import { getState, convertToArrayList } from '../../../core/state.js';
import { generateAvatarsHtml } from '../../board/board.utils.js';
import { createDropdownHtml, renderItem } from '../templates/components/assignee.template.js';

/**
 * @description Manager class for handling assignee selection in both Add and Edit modes.
 * @export
 * @class AssigneeManager
 */
export class AssigneeManager {
    constructor(taskId = null, onUpdate = null) {
        this.taskId = taskId;
        this.onUpdate = onUpdate;
        this.tempSelectedIds = [];
    }

    /**
     * @description Initializes the assignee manager by setting up the initial state and attaching event listeners to the trigger button.
     * @param {Array} initialIds - Optional array of initially assigned member IDs (used in Edit mode)
     * @return {void}
     */
    init(initialIds = []) {
        this.tempSelectedIds = initialIds;
        this.attachTriggerListener();
    }

    /* ==========================================================================
       DATA LOGIC - STATE MANAGEMENT
       ========================================================================== */
    /**
     * @description Determines the current list of assigned member IDs based on whether we're in Add or Edit mode.
     * @return {Array} The current list of assigned member IDs.
     * @memberof AssigneeManager
     */
    getCurrentSelection() {
        if (this.taskId) {
            return getTaskById(this.taskId)?.assignedTo || [];
        }
        return this.tempSelectedIds;
    }

    /**
     * @description Calculates the new list of assigned member IDs by toggling the presence of the given member ID in the current list.
     * @param {*} memberId The ID of the member to toggle.
     * @param {Array} currentList The current list of assigned member IDs.
     * @return {Array} The new list of assigned member IDs.
     * @memberof AssigneeManager
     */
    calculateNewList(memberId, currentList) {
        return currentList.includes(memberId)
            ? currentList.filter(id => id !== memberId)
            : [...currentList, memberId];
    }

    /**
     * @description Saves the new list of assigned member IDs to the task (in Edit mode) or updates the temporary state (in Add mode), and triggers any necessary UI updates via callbacks.
     * @param {Array} newList The new list of assigned member IDs.
     * @memberof AssigneeManager
     */
    saveSelection(newList) {
        if (this.taskId) {
            updateTaskLocally(this.taskId, { assignedTo: newList });
        } else {
            this.tempSelectedIds = newList;
            if (typeof this.onUpdate === 'function') {
                this.onUpdate(newList);
            }
        }
    }

    /* ==========================================================================
       CORE CONTROL - DROPDOWN TOGGLING & RENDERING
       ========================================================================== */

    /**
     * @description Toggles the visibility of the assignee dropdown. If the dropdown is currently open, it will be closed; if it is closed, it will be rendered and displayed.
     * @return {void}
     * @memberof AssigneeManager
     */
    toggleDropdown() {
        const dropdown = document.querySelector('.js-assignee-dropdown');
        dropdown ? this.closeDropdown(dropdown) : this.renderDropdown();
    }

    /**
     * @description Renders the assignee dropdown by generating the appropriate HTML based on the current team members and assigned members, and inserting it into the DOM. Also sets up event listeners for interaction with the dropdown items and outside clicks to close the dropdown.
     * @memberof AssigneeManager
     */
    renderDropdown() {
        const assignedIds = this.getCurrentSelection();
        const allMembers = convertToArrayList(getState().team);
        const html = createDropdownHtml(allMembers, assignedIds);
        this.insertDropdown(html);
    }

    /**
     * @description Inserts the generated dropdown HTML into the DOM and registers event listeners for interaction with the dropdown items and outside clicks to close the dropdown.
     * @param {string} html The HTML string to insert into the DOM.
     * @memberof AssigneeManager
     */
    insertDropdown(html) {
        const anchor = document.querySelector('.js-edit-assignees');
        if (anchor) {
            anchor.insertAdjacentHTML('afterend', html);
            this.registerDropdownEvents();
        }
    }

    /**
     * @description Closes the assignee dropdown and triggers any necessary UI updates via callbacks.
     * @param {*} dropdown The dropdown element to close.
     * @memberof AssigneeManager
     */
    closeDropdown(dropdown) {
        dropdown.remove();
        if (this.taskId && this.onUpdate) this.onUpdate();
    }

    /* ==========================================================================
       EVENT HANDLERS 
       ========================================================================== */

    /**
     * @description Attaches a click listener to the assignee edit button to toggle the dropdown.
     * @memberof AssigneeManager
     */
    attachTriggerListener() {
        const btn = document.querySelector('.js-edit-assignees');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
    }

    /**
     * @description Registers event listeners for interaction with the dropdown items and outside clicks to close the dropdown.
     * @memberof AssigneeManager
     */
    registerDropdownEvents() {
        this.setupItemClicks();
        this.setupOutsideClick();
    }

    /**
     * @description Sets up click listeners for each dropdown item to handle selection toggling.
     * @memberof AssigneeManager
     */
    setupItemClicks() {
        const dropdown = document.querySelector('.js-assignee-dropdown');
        dropdown?.querySelectorAll('.assignee-item').forEach(item => {
            item.onclick = (e) => {
                e.stopImmediatePropagation();
                this.handleToggle(item.dataset.id, item);
            };
        });
    }

    /**
     * @description Sets up a click listener on the document to close the dropdown when clicking outside of it.
     * @memberof AssigneeManager
     */
    setupOutsideClick() {
        const dropdown = document.querySelector('.js-assignee-dropdown');
        const listener = (e) => {
            if (!dropdown.contains(e.target) && !e.target.closest('.js-edit-assignees')) {
                this.closeDropdown(dropdown);
                document.removeEventListener('click', listener);
            }
        };
        setTimeout(() => document.addEventListener('click', listener), 0);
    }

    /**
     * @description Handles the toggling of a member's selection state in the dropdown.
     * @param {string} memberId The ID of the member to toggle.
     * @param {HTMLElement} listItem The list item element corresponding to the member.
     * @memberof AssigneeManager
     */
    handleToggle(memberId, listItem) {
        const currentList = this.getCurrentSelection();
        const newList = this.calculateNewList(memberId, currentList);
        this.saveSelection(newList);
        this.updateUI(listItem, memberId, newList);
    }

    /* ==========================================================================
       UI UPDATES
       ========================================================================== */

    /**
     * @description Updates the UI to reflect the current selection state of a member.
     * @param {HTMLElement} listItem The list item element corresponding to the member.
     * @param {string} memberId The ID of the member to update.
     * @param {Array<string>} newList The updated list of selected member IDs.
     * @memberof AssigneeManager
     */
    updateUI(listItem, memberId, newList) {
        const isSelected = newList.includes(memberId);
        listItem.classList.toggle('is-selected', isSelected);
        this.updateCheckIcon(listItem, isSelected);
        this.updateAvatarPreview(newList);
    }

    /**
     * @description Updates the check icon for a member based on their selection state.
     * @param {HTMLElement} listItem The list item element corresponding to the member.
     * @param {boolean} isSelected Whether the member is selected.
     * @memberof AssigneeManager
     */
    updateCheckIcon(listItem, isSelected) {
        const icon = listItem.querySelector('.check-icon');
        if (isSelected && !icon) {
            listItem.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-check check-icon"></i>');
        } else if (!isSelected && icon) {
            icon.remove();
        }
    }

    /**
     * @description Updates the avatar preview container with the current selection.
     * @param {Array<string>} newList The updated list of selected member IDs.
     * @memberof AssigneeManager
     */
    updateAvatarPreview(newList) {
        const container = document.querySelector('.js-modal-avatars');
        if (container) {
            container.innerHTML = generateAvatarsHtml(newList);
        }
    }
}