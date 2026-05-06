import { updateTaskLocally, getTaskById } from './task.service.js';
import { getState, convertToArrayList } from '../../core/state.js';
import { generateAvatarsHtml } from '../board/board.utils.js';

/**
 * @description Manager class for handling the assignee dropdown.
 * @export
 * @class AssigneeManager
 */
export class AssigneeManager {
    constructor(taskId, onUpdateBoard) {
        this.taskId = taskId;
        this.onUpdateBoard = onUpdateBoard;
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

    /**
     * @description Initializes the assignee manager by setting up event listeners.
     * @memberof AssigneeManager
     */
    init() {
        const editBtn = document.querySelector('.js-edit-assignees');
        editBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleDropdown();
        });
    }

    /* ==========================================================================
       DROPDOWN CONTROL
       ========================================================================== */

    /**
     * @description Toggles the visibility of the assignee dropdown.
     * @memberof AssigneeManager
     */
    toggleDropdown() {
        const dropdown = document.querySelector('.js-assignee-dropdown');
        dropdown ? this.closeDropdown(dropdown) : this.renderDropdown();
    }

    /**
     * @description Renders the assignee dropdown.
     * @memberof AssigneeManager
     */
    renderDropdown() {
        const task = getTaskById(this.taskId);
        const allMembers = convertToArrayList(getState().team);

        const html = this.createAssigneeDropdownHtml(allMembers, task.assignedTo);
        const anchor = document.querySelector('.js-edit-assignees');

        if (anchor) {
            anchor.insertAdjacentHTML('afterend', html);
            this.registerDropdownEvents();
        }
    }

    /**
     * @description Closes the assignee dropdown.
     * @param {HTMLElement} dropdown - The dropdown element to close
     * @memberof AssigneeManager
     */
    closeDropdown(dropdown) {
        dropdown.remove();
        this.refreshBoard();
    }

    /* ==========================================================================
       EVENT HANDLING
       ========================================================================== */

    /**
     * @description Registers event listeners for the assignee dropdown.
     * @memberof AssigneeManager
     */
    registerDropdownEvents() {
        this.setupItemClicks();
        this.setupOutsideClick();
    }

    /**
     * @description Sets up click event listeners for each assignee item in the dropdown.
     * @memberof AssigneeManager
     */
    setupItemClicks() {
        const dropdown = document.querySelector('.js-assignee-dropdown');
        const items = dropdown.querySelectorAll('.assignee-item');

        items.forEach(item => {
            item.onclick = (event) => {
                event.stopImmediatePropagation();
                this.handleToggle(item.dataset.id, item);
            };
        });
    }

    /**
     * @description Sets up a click event listener to close the dropdown when clicking outside of it.
     * @memberof AssigneeManager
     */
    setupOutsideClick() {
        const dropdown = document.querySelector('.js-assignee-dropdown');

        const outsideListener = (event) => {
            const isClickInside = dropdown.contains(event.target);
            const isClickOnToggle = event.target.closest('.js-edit-assignees');

            if (!isClickInside && !isClickOnToggle) {
                this.closeDropdown(dropdown);
                document.removeEventListener('click', outsideListener);
            }
        };

        setTimeout(() => document.addEventListener('click', outsideListener), 0);
    }

    /* ==========================================================================
       LOGIC & DATA
       ========================================================================== */

    /**
     * @description Handles the toggle action for an assignee.
     * @param {string} memberId - The ID of the member to toggle.
     * @param {HTMLElement} listItem - The list item element representing the member.
     * @memberof AssigneeManager
     */
    handleToggle(memberId, listItem) {
        const task = getTaskById(this.taskId);
        const newAssignees = this.calculateNewAssignees(memberId, task.assignedTo);

        this.processUpdate(newAssignees);
        this.updateUI(listItem, memberId, newAssignees);
    }

    /**
     * @description Updates the data locally.
     * @param {Array} newAssignees - The updated list of assigned member IDs.
     * @memberof AssigneeManager
     */
    processUpdate(newAssignees) {
        updateTaskLocally(this.taskId, { assignedTo: newAssignees });
    }

    /**
     * @description Coordinates all UI changes.
     * @param {HTMLElement} listItem - The list item element representing the member.
     * @param {string} memberId - The ID of the member to toggle.
     * @param {Array} newAssignees - The updated list of assigned member IDs.
     * @memberof AssigneeManager
     */
    updateUI(listItem, memberId, newAssignees) {
        const isSelected = newAssignees.includes(memberId);

        this.updateItemVisuals(listItem, isSelected);
        this.refreshModalAvatars(newAssignees);
    }

    /**
     * @description Calculates the new list of assignees based on the current selection.
     * @param {string} memberId - The ID of the member to toggle.
     * @param {Array} [currentList=[]] - The current list of assigned member IDs.
     * @returns {Array} The updated list of assigned member IDs.
     * @memberof AssigneeManager
     */
    calculateNewAssignees(memberId, currentList = []) {
        return currentList.includes(memberId)
            ? currentList.filter(id => id !== memberId)
            : [...currentList, memberId];
    }

    /* ==========================================================================
       UI UPDATES
       ========================================================================== */

    /**
     * @description Updates the visuals of an assignee item based on its selection status.
     * @param {HTMLElement} listItem - The list item element representing the member.
     * @param {boolean} isSelected - Whether the member is selected.
     * @memberof AssigneeManager
     */
    updateItemVisuals(listItem, isSelected) {
        listItem.classList.toggle('is-selected', isSelected);
        this.toggleCheckIcon(listItem, isSelected);
    }

    /**
     * @description Toggles the check icon for an assignee item based on its selection status.
     * @param {HTMLElement} listItem - The list item element representing the member.
     * @param {boolean} isSelected - Whether the member is selected.
     * @memberof AssigneeManager
     */
    toggleCheckIcon(listItem, isSelected) {
        const checkIcon = listItem.querySelector('.check-icon');

        if (isSelected && !checkIcon) {
            listItem.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-check check-icon"></i>');
        } else if (!isSelected && checkIcon) {
            checkIcon.remove();
        }
    }

    /**
     * @description Refreshes the avatars displayed in the modal based on the assigned member IDs.
     * @param {Array} assignedIds - The list of assigned member IDs.
     * @memberof AssigneeManager
     */
    refreshModalAvatars(assignedIds) {
        const container = document.querySelector('.js-modal-avatars');
        if (container) {
            container.innerHTML = generateAvatarsHtml(assignedIds);
        }
    }

    /**
     * @description Refreshes the board by invoking the update callback.
     * @memberof AssigneeManager
     */
    refreshBoard() {
        if (this.onUpdateBoard) {
            this.onUpdateBoard();
        }
    }

    /* ==========================================================================
       HTML TEMPLATES
       ========================================================================== */

    /**
     * @description Creates the HTML for the assignee dropdown.
     * @param {Array} allMembers - The list of all members.
     * @param {Array} assignedIds - The list of assigned member IDs.
     * @returns {string} The HTML string for the assignee dropdown.
     * @memberof AssigneeManager
     */
    createAssigneeDropdownHtml(allMembers, assignedIds) {
        const itemsHtml = allMembers
            .map(m => this.renderAssigneeItem(m, assignedIds?.includes(m.id)))
            .join('');

        return `
            <div class="assignee-dropdown js-assignee-dropdown">
                <ul class="assignee-list">${itemsHtml}</ul>
            </div>`;
    }

    /**
     * @description Renders an individual assignee item for the dropdown.
     * @param {Object} member - The member object containing id, name, and imageUrl.
     * @param {boolean} isAssigned - Whether the member is currently assigned.
     * @returns {string} The HTML string for the assignee item.
     * @memberof AssigneeManager
     */
    renderAssigneeItem(member, isAssigned) {
        return `
            <li class="assignee-item ${isAssigned ? 'is-selected' : ''}" data-id="${member.id}">
                <div class="assignee-item__info">
                    <img src="${member.imageUrl}" class="avatar avatar--s" alt="${member.name}">
                    <span class="assignee-name">${member.name}</span>
                </div>
                ${isAssigned ? '<i class="fa-solid fa-check check-icon"></i>' : ''}
            </li>`;
    }
}