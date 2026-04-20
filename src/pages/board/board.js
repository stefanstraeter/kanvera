//src/pages/board/board.js

import { initDataService, getState, convertToArrayList } from '../../services/data-service.js';
import { getTasksByCategory, resolveMemberDetails } from '../../services/task-service.js';
import { renderColumnHtml } from './board-template.js';
import { renderSingleTask } from './board-utils.js';
import { initDragAndDrop, attachDragEventToCard } from './drag-n-drop.js';
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
        this.renderBoardLayout();
        this.renderAllTasks();
        initDragAndDrop(this.columns, () => this.renderAllTasks());
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
     * @description Render task cards in their respective columns by fetching tasks for each column and creating task cards
     * @memberof BoardPage
     */
    renderAllTasks() {
        this.columns.forEach(column => {
            const columnElement = document.getElementById(column.id);
            if (!columnElement) return;

            const tasks = getTasksByCategory(column.id);

            columnElement.innerHTML = tasks
                .map(task => renderSingleTask(task))
                .join('');

            const cards = columnElement.querySelectorAll('.task-card');
            cards.forEach(card => attachDragEventToCard(card));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new BoardPage().init());