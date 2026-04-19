//src/pages/board/board.js

import { initDataService, getState, convertToArrayList } from '../../services/data-service.js';
import { getTasksByCategory } from '../../services/task-service.js';
import { renderColumnHtml, createTaskCardHtml } from './board-template.js';

export class BoardPage {
    constructor() {
        this.columns = [
            { id: 'to do', title: 'To do', cssClass: 'todo' },
            { id: 'in progress', title: 'In progress', cssClass: 'inprogress' },
            { id: 'await feedback', title: 'Await feedback', cssClass: 'awaitfeedback' },
            { id: 'done', title: 'Done', cssClass: 'done' }
        ];
    }

    async init() {
        await initDataService();
        this.renderBoardLayout();
        this.renderAllTasks();
    }

    renderBoardLayout() {
        const boardContainer = document.getElementById('jsBoardColumns');
        if (!boardContainer) return;

        boardContainer.innerHTML = this.columns
            .map(col => renderColumnHtml(col))
            .join('');
    }

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