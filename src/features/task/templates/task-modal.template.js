import { renderPrioritySelector, renderAssigneeSelector, renderSubtaskSection } from './components.template.js';
import { formatTaskTypeLabel } from '../task.utils.js';

/* ==========================================================================
   TEMPLATE FOR TASK MODAL
   ========================================================================== */

/**
 * @description Creates the HTML for the task detail modal, including sections for title, description, due date, priority, subtasks, and assignees.
 * @param {Object} task
 * @param {string} assigneeHtml
 * @return {string} HTML string for the task detail modal content
 */
export const createTaskDetailCardHtml = (task, assigneeHtml) => {
    return `
    <div class="modal-edit-container task-detail" data-id="${task.id}">
        
        ${renderHeaderSection(task)}

        <div class="modal-inline-edit-body">
            <div class="task-detail__meta-grid u-mb-md">
                <div class="inline-field">
                    <label class="inline-edit-wrapper u-cursor-pointer">
                    <span class="modal-label">Due Date</span>
                    <input 
                        type="date" 
                        name="due_date" 
                        class="field-input task-detail__date-input js-task-due-date" 
                        value="${task.dueDate || ''}"
                    >
                    </label>
                </div>
                <div class="inline-field">
                    <div class="inline-edit-wrapper">
                        <label class="modal-label">Priority</label>
                        ${renderPrioritySelector(task.priority, false)}
                    </div>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    <label class="modal-label u-mb-xs">Description</label>
                    <p class="task-detail__description modal-edit-field js-edit-field" data-field="description" contenteditable="true" spellcheck="false">
                        ${task.description || 'No description yet'}
                    </p>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    ${renderSubtaskSection(task.subtasks, task.id)}
                </div>
            </div>

            ${renderAssigneeSelector(assigneeHtml)}

        </div>

        <div class="modal__actions">
            <button type="button" class="btn btn--s btn--full btn--primary js-save-task">Save Changes</button>
        </div>
    </div>
    `;
};


/* ==========================================================================
   SUB-TEMPLATES HEADER
   ========================================================================== */

/**
* @description Renders the header section for the task detail modal.
* @param {Object} task - The task data object
* @return {string} HTML string representing the header section
*/
function renderHeaderSection(task) {
    return `
        <div class="team-card__delete">
            <button type="button" class="btn-icon-only btn-trash-icon icon-interaction js-delete-task" title="Delete Task">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
        <div class="u-mb-md">
            <div class="task-card__category badge" data-type="${task.taskType}">${formatTaskTypeLabel(task.taskType)}</div>
        </div>
        <div class="modal__edit-header-task u-mb-lg">
             <h3 class="heading-xl modal-edit-field js-edit-field" data-field="title" contenteditable="true" spellcheck="false">
                ${task.title}
            </h3>
        </div>
    `;
}





