//src/pages/board/board.js

import { initDataService, getState, convertToArrayList } from '../../services/data-service.js';
import { getTasksByCategory } from '../../services/task-service.js';
import { renderColumnHtml, createTaskCardHtml } from './board-template.js';

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
        this.renderBoardLayout();
        this.renderAllTasks();
        this.showBoardWrapper();
    }


    /* ==========================================================================
       RENDERING BOARD LAYOUT
       ========================================================================== */
    /**
     * @description Render the board layout by creating columns based on the predefined column configuration and inserting them into the board container element
     * @return {*} 
     * @memberof BoardPage
     */
    renderBoardLayout() {
        const boardContainer = document.getElementById('jsBoardColumns');
        if (!boardContainer) return;

        boardContainer.innerHTML = this.columns
            .map(col => renderColumnHtml(col))
            .join('');
    }

    /**
     * @description Show the board wrapper by adding the 'is-visible' class to it, making the content visible to the user
     * @memberof BoardPage
     */
    showBoardWrapper() {
        const wrapper = document.querySelector('.board-wrapper');
        if (wrapper) {
            wrapper.classList.add('is-visible');
        }
    }

    /* ==========================================================================
       RENDERING TASKS IN COLUMNS
       ========================================================================== */
    /**
     * @description Render all tasks in their respective columns by fetching tasks for each column and creating task cards
     * @memberof BoardPage
     */
    renderAllTasks() {
        this.columns.forEach(column => {
            const columnElement = document.getElementById(column.id);
            if (!columnElement) return;

            const rawTasks = getTasksByCategory(column.id);
            const preparedTasks = rawTasks.map(task => {
                const subCount = task.subtasks?.length || 0;
                const doneCount = task.subtasks?.filter(st => st.done).length || 0;

                return {
                    ...task,
                    hasSubtasks: subCount > 0,
                    progress: subCount > 0 ? (doneCount / subCount) * 100 : 0,
                    subtaskStatus: `${doneCount}/${subCount}`,
                    assigneeAvatars: ''
                };
            });

            columnElement.innerHTML = preparedTasks
                .map(task => createTaskCardHtml(task))
                .join('');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new BoardPage().init());