//src/pages/board/board.js

import { initDataService, getState, convertToArrayList } from '../../services/data-service.js';
import { getTasksByCategory, getTaskById, updateTaskLocally } from '../../services/task-service.js';
import { renderColumnHtml } from './board-template.js';
import { createTaskDetailHtml } from './task-template.js';
import { renderSingleTask, generateAvatarsHtml, getTaskDataFromModal, getSubtaskChangeData, toggleSubtaskVisuals, showBoardWrapper } from './board-utils.js';
import { initDragAndDrop, attachDragEventToCard } from './drag-n-drop.js';
import { openModal, closeModal } from '../../components/shared/modal.js';
import { getInitials } from '../../utils/ui-helpers.js';

/**
 * @description Page class for the Board page.
 * @export
 * @class BoardPage
 */
export class BoardPage {
    constructor() {
        this.columns = [
            { id: 'to do', title: 'To do', cssClass: 'todo' },
            { id: 'in progress', title: 'In progress', cssClass: 'inprogress' },
            { id: 'await feedback', title: 'Await feedback', cssClass: 'awaitfeedback' },
            { id: 'done', title: 'Done', cssClass: 'done' }
        ];
    }

    init() {
        this.updateBoard();
        this.initEventListeners();
        showBoardWrapper();
    }

    updateBoard() {
        this.renderBoardLayout();
        this.renderAllTasks();
        initDragAndDrop(this.columns, () => this.updateBoard());
    }


    /* ==========================================================================
       RENDERING BOARD LAYOUT
       ========================================================================== */
    /**
     * @description Render the board layout by creating columns based on the predefined column configuration and inserting them into the board container element
     * @return {void} 
     * @memberof BoardPage
     */
    renderBoardLayout() {
        const boardContainer = document.getElementById('jsBoardColumns');
        if (!boardContainer) return;

        boardContainer.innerHTML = this.columns
            .map(column => {
                const tasks = getTasksByCategory(column.id);
                return renderColumnHtml({
                    ...column,
                    taskCount: tasks.length
                });
            })
            .join('');
    }

    /**
   * @description Render task cards in their respective columns by fetching tasks for each column and creating task cards
   * @memberof BoardPage
   */
    renderAllTasks() {
        this.columns.forEach(column => {
            const columnElement = document.getElementById(column.id);
            if (!columnElement) return;

            const tasks = getTasksByCategory(column.id);
            columnElement.innerHTML = tasks.map(task => renderSingleTask(task)).join('');

            columnElement.querySelectorAll('.task-card').forEach(card => attachDragEventToCard(card));
        });
    }

    /* ==========================================================================
       EVENT LISTENERS BOARD & MODAL
       ========================================================================== */
    /**
     * @description Initializes event listeners for the board, including click events on task cards to open the task detail modal and setting up interactions within the modal for saving changes and updating subtasks.
     * @memberof BoardPage
     */
    initEventListeners() {
        document.getElementById('jsBoardColumns')?.addEventListener('click', (event) => {
            const card = event.target.closest('.task-card');
            if (card) this.handleTaskClick(card.id);
        });
    }
    /**
     * @description Handles the click event on a task card, retrieves the task details, and opens the task detail modal.
     * @param {string} taskId - The ID of the clicked task card
     * @return {void} 
     * @memberof BoardPage
     */
    handleTaskClick(taskId) {
        const task = getTaskById(taskId);
        if (!task) return;

        const assigneeHtml = generateAvatarsHtml(task.assignedTo || []);
        openModal("Edit Task", createTaskDetailHtml(task, assigneeHtml));

        this.setupTaskModalInteractions(taskId);
    }
    /**
     * @description Sets up interactions within the task detail modal, including listeners for saving changes and updating subtasks when the user interacts with the modal elements.
     * @param {string} taskId - The ID of the task for which to set up modal interactions
     * @memberof BoardPage
     */
    setupTaskModalInteractions(taskId) {
        this.initSaveListener(taskId);
        this.initSubtaskListeners(taskId);
        this.initTitleFieldListener();
    }

    /* ==========================================================================
       INTERNAL MANAGER FOR LISTENERS & HANDLERS
       ========================================================================== */

    /**
     * @description Initializes the event listener for the save button in the task detail modal.
     * @param {string} taskId - The ID of the task for which to initialize the save listener
     * @memberof BoardPage
     */
    initSaveListener(taskId) {
        const saveBtn = document.querySelector('.js-save-task');
        saveBtn?.addEventListener('click', () => this.saveChanges(taskId));
    }

    /**
     * @description Initializes event listeners for the subtasks in the task detail modal.
     * @param {string} taskId - The ID of the task for which to initialize subtask listeners
     * @memberof BoardPage
     */
    initSubtaskListeners(taskId) {
        const checkboxes = document.querySelectorAll('.js-subtask-toggle');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.onSubtaskChange(e, taskId));
        });
    }

    /**
     * @description Initializes the event listener for the title field in the task detail modal.
     * @memberof BoardPage
     */
    initTitleFieldListener() {
        const titleField = document.querySelector('[data-field="title"]');
        titleField?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });
    }

    /* ==========================================================================
       INTERNAL MODAL HELPERS FOR TASK DETAILS
       ========================================================================== */
    /**
     * @description Saves the changes made in the task detail modal.
     * @param {string} taskId - The ID of the task for which to save changes
     * @memberof BoardPage
     */
    async saveChanges(taskId) {
        const updatedData = getTaskDataFromModal();
        updateTaskLocally(taskId, updatedData);

        closeModal();
        this.updateBoard();
    }

    /**
     * @description Handles the change event for a subtask checkbox in the task detail modal.
     * @param {Event} event - The change event triggered by the subtask checkbox
     * @param {string} taskId - The ID of the task containing the subtask
     * @memberof BoardPage
     */
    onSubtaskChange(event, taskId) {
        const { index, isDone } = getSubtaskChangeData(event);
        const task = getTaskById(taskId);

        if (task && task.subtasks) {
            task.subtasks[index].done = isDone;
            updateTaskLocally(taskId, { subtasks: task.subtasks });
        }
        toggleSubtaskVisuals(index, isDone);
    }
}

document.addEventListener('DOMContentLoaded', () => new BoardPage().init());