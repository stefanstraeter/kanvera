// src/pages/board/board-template.js
/**
 * @description Renders the HTML for a single column on the board based on the provided column data, including the column title and a drop zone for tasks.
 * @export
 * @param {Object} data
 * @return {string} HTML string representing the column
 */
export function renderColumnHtml(data) {
    return `
        <section class="board-column">
            <div class="board-column__header">
                <span class="status-dot status-dot--${data.cssClass}"></span>
                <h2 class="board-column__title">${data.title}</h2>
            </div>
            <div class="board-column__drop-zone js-drop-zone" id="${data.id}"></div>
        </section>
    `;
}
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

