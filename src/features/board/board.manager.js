// src/features/board/board.manager.js

/**
 * Board Manager
 * Orchestrates the board page rendering and task interactions
 */

import { getTasksByCategory, getTaskById, updateTaskLocally } from '../task/task.service.js';
import { TaskManager } from '../task/task.manager.js';
import { renderColumnHtml } from './board.template.js';
import { createTaskDetailHtml } from '../task/task.template.js';
import { renderSingleTask, generateAvatarsHtml, getTaskDataFromModal, getSubtaskChangeData, toggleSubtaskVisuals, showBoardWrapper } from './board.utils.js';
import { initDragAndDrop, attachDragEventToCard } from './dnd.manager.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { getInitials, setLoadingStateBtn } from '../../shared/utils/ui-helpers.js';
import { TASK_UI_TEXT } from '../../shared/utils/constants.js';

/**
 * @description Page class for the Board page.
 * @export
 * @class BoardManager
 */
export class BoardManager {
    constructor() {
        this.taskManager = new TaskManager(() => this.updateBoard())
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
       RENDERING BOARD AND TASK LAYOUT
       ========================================================================== */

    /**
     * @description Render the board layout by creating columns based on the predefined column configuration and inserting them into the board container element
     * @return {void} 
     * @memberof BoardManager
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
     * @memberof BoardManager
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
       EVENT LISTENERS BOARD
       ========================================================================== */

    /**
     * @description Initializes event listeners for the board, including click events on task cards to open the task detail modal and setting up interactions within the modal for saving changes and updating subtasks.
     * @memberof BoardManager
     */
    initEventListeners() {
        document.getElementById('jsBoardColumns')?.addEventListener('click', (event) => {
            const card = event.target.closest('.task-card');
            if (card) {
                this.taskManager.openTaskDetail(card.id);
            }
        });
    }


}
