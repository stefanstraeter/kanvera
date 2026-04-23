// src/features/task/task-modal.template.js

/* ==========================================================================
   TEMPLATES FOR TASK DETAIL MODAL - EDIT
   ========================================================================== */

/**
 * @description Creates the HTML for the task detail modal.
 * @export
 * @param {Object} task - The task data object
 * @param {string} assigneeHtml - The HTML string representing the avatars
 * @return {string} HTML string
 */
export const createTaskDetailCardHtml = (task, assigneeHtml) => {
    return `
    <div class="modal-edit-container task-detail" data-id="${task.id}">
        <div class="team-card__delete">
            <button type="button" class="btn-icon btn-icon--danger modal__delete-icon js-delete-task" title="Delete Task">
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

        <div class="modal-inline-edit-body">
            <div class="task-detail__meta-grid u-mb-md">
                <div class="inline-field">
                    <div class="inline-edit-wrapper">
                        <label class="modal-label">Due Date</label>
                        <input type="date" class="field-input task-detail__date-input js-task-due-date" value="${task.dueDate || ''}">
                    </div>
                </div>

                <div class="inline-field">
                    <div class="inline-edit-wrapper">
                        <label class="modal-label">Priority</label>
                        <div class="priority-display priority--${task.priority}">
                            <span class="priority-text">${task.priority}</span>
                            <img src="assets/icons/priority/${task.priority}.svg" alt="${task.priority}" class="priority-icon">
                        </div>
                    </div>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Description</label>
                    <p class="task-detail__description modal-edit-field js-edit-field" data-field="description" contenteditable="true" spellcheck="false">
                        ${task.description || 'No description provided.'}
                    </p>
                </div>
            </div>

            <div class="inline-field u-mb-md">
                <div class="inline-edit-wrapper">
                    <label class="modal-label u-mb-xs">Subtasks</label>
                    <div class="subtask-list u-mb-sm">
                        ${renderSubtasksList(task.subtasks)}
                    </div>
                    <button type="button" class="btn btn--s btn--full btn--secondary js-add-subtask-btn">
                        <i class="fa-solid fa-plus btn-icon"></i> Add Subtask
                    </button>
                </div>
            </div>

            <div class="inline-field u-mb-lg">
                <div class="inline-edit-wrapper">
                    <label class="modal-label u-mb-xs">Assignees</label>
                    <div class="u-flex u-align-center">
                        <div class="avatar-group">
                            ${assigneeHtml}
                            <button type="button" class="btn-icon btn-icon--primary js-edit-assignees u-pl-md" title="Edit Assignees">
                              <i class="fa-solid fa-user-plus field-icon"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="modal__actions">
            <button type="button" class="btn btn--s btn--full btn--primary js-save-task">Save Changes</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Close</button>
        </div>
    </div>
    `;
};

/**
 * @description Renders the list of subtasks for the task detail modal.
 * @param {Array<Object>} [subtasks=[]] - The array of subtasks
 * @return {string} HTML string representing the list of subtasks
 */
function renderSubtasksList(subtasks = []) {
    if (subtasks.length === 0) return '<p class="task-detail__description">No subtasks yet</p>';

    return subtasks.map((st, i) => `
        <div class="subtask-item">
            <input type="checkbox"
                   id="st-${i}"
                   class="subtask-input js-subtask-toggle"
                   data-index="${i}"
                   ${st.done ? 'checked' : ''}
                   hidden />

            <label for="st-${i}" class="subtask-label">
                <i class="fa-regular fa-square icon-unchecked"></i>
                <i class="fa-solid fa-square-check icon-checked"></i>
                <span class="subtask-text ${st.done ? 'is-done' : ''}">${st.title}</span>
            </label>
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
