import { TaskManager } from '../task/task.manager.js';
import { AddTaskManager } from '../task/components/add-task.manager.js';
import { getTasksByCategory } from '../task/task.service.js';
import { renderColumnHtml } from './board.template.js';
import { renderSingleTask, showBoardWrapper } from './board.utils.js';
import { initDragAndDrop, attachDragEventToCard } from './dnd.manager.js';

/**
 * @description Manager for the Board view. Handles rendering of columns and tasks, as well as user interactions on the board.
 * @export
 * @class BoardManager
 */
export class BoardManager {
    constructor() {
        this.taskManager = new TaskManager(() => this.updateBoard());
        this.addTaskManager = new AddTaskManager(() => this.updateBoard());
        this.columns = [
            { id: 'to do', title: 'To do', cssClass: 'todo' },
            { id: 'in progress', title: 'In progress', cssClass: 'inprogress' },
            { id: 'await feedback', title: 'Await feedback', cssClass: 'awaitfeedback' },
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
        this.initDragLogic();
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
        const card = event.target.closest('.task-card');
        if (card) {
            this.taskManager.openTaskDetail(card.id);
        }
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