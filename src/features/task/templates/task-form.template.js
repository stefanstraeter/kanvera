
import { renderPrioritySelector, renderAssigneeSelector } from './components.template.js';

/* ==========================================================================
   TEMPLATES FOR TASK FORM (ADD NEW TASK) 
   ========================================================================== */

/**
 * @description Creates the HTML for adding a new task with full details.
 * @param {string} assigneeOptionsHtml - Pre-rendered <option> tags for team members
 * @return {string} HTML string
 */
export const createAddTaskModalHtml = (assigneeOptionsHtml) => {

    const defaultPriority = 'medium';

    return `
    <form id="js-add-task-form" class="modal-add-task" novalidate>
        <div class="modal-inline-edit-body">

            <div class="field-wrapper">
                <label class="modal-label u-mb-xs">Title</label>
                <div class="field-group">
                    <input type="text" name="title" class="field-input" placeholder="e.g. User interface design" required>
                </div>
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper">
                <label class="modal-label u-mb-xs">Description</label>
                <div class="field-group">
                    <textarea name="description" class="field-input task-textarea" placeholder="What's the task about?"></textarea>
                </div>
                 <div class="error-msg"></div>
            </div>

            <div class="field-row">
                <div class="field-wrapper u-flex">
                    <label class="modal-label u-mb-xs">Due Date</label>
                    <div class="field-group">
                        <input type="date" name="dueDate" id="due-date" class="field-input">
                    </div>
                    <div class="error-msg"></div>
                </div>
                
                <div class="field-wrapper u-flex">
                    <label class="modal-label u-mb-xs">Priority</label>
                    ${renderPrioritySelector('medium', true)}
                </div>
            </div>

            <div class="field-wrapper u-flex">
                    ${renderAssigneeSelector('', true)}
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-flex">
                <label class="modal-label u-mb-xs">Subtasks</label>
                <div class="field-group subtask-input-group" style="display: flex; gap: 0.5rem;">
                    <input type="text" id="js-add-subtask-input" class="field-input" placeholder="A little step to get there...">
                    <button type="button" id="js-add-subtask-btn" class="btn-add-subtask" title="Add Subtask">
                        <i class="fa-solid fa-plus btn-icon"></i>
                    </button>
                </div>

                <ul id="js-temp-subtask-list" class="subtask-preview-list u-mt-sm"></ul>
                <div class="error-msg"></div>
            </div>

        </div>

        <div class="modal__actions">
            <button type="submit" class="btn btn--s btn--full btn--primary">Create Task</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Cancel</button>
        </div>
    </form>
    `;
};
