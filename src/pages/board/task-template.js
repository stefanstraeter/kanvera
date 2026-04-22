//src/pages/board/task-template.js

/* ==========================================================================
    TEMPLATES FOR TASK CARDS
    ========================================================================== */
/**
 * @description Renders the HTML for a single task card based on the provided task data, including task details, progress, assignees, and priority.
 * @export
 * @param {Object} task
 * @return {string} HTML string representing the task card
 */
export function createTaskCardHtml(task) {
    return `
        <article class="task-card" draggable="true" id="${task.id}">
            <div class="task-card__category badge">${task.taskType}</div>
            <div class="task-card__content">
                <h3 class="task-card__title">${task.title}</h3>
                <p class="task-card__description">${task.description}</p>
            </div>
            
            ${task.hasSubtasks ? renderProgressSection(task) : ''}

            <div class="task-card__footer">
                <div class="task-card__assignees">
                    <div class="avatar-group">${task.assigneeAvatars}</div>
                </div>
                <div class="task-card__priority">
                    <img src="assets/icons/priority/${task.priority}.svg" alt="${task.priority}">
                </div>
            </div>
        </article>
    `;
}

/* ==========================================================================
    TEMPLATES PROGRESS
    ========================================================================== */
/**
 * @description Renders the HTML for the progress section of a task card based on the provided task data, including the progress bar and subtask status.
 * @param {Object} task
 * @return {string} HTML string representing the progress section
 */
function renderProgressSection(task) {
    return `
        <div class="task-card__progress">
            <div class="progress-bar">
                <div class="progress-bar__fill" style="width: ${task.progress}%"></div>
            </div>
            <span class="progress-text">${task.subtaskStatus} Subtasks</span>
        </div>
    `;
}

/* ==========================================================================
    TEMPLATES AVATARS
    ========================================================================== */
/**
 * @description Generates the HTML for assignee avatars based on the provided array of assignedToIds by resolving member details and creating avatar HTML for each member.
 * @export
 * @param {Object} member
 * @param {string} initials
 * @param {boolean} hasImage
 * @return {string} HTML string representing the avatar
 */
export function createAvatarHtml(member, initials, hasImage) {
    const bgColor = hasImage ? 'transparent' : (member.color || 'var(--color-main)');

    return `
        <div class="avatar avatar--s" style="background-color: ${bgColor}" title="${member.name}">
            ${hasImage
            ? `<img src="${member.imageUrl}" alt="${member.name}" class="avatar__img">`
            : initials
        }
        </div>
    `;
}


/* ==========================================================================
    TEMPLATES FOR TASK DETAIL MODAL
    ========================================================================== */
/**
 * @description Creates the HTML for the task detail modal.
 * @export
 * @param {Object} task - The task data object
 * @param {string} assigneeHtml - The HTML string representing the avatars
 * @return {string} HTML string
 */
export const createTaskDetailHtml = (task, assigneeHtml) => {
    return `
    <div class="modal-edit-container task-detail" data-id="${task.id}">
        <div class="team-card__delete">
            <button type="button" class="btn-icon btn-icon--danger js-delete-task" title="Delete Task">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>

        <div class="mb-sm">
            <div class="task-card__category badge">${task.taskType}</div>
        </div>

        <h3 class="heading-xl js-edit-task-field mb-md" data-field="title" contenteditable="true" spellcheck="false">
            ${task.title}
        </h3>
        
        <div class="task-detail__meta-grid mb-lg">
            <div class="meta-item">
                <label class="modal-label">Due Date:</label>
                <input type="date" class="field-input js-task-due-date" value="${task.dueDate || ''}">
            </div>

            <div class="meta-item">
                <label class="modal-label">Priority:</label>
                <div class="priority-display priority--${task.priority}">
                    <span class="u-text-capitalize">${task.priority}</span>
                    <img src="assets/icons/priority/${task.priority}.svg" alt="${task.priority}" class="priority-icon--small">
                </div>
            </div>
        </div>

        <div class="u-margin-bottom-lg">
            <label class="modal-label mb-xs">Description</label>
            <p class="task-detail__description js-edit-task-field" data-field="description" contenteditable="true" spellcheck="false">
                ${task.description || 'No description provided.'}
            </p>
        </div>

        <div class="task-detail__section u-margin-bottom-lg">
            <label class="modal-label mb-sm">Subtasks</label>
            <div class="subtask-list u-margin-bottom-sm">
                ${renderSubtasksList(task.subtasks)}
            </div>
            <button type="button" class="btn btn--s btn--full btn--secondary js-add-subtask-btn">
                <i class="fa-solid fa-plus"></i> Add Subtask        
            </button>
        </div>

        <div class="task-detail__section">
            <label class="modal-label mb-sm">Assignees</label>
            <div class="u-flex-between u-align-center">
                <div class="avatar-group">
                    ${assigneeHtml || '<p class="u-text-body-m u-text-muted">No one assigned</p>'}
                     <button type="button" class="btn-icon btn-icon--primary js-edit-assignees" title="Edit Assignees">
                    <i class="fa-solid fa-user-plus"></i>
                </button>
                </div>
               
            </div>
        </div>

        <div class="modal__actions u-margin-top-xl">
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
    if (subtasks.length === 0) return '<p class="u-text-body-m u-text-muted">No subtasks defined.</p>';

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