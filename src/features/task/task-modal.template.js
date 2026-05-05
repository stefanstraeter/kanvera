// src/features/task/task-modal.template.js

/* ==========================================================================
   TEMPLATES FOR TASK DETAIL MODAL - EDIT
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
                        ${renderPrioritySelector(task.priority)}
                    </div>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Description</label>
                    <p class="task-detail__description modal-edit-field js-edit-field" data-field="description" contenteditable="true" spellcheck="false">
                        ${task.description || 'No description yet'}
                    </p>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    <label class="modal-label u-mb-xs">Subtasks</label>
                    <div class="subtask-list u-mb-sm">
                       ${renderSubtasksList(task.subtasks, task.id)}
                    </div>
                    <button type="button" class="btn btn--s btn--full btn--secondary js-add-subtask-btn">
                    <div class="btn-group">
                        <i class="fa-solid fa-plus btn-icon"></i> 
                        <span>Add Subtask</span>
                    </div>
                        
                    </button>
                </div>
            </div>

            ${renderAssigneeSection(assigneeHtml)}

        </div>

        <div class="modal__actions">
            <button type="button" class="btn btn--s btn--full btn--primary js-save-task">Save Changes</button>
        </div>
    </div>
    `;
};


/* ==========================================================================
   SUB-TEMPLATES PRIORITY SELECTOR, ASSIGNEES, SUBTASKS
   ========================================================================== */

/**
* @description Renders the header section for the task detail modal.
* @param {Object} task - The task data object
* @return {string} HTML string representing the header section
*/
function renderHeaderSection(task) {
    return `
        <div class="team-card__delete">
            <button type="button" class="btn-icon btn-trash-icon modal__delete-icon js-delete-task" title="Delete Task">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
        <div class="u-mb-md">
            <div class="task-card__category badge">${task.taskType}</div>
        </div>
        <div class="modal__edit-header-task u-mb-lg">
             <h3 class="heading-xl modal-edit-field js-edit-field" data-field="title" contenteditable="true" spellcheck="false">
                ${task.title}
            </h3>
        </div>
    `;
}


/**
 * @description Renders the priority selector for the task detail modal.
 * @param {string} currentPriority - The current priority of the task
 * @return {string} HTML string representing the priority selector
 */
function renderPrioritySelector(currentPriority) {
    return `
        <div class="priority-select-container">
            <div class="priority-display js-priority-toggle" data-priority="${currentPriority}">
                <span class="priority-text">${currentPriority}</span>
                <img src="assets/icons/priority/${currentPriority}.svg" alt="" class="priority-icon">
            </div>
            <div class="priority-options-menu is-hidden js-priority-menu">
                <div class="priority-option" data-value="low">Low <img src="assets/icons/priority/low.svg" alt="" class="priority-icon"></div>
                <div class="priority-option" data-value="medium">Medium <img src="assets/icons/priority/medium.svg" alt="" class="priority-icon"></div>
                <div class="priority-option" data-value="urgent">Urgent <img src="assets/icons/priority/urgent.svg" alt="" class="priority-icon"></div>
            </div>
        </div>
    `;
}


/**
 * @description Renders the assignee section for the task detail modal.
 * @param {string} assigneeHtml - The HTML string representing the assignees
 * @return {string} HTML string representing the assignee section
 */
function renderAssigneeSection(assigneeHtml) {
    return `
        <div class="inline-field u-mb-lg">
            <div class="inline-edit-wrapper">
                <label class="modal-label u-mb-xs">Assignees</label>
                    <div class="avatar-group">
                        <div class="js-modal-avatars">
                            ${assigneeHtml}
                        </div>
                        <button type="button" class="btn-icon btn-add-assignees u-ml-sm js-edit-assignees" title="Edit Assignees">
                          <i class="fa-solid fa-user-plus field-icon "></i>
                        </button>
                    </div>
            </div>
        </div>
    `;
}


/**
 * @description Renders the list of subtasks for the task detail modal.
 * @param {Array<Object>} [subtasks=[]] - The array of subtasks
 * @return {string} HTML string representing the list of subtasks
 */
function renderSubtasksList(subtasks = [], taskId) {
    if (subtasks.length === 0) return '<p class="task-detail__description">No subtasks yet</p>';

    return subtasks.map((st, i) => `
        <div class="subtask-item">
            <input type="checkbox" 
                   id="st-${taskId}-${i}" 
                   class="subtask-input js-subtask-toggle" 
                   data-index="${i}" 
                   ${st.done ? 'checked' : ''} 
                   hidden />
            
            <label for="st-${taskId}-${i}" class="subtask-checkbox-label">
                <i class="fa-regular fa-square icon-unchecked"></i>
                <i class="fa-solid fa-square-check icon-checked"></i>
            </label>
            <span class="subtask-text modal-edit-field js-subtask-text ${st.done ? 'is-done' : ''}" 
                  contenteditable="true" 
                  data-index="${i}">${st.title}</span>
            <button type="button" class="btn-icon btn-trash-icon u-pl-sm u-pr-sm js-delete-subtask" data-index="${i}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}


/* ==========================================================================
   TEMPLATES FOR TASK DETAIL MODAL - DELETE
   ========================================================================== */

/**
 * @description Creates the HTML for the confirm delete modal of a task.
 * @param {string} taskTitle - The title of the task to be deleted.
 * @return {string} HTML string for the confirm delete modal.
 */
export const createConfirmDeleteTaskHtml = (taskTitle) => {
    return `
        <div class="confirm-modal">
            <p>Are you sure you want to delete the task <strong>"${taskTitle}"</strong>? This action cannot be reversed.</p>
            <div class="modal__actions u-margin-top-l">
                <button class="btn btn--destructive btn--full btn--s js-confirm-delete-task-btn">Delete Task</button>
                <button class="btn btn--secondary btn--full btn--s js-close-modal">Cancel</button>
            </div>
        </div>
    `;
};



/* ==========================================================================
   TEMPLATES FOR TASK DETAIL MODAL - ADD NEW TASK
   ========================================================================== */
