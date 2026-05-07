/* ==========================================================================
   TEMPLATES FOR TASK MODAL - DETAIL & EDIT
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

/* ==========================================================================
   SUB-TEMPLATES PRIORITY SELECTOR
   ========================================================================== */
/**
 * @description Renders the priority selector component for the task detail modal, allowing users to view and change the priority of the task.
 * @param {string} currentPriority - The current priority value of the task
 * @param {boolean} [isFormStyle=false] - Flag to determine if the selector is rendered in form style (with caret) or inline style
 * @return {string} HTML string representing the priority selector component
 */
function renderPrioritySelector(currentPriority, isFormStyle = false) {
    let styleClass = 'priority-select--inline';
    let inputId = 'js-priority-input-edit';
    let caretHtml = '';

    if (isFormStyle) {
        styleClass = 'priority-select--form';
        inputId = 'js-priority-input';
        caretHtml = '<span class="priority-caret"><i class="fa-solid fa-angle-down"></i></span>';
    }

    return `
        <div class="priority-select-container ${styleClass}">
            <input type="hidden" name="priority" id="${inputId}" value="${currentPriority}">
            
            <div class="js-priority-toggle priority-trigger priority--${currentPriority}" 
                 data-priority="${currentPriority}">
                
                <div class="priority-content">
                    <img src="assets/icons/priority/${currentPriority}.svg" alt="" class="priority-icon">
                    <span class="priority-text">${currentPriority}</span>
                </div>
                
                ${caretHtml}
            </div>
            
            <div class="priority-options-menu is-hidden js-priority-menu">
                ${renderOption('low')}
                ${renderOption('medium')}
                ${renderOption('urgent')}
            </div>
        </div>
    `;
}

/**
 * @description Renders a single priority option for the priority selector component.
 * @param {string} value - The priority value (e.g., 'low', 'medium', 'urgent')
 * @return {string} HTML string representing the priority option
 */
function renderOption(value) {
    const label = value.charAt(0).toUpperCase() + value.slice(1);

    return `
        <div class="priority-option" data-value="${value}">
            <img src="assets/icons/priority/${value}.svg" alt=""> ${label}
        </div>
    `;
}

/* ==========================================================================
   SUB-TEMPLATES ASSIGNEES
   ========================================================================== */


export function renderAssigneeSelector(assigneeHtml = '', isFormStyle = false) {

    const wrapperClass = isFormStyle ? 'field-wrapper u-mb-md' : 'field-wrapper u-mb-lg';
    const triggerHtml = isFormStyle
        ? `
            <div class="field-group">
                <div class="assignee-trigger-field js-edit-assignees">
                    <div class="js-modal-avatars avatar-group">
                        ${assigneeHtml || '<span class="placeholder-text">Select members...</span>'}
                    </div>
                    <i class="fa-solid fa-angle-down u-ml-auto"></i>
                </div>
            </div>`
        : `
            <div class="avatar-group">
                <div class="js-modal-avatars">${assigneeHtml}</div>
                <button type="button" class="btn-icon btn-add-assignees u-ml-sm js-edit-assignees" title="Edit Assignees">
                    <i class="fa-solid fa-user-plus field-icon "></i>
                </button>
            </div>`;

    return `
        <div class="${wrapperClass}">
            <label class="modal-label u-mb-xs">Assignees</label>
            ${triggerHtml}
        </div>
    `;
}

/* ==========================================================================
   SUB-TEMPLATES SUBTASKS
   ========================================================================== */

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
   TEMPLATES FOR TASK MODAL - DELETE
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
   TEMPLATES FOR ADD/NEW TASK MODAL 
   ========================================================================== */

/**
 * @description Creates the HTML for adding a new task with full details.
 * @param {string} assigneeOptionsHtml - Pre-rendered <option> tags for team members
 * @return {string} HTML string
 */
export const createAddTaskModalHtml = (assigneeOptionsHtml) => {
    // Wir definieren eine Standard-Priorität für den neuen Task
    const defaultPriority = 'medium';

    return `
    <form id="js-add-task-form" class="modal-add-task" novalidate>
        <div class="modal-inline-edit-body">

            <div class="field-wrapper">
                <label class="modal-label u-mb-xs">Title</label>
                <div class="field-group">
                    <input type="text" name="title" class="field-input" placeholder="e.g. Design System" required>
                </div>
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper">
                <label class="modal-label u-mb-xs">Description</label>
                <div class="field-group">
                    <textarea name="description" class="field-input task-textarea" placeholder="What needs to be done?"></textarea>
                </div>
                 <div class="error-msg"></div>
            </div>

            <div class="field-row" style="display: flex; gap: 1rem;">
                <div class="field-wrapper" style="flex: 1;">
                    <label class="modal-label u-mb-xs">Due Date</label>
                    <div class="field-group">
                        <input type="date" name="dueDate" id="due-date" class="field-input">
                    </div>
                    <div class="error-msg"></div>
                </div>
                
                <div class="field-wrapper" style="flex: 1;">
                    <label class="modal-label u-mb-xs">Priority</label>
                    ${renderPrioritySelector('medium', true)}
                </div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                    ${renderAssigneeSelector('', true)}
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-margin-bottom-l">
                <label class="modal-label u-mb-xs">Subtasks</label>
                <div class="field-group subtask-input-group" style="display: flex; gap: 0.5rem;">
                    <input type="text" id="js-add-subtask-input" class="field-input" placeholder="Add subtask step">
                    <button type="button" id="js-add-subtask-btn" class="btn btn--primary" style="width: 40px">+</button>
                </div>
                <!-- Liste für die Subtask-Vorschau -->
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

