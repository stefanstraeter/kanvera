/**
 * Task Manager
 * Orchestrates the task detail modal interactions and updates
 */

import { getTaskById, updateTaskLocally, deleteTaskLocally } from './task.service.js';
import { SubtaskManager } from './subtask.manager.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { createTaskDetailCardHtml, createConfirmDeleteTaskHtml } from './task.template.js';
import { getTaskDataFromModal, generateAvatarsHtml } from '../board/board.utils.js';
import { handleAsyncButtonAction } from '../../shared/utils/ui-helpers.js';
import { UI_TASK_BUTTON_TEXT } from '../../shared/utils/constants.js';

/**
 * @description Manager class for handling task-related operations and modal interactions.
 * @export
 * @class TaskManager
 */
export class TaskManager {
    constructor(onUpdateCallback) {
        this.onUpdate = onUpdateCallback;
    }

    /* ==========================================================================
       PUBLIC API / MODAL CONTROL
       ========================================================================== */

    /**
     * @description Opens the task detail modal and registers all necessary event listeners.
     * @param {string} taskId - The ID of the task to display
     * @memberof TaskManager
     */
    openTaskDetail(taskId) {
        const task = getTaskById(taskId);
        if (!task) return;

        const assigneeHtml = generateAvatarsHtml(task.assignedTo);
        openModal(null, createTaskDetailCardHtml(task, assigneeHtml));

        this.activateModalInteractions(taskId);
    }

    /**
     * @description Refreshes the task UI by reopening the task detail and triggering an update.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    refreshTaskUI(taskId) {
        this.openTaskDetail(taskId);
        if (this.onUpdate) this.onUpdate();
    }

    /* ==========================================================================
       INTERACTION REGISTRATION
       ========================================================================== */

    /**
     * @description Activates all interactions within the task detail modal.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    activateModalInteractions(taskId) {
        this.registerActionButtons(taskId);
        this.registerFieldBehaviors(taskId);
        this.registerPrioritySelector();

        this.subtaskManager = new SubtaskManager(
            taskId,
            this.onUpdate,
            (id) => this.refreshTaskUI(id)
        );
        this.subtaskManager.init();
    }

    /**
     * @description Registers click listeners for save and delete buttons.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    registerActionButtons(taskId) {
        const saveBtn = document.querySelector('.js-save-task');
        const deleteBtn = document.querySelector('.js-delete-task');

        saveBtn?.addEventListener('click', () => this.saveTask(taskId));
        deleteBtn?.addEventListener('click', () => this.handleDeleteTask(taskId));
    }

    /**
     * @description Registers priority selector toggle and option click listeners.
     * @memberof TaskManager
     */
    registerPrioritySelector() {
        const container = document.querySelector('.priority-select-container');
        const toggle = document.querySelector('.js-priority-toggle');
        const menu = document.querySelector('.js-priority-menu');
        const options = document.querySelectorAll('.priority-option');

        toggle?.addEventListener('click', (event) => {
            event.stopPropagation();
            menu?.classList.toggle('is-hidden');
        });

        options.forEach(option => {
            option.onclick = () => {
                this.updatePriorityUI(option.dataset.value);
                menu?.classList.add('is-hidden');
            };
        });

        document.onclick = (event) => {
            if (!container?.contains(event.target)) {
                menu?.classList.add('is-hidden');
            }
        };
    }

    /**
     * @description Registers keyboard listeners for input fields (e.g., title).
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    registerFieldBehaviors(taskId) {
        const titleField = document.querySelector('[data-field="title"]');
        titleField?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.target.blur();
            }
        });
    }

    /* ==========================================================================
       TASK ACTIONS SAVE / DELETE / UPDATE
       ========================================================================== */

    /**
     * @description Handles the saving of task changes with a loading state.
     * @param {string} taskId - The ID of the task to save
     * @memberof TaskManager
     */
    async saveTask(taskId) {
        const saveBtn = document.querySelector('.js-save-task');

        await handleAsyncButtonAction(saveBtn, async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const updatedData = getTaskDataFromModal();

            updateTaskLocally(taskId, updatedData);

            closeModal();
            if (this.onUpdate) this.onUpdate();
        }, UI_TASK_BUTTON_TEXT);
    }

    /**
     * @description Initiates the delete process by showing a confirmation dialog.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    handleDeleteTask(taskId) {
        const task = getTaskById(taskId);
        const taskTitle = task ? task.title : "this task";

        this.showConfirmDeleteTaskDialog(
            "Delete Task?",
            taskTitle,
            () => {
                deleteTaskLocally(taskId);
                if (this.onUpdate) this.onUpdate();
            }
        );
    }

    /**
     * @description Shows a confirmation dialog before deleting a task.
     * @param {string} title - Modal title
     * @param {string} taskTitle - Title of the task
     * @param {Function} onConfirm - Callback after confirmation
     */
    showConfirmDeleteTaskDialog(title, taskTitle, onConfirm) {
        closeModal();

        setTimeout(() => {
            const bodyHtml = createConfirmDeleteTaskHtml(taskTitle);
            openModal(title, bodyHtml, null);

            const confirmBtn = document.querySelector('.js-confirm-delete-task-btn');

            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    onConfirm();
                    closeModal();
                };
            }
        }, 200);
    }

    /**
     * @description Updates the priority UI elements based on the given priority.
     * @param {string} priority - The priority level (e.g., "low", "medium", "high")
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
}