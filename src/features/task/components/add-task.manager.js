import { SubtaskManager } from './subtask.manager.js';
import { AssigneeManager } from './assignee.manager.js';
import { PriorityManager } from './priority.manager.js';

import { openModal, closeModal } from '../../../shared/components/modal.js';
import { createAddTaskModalHtml } from '../templates/task.template.js';
import { initAddTaskValidation, validateTaskForm, createTaskLocally } from '../task.service.js';
import { setLoadingStateBtn } from '../../../shared/utils/ui-helpers.js';
import { UI_TASK_BUTTON_TEXT } from '../../../shared/utils/constants.js';

/**
 * @description Manager class for handling the "Add Task" modal, including form state, validation, and task creation logic.
 * @export 
 * @class AddTaskManager
 */
export class AddTaskManager {
    constructor(onUpdateCallback) {
        this.onUpdate = onUpdateCallback;
        this.tempSubtasks = [];
        this.tempAssignees = [];
        this.priorityManager = new PriorityManager();
    }

    /**
     * @description Initializes the "Add Task" modal, including state reset, modal opening, and sub-managers activation.
     * @memberof AddTaskManager
     */
    init() {
        this.resetDraftState();
        this.openAddTaskModal();
        this.priorityManager.init();
        this.activateSubManagers();
        initAddTaskValidation();
    }

    /* ==========================================================================
       STATE & UI PREPARATION
       ========================================================================== */

    /**
     * @description Resets the temporary state for subtasks and assignees when opening the add task modal.
     * @memberof AddTaskManager
     */
    resetDraftState() {
        this.tempSubtasks = [];
        this.tempAssignees = [];
    }

    /**
     * @description Opens the "Add Task" modal with the appropriate HTML content and sets up the save callback and validation.
     * @memberof AddTaskManager
     */
    openAddTaskModal() {
        const html = createAddTaskModalHtml();

        openModal(
            "Create New Issue",
            html,
            (data) => this.handleSaveClick(data),
            validateTaskForm
        );
    }

    /**
     * @description Initializes sub-managers for handling subtasks and assignees within the add task modal.
     * @memberof AddTaskManager
     */
    activateSubManagers() {
        this.initSubtaskManager();
        this.initAssigneeManager();
    }

    /**
     * @description Initializes the SubtaskManager for the add task modal, providing a callback to update the temporary subtasks state and re-render the subtask preview when changes occur.
     * @memberof AddTaskManager
     */
    initSubtaskManager() {
        this.subtaskManager = new SubtaskManager(null, null, (data) => {
            if (Array.isArray(data)) {
                this.tempSubtasks = data;
                this.renderSubtaskPreview();
            }
        });
        this.subtaskManager.init();
    }

    /**
     * @description Initializes the AssigneeManager for the add task modal, providing a callback to update the temporary assignees state when changes occur.
     * @memberof AddTaskManager
     */
    initAssigneeManager() {
        this.assigneeManager = null;
        this.assigneeManager = new AssigneeManager(null, (selectedIds) => {
            this.tempAssignees = selectedIds;
        });
        this.assigneeManager.init();
    }

    /* ==========================================================================
       SUBTASK RENDERING & HTML TEMPLATING
       ========================================================================== */

    /**
     * @description Renders the current list of subtasks in the add task modal's preview area by generating the appropriate HTML and initializing event listeners for the subtask items.
     * @return {void} 
     * @memberof AddTaskManager
     */
    renderSubtaskPreview() {
        const list = document.getElementById('js-temp-subtask-list');
        if (!list) return;

        list.innerHTML = this.generateSubtasksHtml();
        this.subtaskManager.init();
    }
    /**
     * @description Generates the HTML for the current list of subtasks in the add task modal's preview area.
     * @return {string} The HTML string representing the subtasks.
     * @memberof AddTaskManager
     */
    generateSubtasksHtml() {
        return this.tempSubtasks.map((s, index) => `
            <div class="subtask-item">
                <input type="checkbox" class="js-subtask-toggle" data-index="${index}" ${s.done ? 'checked' : ''}>
                <span class="subtask-text js-subtask-text" contenteditable="true" data-index="${index}">
                    ${s.title}
                </span>
                <button type="button" class="js-delete-subtask" data-index="${index}">×</button>
            </div>
        `).join('');
    }

    /* ==========================================================================
       SAVE LOGIC
       ========================================================================== */

    /**
     * @description Handles the click event for the save button in the add task modal, including setting the loading state, executing the task creation logic, and handling success or error outcomes.
     * @param {Object} formData The data from the add task form.
     * @memberof AddTaskManager
     */
    async handleSaveClick(formData) {
        const submitBtn = document.getElementById('js-add-task-form')?.querySelector('button[type="submit"]');

        setLoadingStateBtn(submitBtn, true, UI_TASK_BUTTON_TEXT.CREATE_PENDING);

        try {
            await this.executeTaskCreation(formData);
            this.finalizeCreation();
        } catch (error) {
            this.handleError(submitBtn, error);
        }
    }

    /**
     * @description Executes the task creation logic, including simulating an API call delay, assembling the new task object, and saving it to the local state.
     * @param {Object} formData The data from the add task form.
     * @memberof AddTaskManager
     */
    async executeTaskCreation(formData) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newId = `task-${Date.now()}`;
        const newTask = this.assembleTaskObject(newId, formData);

        createTaskLocally(newId, newTask);
    }

    /**
     * @description Assembles a new task object from the provided ID and form data.
     * @param {string} id The unique ID for the new task.
     * @param {Object} data The data from the add task form.
     * @return {Object} The assembled task object.
     * @memberof AddTaskManager
     */
    assembleTaskObject(id, data) {
        const finalAssignees = this.assigneeManager
            ? this.assigneeManager.getCurrentSelection()
            : this.tempAssignees;

        return {
            id: id,
            title: data.title.trim(),
            description: (data.description || '').trim(),
            dueDate: data.dueDate || '',
            priority: data.priority || 'medium',
            category: 'to do',
            assignedTo: Array.isArray(finalAssignees) ? [...finalAssignees] : [],
            subtasks: [...this.tempSubtasks],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
    }

    /**
     * @description Finalizes the task creation process by closing the modal and triggering any necessary updates in the parent component or state.
     * @memberof AddTaskManager
     */
    finalizeCreation() {
        closeModal();
        if (this.onUpdate) this.onUpdate();
    }

    /**
     * @description Handles errors that occur during the task creation process by logging the error and resetting the save button state to allow the user to try again.
     * @param {HTMLElement} button The button element that triggered the task creation.
     * @param {Error} error The error object representing the failure.
     * @memberof AddTaskManager
     */
    handleError(button, error) {
        console.error("Task creation failed:", error);
        setLoadingStateBtn(button, false, UI_TASK_BUTTON_TEXT.CREATE_DEFAULT);
    }
}