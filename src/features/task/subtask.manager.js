/**
 * Subtask Manager
 * Handles all interactions and state updates for subtasks
 */
import { addSubtask, removeSubtask, updateSubtaskTitle, getTaskById, updateTaskLocally } from './task.service.js';

/**
 * @description Manager class for handling subtask-specific operations within a task.
 * @export
 * @class SubtaskManager
 */
export class SubtaskManager {
    /**
     * @param {string} taskId - The ID of the parent task
     * @param {Function} onUpdate - Callback to refresh the global state/UI
     * @param {Function} onRefreshUI - Callback to re-render the task detail modal
     */
    constructor(taskId, onUpdate, onRefreshUI) {
        this.taskId = taskId;
        this.onUpdate = onUpdate;
        this.onRefreshUI = onRefreshUI;
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

    /**
     * @description Initializes all subtask-related event listeners.
     * @memberof SubtaskManager
     */
    init() {
        this.registerAddAction();
        this.registerToggleActions();
        this.registerEditActions();
        this.registerDeleteActions();
    }

    /* ==========================================================================
       EVENT LISTENERS REGISTRATION
       ========================================================================== */

    /**
     * @description Registers click listener for adding a new subtask.
     * @memberof SubtaskManager
     */
    registerAddAction() {
        const addBtn = document.querySelector('.js-add-subtask-btn');
        addBtn?.addEventListener('click', () => this.handleAdd());
    }

    /**
     * @description Registers change listeners for subtask checkboxes.
     * @memberof SubtaskManager
     */
    registerToggleActions() {
        document.querySelectorAll('.js-subtask-toggle').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => this.handleToggle(event));
        });
    }

    /**
     * @description Registers blur and keyboard listeners for subtask title editing.
     * @memberof SubtaskManager
     */
    registerEditActions() {
        document.querySelectorAll('.js-subtask-text').forEach(span => {
            span.onblur = () => this.handleTitleEdit(span);
            span.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    span.blur();
                }
            };
        });
    }

    /**
     * @description Registers click listeners for subtask deletion.
     * @memberof SubtaskManager
     */
    registerDeleteActions() {
        document.querySelectorAll('.js-delete-subtask').forEach(btn => {
            btn.addEventListener('click', (event) => this.handleDelete(event, btn.dataset.index));
        });
    }

    /* ==========================================================================
       SUBTASK HANDLERS
       ========================================================================== */

    /**
     * @description Handles the addition of a new subtask and manages focus.
     * @memberof SubtaskManager
     */
    handleAdd() {
        addSubtask(this.taskId);
        this.onRefreshUI(this.taskId);

        setTimeout(() => {
            const texts = document.querySelectorAll('.js-subtask-text');
            texts[texts.length - 1]?.focus();
        }, 50);
    }

    /**
     * @description Handles the deletion of a subtask.
     * @param {Event} event - The event object
     * @param {string} index - The index of the subtask to remove
     * @memberof SubtaskManager
     */
    handleDelete(event, index) {
        event.stopPropagation();
        removeSubtask(this.taskId, index);
        this.onRefreshUI(this.taskId);
    }

    /**
     * @description Handles the title edit completion for a subtask.
     * @param {HTMLElement} span - The editable span element
     * @memberof SubtaskManager
     */
    handleTitleEdit(span) {
        const cleanedTitle = span.innerText.trim();
        updateSubtaskTitle(this.taskId, span.dataset.index, cleanedTitle);
        if (this.onUpdate) this.onUpdate();
    }

    /**
     * @description Handles the status toggle (done/undone) of a subtask.
     * @param {Event} event - The event object
     * @memberof SubtaskManager
     */
    handleToggle(event) {
        const checkbox = event.target;
        const item = checkbox.closest('.subtask-item');
        const textSpan = item.querySelector('.js-subtask-text');

        if (!this.canToggle(textSpan)) {
            checkbox.checked = false;
            textSpan.focus();
            return;
        }

        const isDone = checkbox.checked;
        const index = checkbox.dataset.index;

        this.updateState(index, isDone);
        textSpan.classList.toggle('is-done', isDone);

        if (this.onUpdate) this.onUpdate();
    }

    /* ==========================================================================
       HELPERS & STATE UPDATES
       ========================================================================== */

    /**
     * @description Updates the subtask state in the local storage.
     * @param {string} index - The index of the subtask
     * @param {boolean} isDone - The completion status
     * @memberof SubtaskManager
     */
    updateState(index, isDone) {
        const task = getTaskById(this.taskId);
        if (task?.subtasks[index]) {
            task.subtasks[index].done = isDone;
            updateTaskLocally(this.taskId, { subtasks: task.subtasks });
        }
    }

    /**
     * @description Validates if a subtask can be toggled (must not be empty).
     * @param {HTMLElement} textSpan - The subtask text element
     * @returns {boolean}
     * @memberof SubtaskManager
     */
    canToggle(textSpan) {
        return textSpan.innerText.trim().length > 0;
    }
}