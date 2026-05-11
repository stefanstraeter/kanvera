
import { getTaskById, updateTaskLocally, deleteTaskLocally, initAddTaskValidation, validateTaskForm } from './task.service.js';

import { SubtaskManager } from './components/subtask.manager.js';
import { AssigneeManager } from './components/assignee.manager.js';
import { PriorityManager } from './components/priority.manager.js';

import { getTaskDataFromModal, generateAvatarsHtml } from '../board/board.utils.js';

import { openModal, closeModal } from '../../shared/components/modal.js';

import { handleAsyncButtonAction } from '../../shared/utils/ui-helpers.js';
import { UI_TASK_BUTTON_TEXT } from '../../shared/utils/constants.js';

import { createTaskDetailCardHtml, createConfirmDeleteTaskHtml, createAddTaskModalHtml } from './templates/task.template.js';

/**
 * @description Manager class for task modal interactions.
 * Refactored for Single Responsibility and clear flow.
 */
export class TaskManager {
    constructor(onUpdateCallback) {
        this.onUpdate = onUpdateCallback;
        this.priorityManager = new PriorityManager('js-priority-input-edit');
    }

    /* ==========================================================================
       DETAIL MODAL FLOW      
       ========================================================================== */

    /**
     * @description Opens the task detail modal for a given task ID, initializes sub-managers and registers interactions.
     * @param {string} taskId - The ID of the task to display in the modal.
     * @return {void} 
     * @memberof TaskManager
     */
    openTaskDetail(taskId) {
        const task = getTaskById(taskId);
        if (!task) return;

        this.renderTaskModal(task);
        this.activateSubManagers(taskId);
        this.registerInteractions(taskId);
    }

    /**
     * @description Renders the task detail modal content based on the provided task data.
     * @param {Object} task - The task data to display in the modal.
     * @memberof TaskManager
     */
    renderTaskModal(task) {
        const assigneeHtml = generateAvatarsHtml(task.assignedTo);
        const modalContent = createTaskDetailCardHtml(task, assigneeHtml);
        openModal(null, modalContent);
    }

    /**
     * @description Refreshes the task detail modal UI, typically after updates to subtasks or assignees, by re-rendering the modal content.
     * @param {string} taskId - The ID of the task to refresh in the modal.
     * @memberof TaskManager
     */
    refreshTaskUI(taskId) {
        this.openTaskDetail(taskId);
        this.notifyUpdate();
    }

    /* ==========================================================================
       SUBMANAGER SETUP      
       ========================================================================== */

    /**
     * @description Activates sub-managers for subtasks and assignees for a given task ID.
     * @param {string} taskId - The ID of the task for which to activate sub-managers.
     * @memberof TaskManager
     */
    activateSubManagers(taskId) {
        this.subtaskManager = new SubtaskManager(taskId, this.onUpdate, (id) => this.refreshTaskUI(id));
        this.subtaskManager.init();

        this.assigneeManager = new AssigneeManager(taskId, (id) => this.refreshTaskUI(id));
        this.assigneeManager.init();
    }

    /* ==========================================================================
       EVENT BINDING      
       ========================================================================== */

    /**
     * @description Registers interactions for the task modal, including buttons, priority selector, and field inputs.
     * @param {string} taskId - The ID of the task for which to register interactions.
     * @memberof TaskManager
     */
    registerInteractions(taskId) {
        this.registerButtons(taskId);
        this.registerFieldInputs();
        this.priorityManager.init();
    }

    /**
     * @description Registers button interactions for saving and deleting tasks.
     * @param {string} taskId - The ID of the task for which to register button interactions.
     * @memberof TaskManager
     */
    registerButtons(taskId) {
        const saveBtn = document.querySelector('.js-save-task');
        const deleteBtn = document.querySelector('.js-delete-task');

        saveBtn?.addEventListener('click', () => this.saveTask(taskId));
        deleteBtn?.addEventListener('click', () => this.initiateDeletion(taskId));
    }

    /**
     * @description Registers input field interactions for the task modal.
     * @memberof TaskManager
     */
    registerFieldInputs() {
        const titleField = document.querySelector('[data-field="title"]');

        titleField?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.target.blur();
            }
        });
    }

    /* ==========================================================================
       PRIORITY FLOW      
       ========================================================================== */

    /**
     * @description Registers interactions for the priority selector dropdown, including toggle behavior and option selection.  
     * @memberof TaskManager
     */
    registerPrioritySelector() {
        const toggle = document.querySelector('.js-priority-toggle');
        const menu = document.querySelector('.js-priority-menu');
        const options = document.querySelectorAll('.priority-option');

        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            menu?.classList.toggle('is-hidden');
        });

        options.forEach(opt => {
            opt.onclick = () => this.handlePriorityChange(opt.dataset.value, menu);
        });

        this.setupPriorityOutsideClick(menu);
    }

    /**
     * @description Handles the change of priority for a task and updates the UI accordingly.
     * @param {string} priority - The new priority value.
     * @param {HTMLElement} menu - The priority menu element.
     * @memberof TaskManager
     */
    handlePriorityChange(priority, menu) {
        this.updatePriorityUI(priority);
        menu?.classList.add('is-hidden');
    }

    /**
     * @description Sets up an outside click listener to close the priority menu when clicking outside of it.
     * @param {HTMLElement} menu - The priority menu element.
     * @memberof TaskManager
     */
    setupPriorityOutsideClick(menu) {
        const container = document.querySelector('.priority-select-container');
        document.onclick = (e) => {
            if (!container?.contains(e.target)) menu?.classList.add('is-hidden');
        };
    }

    /* ==========================================================================
       SAVE/DELETE ACTIONS      
       ========================================================================== */

    /**
     * @description Saves the task with the given ID.
     * @param {string} taskId - The ID of the task to save.
     * @memberof TaskManager
     */
    async saveTask(taskId) {
        const saveBtn = document.querySelector('.js-save-task');

        await handleAsyncButtonAction(saveBtn, async () => {
            await this.processSave(taskId);
        }, UI_TASK_BUTTON_TEXT);
    }

    /**
     * @description Processes the save action for a task.
     * @param {string} taskId - The ID of the task to save.
     * @memberof TaskManager
     */
    async processSave(taskId) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const currentPriority = document.querySelector('.js-priority-toggle')?.dataset.priority;
        const updatedData = getTaskDataFromModal();

        updatedData.priority = currentPriority;
        updateTaskLocally(taskId, updatedData);
        closeModal();
        this.notifyUpdate();
    }

    /**
     * @description Initiates the deletion process for a task by showing a confirmation dialog.
     * @param {string} taskId - The ID of the task to delete.
     * @memberof TaskManager
     */
    initiateDeletion(taskId) {
        const task = getTaskById(taskId);
        const title = task?.title;

        this.showConfirmDeleteDialog(title, () => this.processDeletion(taskId));
    }

    /**
     * @description Processes the deletion of a task.
     * @param {string} taskId - The ID of the task to delete.
     * @memberof TaskManager
     */
    processDeletion(taskId) {
        deleteTaskLocally(taskId);
        this.notifyUpdate();
    }


    /* ==========================================================================
       UI HELPERS
       ========================================================================== */

    /**
     * @description Shows a confirmation dialog for deleting a task.
     * @param {string} taskTitle - The title of the task to delete.
     * @param {Function} onConfirm - The callback function to execute on confirmation.
     * @memberof TaskManager
     */
    showConfirmDeleteDialog(taskTitle, onConfirm) {
        closeModal();

        setTimeout(() => {
            const html = createConfirmDeleteTaskHtml(taskTitle);
            openModal("Delete Task?", html, null);
            this.bindConfirmDelete(onConfirm);
        }, 200);
    }

    /**
     * @description Binds the confirmation button for deleting a task.
     * @param {Function} onConfirm - The callback function to execute on confirmation.
     * @memberof TaskManager
     */
    bindConfirmDelete(onConfirm) {
        const confirmBtn = document.querySelector('.js-confirm-delete-task-btn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                onConfirm();
                closeModal();
            };
        }
    }

    /**
     * @description Updates the priority UI elements based on the given priority.
     * @param {string} priority - The new priority value.
     * @memberof TaskManager
     */
    updatePriorityUI(priority) {
        const display = document.querySelector('.js-priority-toggle');
        const text = display.querySelector('.priority-text');
        const icon = display.querySelector('.priority-icon');

        display.dataset.priority = priority;
        text.textContent = priority;
        icon.src = `assets/icons/priority/${priority}.svg`;
        display.className = `priority-display js-priority-toggle priority--${priority}`;
    }

    /**
     * @description Notifies the parent component or callback about an update, typically after saving or deleting a task, to trigger any necessary UI refreshes or state updates.
     * @memberof TaskManager
     */
    notifyUpdate() {
        if (this.onUpdate) this.onUpdate();
    }
}