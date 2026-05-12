
import { getTasksByCategory } from '../task/task.service.js';
import { TaskManager } from '../task/task.manager.js';
import { AddTaskManager } from '../task/components/add-task.manager.js';
import { updateTaskCategory } from '../task/task.service.js';

import { initDragAndDrop, attachDragEventToCard } from './dnd.manager.js';
import { renderSingleTask, showBoardWrapper } from './board.utils.js';
import { BoardSearchManager } from './board-search.manager.js';
import { openModal, closeModal } from '../../shared/components/modal.js';
import { showToast } from '../../shared/utils/ui-helpers.js';

import { renderColumnHtml } from './templates/board.templates.js';

/**
 * @description Manager for the Board view. Handles rendering of columns and tasks, as well as user interactions on the board.
 * @export
 * @class BoardManager
 */
export class BoardManager {
    constructor() {
        this.taskManager = new TaskManager(() => this.updateBoard());
        this.addTaskManager = new AddTaskManager(() => this.updateBoard());
        this.searchManager = new BoardSearchManager();
        this.columns = [
            { id: 'up next', title: 'Up Next', cssClass: 'up-next' },
            { id: 'in progress', title: 'In Progress', cssClass: 'in-progress' },
            { id: 'review', title: 'Review', cssClass: 'review' },
            { id: 'done', title: 'Done', cssClass: 'done' }
        ];
    }

    /**
     * @description Initializes the board by rendering columns, tasks, and setting up interactions.
     * @memberof BoardManager
     */
    init() {
        this.updateBoard();
        this.registerInteractions();
        this.searchManager.init();
        showBoardWrapper();
    }

    /* ==========================================================================
       RENDERING
       ========================================================================== */

    /**
     * @description Rerenders the entire board, including columns and tasks. Should be called after any state change that affects the board.
     * @memberof BoardManager
     */
    updateBoard() {
        this.renderBoardColumns();
        this.renderAllTasks();
        this.applyActiveSearchFilter();
        this.initDragLogic();
    }

    /**
     * @description Reapplies the current search term after board rerenders so the filter stays active.
     * @memberof BoardManager
     */
    applyActiveSearchFilter() {
        const searchTerm = this.searchManager.getSearchTerm();
        if (searchTerm) {
            this.searchManager.performSearch(searchTerm);
        }
    }

    /**
     * @description Renders the board columns based on the predefined column configuration. Also updates the task count for each column.
     * @return {void}
     * @memberof BoardManager 
     */
    renderBoardColumns() {
        const container = document.getElementById('jsBoardColumns');
        if (!container) return;

        container.innerHTML = this.columns.map(col => {
            const tasks = getTasksByCategory(col.id);
            return renderColumnHtml({ ...col, taskCount: tasks.length });
        }).join('');
    }

    /**
     * @description Renders all tasks in their respective columns. Should be called after rendering columns to ensure tasks are placed in the correct containers.
     * @memberof BoardManager
     */
    renderAllTasks() {
        this.columns.forEach(col => {
            const columnEl = document.getElementById(col.id);
            if (!columnEl) return;

            const tasks = getTasksByCategory(col.id);
            this.fillColumnWithTasks(columnEl, tasks);
        });
    }

    /**
     * @description Renders a list of tasks into a given column container. Also attaches necessary event listeners for drag-and-drop functionality.
     * @param {HTMLElement} container - The DOM element representing the column container where tasks should be rendered.
     * @param {Array} tasks - An array of task objects that belong to the column being rendered.
     * @memberof BoardManager
     */
    fillColumnWithTasks(container, tasks) {
        container.innerHTML = tasks.map(task => renderSingleTask(task)).join('');
        container.querySelectorAll('.task-card').forEach(card => {
            attachDragEventToCard(card);
        });
    }

    /**
     * @description Initializes drag-and-drop logic for the board. Should be called after rendering columns and tasks to ensure all necessary elements are present in the DOM.
     * @memberof BoardManager
     */
    initDragLogic() {
        initDragAndDrop(this.columns, () => this.updateBoard());
    }

    /* ==========================================================================
       INTERACTION LOGIC
       ========================================================================== */

    /**
     * @description Registers event listeners for user interactions on the board, such as clicking on tasks or header actions. Uses event delegation to efficiently manage events on dynamically rendered elements.
     * @memberof BoardManager
     */
    registerInteractions() {
        this.registerGridClicks();
        this.registerHeaderActions();
    }

    /**
     * @description Registers click event listeners on the board grid to handle interactions with task cards. Uses event delegation to capture clicks on dynamically rendered task elements.
     * @memberof BoardManager
     */
    registerGridClicks() {
        const board = document.getElementById('jsBoardColumns');
        board?.addEventListener('click', (e) => this.handleBoardClick(e));
    }

    /**
     * @description Handles click events on the board grid, specifically targeting task cards. When a task card is clicked, it opens the task detail view using the TaskManager.
     * @param {Event} event - The click event object.
     * @memberof BoardManager
     */
    handleBoardClick(event) {
        const moveBtn = event.target.closest('.js-mobile-move-task');
        if (moveBtn) {
            event.preventDefault();
            event.stopPropagation();
            this.openMobileMoveDialog(moveBtn);
            return;
        }

        const card = event.target.closest('.task-card');
        if (card) {
            this.taskManager.openTaskDetail(card.id);
        }
    }

    /**
     * @description Opens a simple status picker modal for mobile task moves.
     * @param {HTMLElement} moveBtn - The tapped move button on a card.
     * @memberof BoardManager
     */
    openMobileMoveDialog(moveBtn) {
        const taskId = moveBtn.dataset.taskId;
        const currentCategory = moveBtn.dataset.taskCategory;
        if (!taskId || !currentCategory) return;

        const bodyHtml = this.createMoveOptionsHtml(currentCategory);
        openModal('Move task to', bodyHtml, null);
        this.bindMoveOptions(taskId, currentCategory);
    }

    /**
     * @description Creates modal body HTML with one move button per board column.
     * @param {string} currentCategory - Current task category.
     * @return {string}
     * @memberof BoardManager
     */
    createMoveOptionsHtml(currentCategory) {
        return `
            <div class="mobile-move-list">
                ${this.columns.map(col => `
                    <button
                        type="button"
                        class="mobile-move-list__btn js-move-task-option${col.id === currentCategory ? ' is-current' : ''}"
                        data-category="${col.id}"
                        ${col.id === currentCategory ? 'disabled' : ''}
                    >
                        ${col.title}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * @description Binds move option buttons and updates task category on selection.
     * @param {string} taskId - Task ID to move.
     * @param {string} currentCategory - Current task category.
     * @memberof BoardManager
     */
    bindMoveOptions(taskId, currentCategory) {
        const optionButtons = document.querySelectorAll('.js-move-task-option');

        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetCategory = button.dataset.category;
                if (!targetCategory || targetCategory === currentCategory) return;

                updateTaskCategory(taskId, targetCategory);
                closeModal();
                this.updateBoard();

                const targetTitle = this.columns.find(col => col.id === targetCategory)?.title || 'Updated';
                showToast(`Moved to ${targetTitle}`);

                if (navigator.vibrate) {
                    navigator.vibrate(20);
                }
            });
        });
    }

    /**
     * @description Registers event listeners for header actions, such as the "Add Task" button. Delegates the handling of these actions to the TaskManager to maintain separation of concerns. 
     * @memberof BoardManager
     */
    registerHeaderActions() {
        const addBtn = document.querySelector('.js-header-add-task');
        if (addBtn) {
            addBtn.onclick = () => this.addTaskManager.init();
        }
    }
}