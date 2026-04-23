// src/features/task/task.manager.js

/**
 * Task Manager
 * Orchestrates the task detail modal interactions and updates
 */

import { getTaskById, updateTaskLocally } from './task.service.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { createTaskDetailHtml } from './task.template.js';
import { getTaskDataFromModal, generateAvatarsHtml, getSubtaskChangeData, toggleSubtaskVisuals } from '../board/board.utils.js';
import { handleAsyncButtonAction } from '../../shared/utils/ui-helpers.js';
import { TASK_UI_TEXT } from '../../shared/utils/constants.js';

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
       MODAL INITIALIZATION
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
        openModal("Edit Task", createTaskDetailHtml(task, assigneeHtml));

        this.activateModalInteractions(taskId);
    }

    /* ==========================================================================
       EVENT LISTENERS MODAL
       ========================================================================== */

    /**
     * @description Activates all interactions within the task detail modal.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    activateModalInteractions(taskId) {
        this.registerActionButtons(taskId);
        this.registerSubtaskToggles(taskId);
        this.registerFieldBehaviors(taskId);
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
        deleteBtn?.addEventListener('click', () => this.deleteTask(taskId));
    }

    /**
     * @description Registers change listeners for subtask toggle checkboxes.
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    registerSubtaskToggles(taskId) {
        const toggles = document.querySelectorAll('.js-subtask-toggle');
        toggles.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => this.handleSubtaskChange(event, taskId));
        });
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
       TASK ACTIONS
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
        }, TASK_UI_TEXT);
    }

    /**
     * @description Handles the toggle state of a subtask and updates it locally.
     * @param {Event} event - The change event
     * @param {string} taskId - The ID of the task
     * @memberof TaskManager
     */
    handleSubtaskChange(event, taskId) {
        const { index, isDone } = getSubtaskChangeData(event);
        const task = getTaskById(taskId);

        if (task && task.subtasks) {
            task.subtasks[index].done = isDone;
            updateTaskLocally(taskId, { subtasks: task.subtasks });
        }
        toggleSubtaskVisuals(index, isDone);
        if (this.onUpdate) this.onUpdate();
    }

    /**
     * @description Deletes a task after user confirmation.
     * @param {string} taskId - The ID of the task to delete
     * @memberof TaskManager
     */
    deleteTask(taskId) {
        if (confirm("Are you sure you want to delete this task?")) {
            console.log("Deleting Task:", taskId);
            // deleteTaskLocally(taskId); 
            closeModal();
            if (this.onUpdate) this.onUpdate();
        }
    }
}