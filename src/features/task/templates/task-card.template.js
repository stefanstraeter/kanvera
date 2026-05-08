import { formatTaskTypeLabel } from '../task.utils.js';

/* ==========================================================================
   TEMPLATES FOR TASK CARDS
   ========================================================================== */

/**
 * @description Renders the HTML for a single task card based on the provided task data.
 * @export
 * @param {Object} task
 * @return {string} HTML string representing the task card
 */
export function createTaskCardHtml(task) {
    return `
        <article class="task-card" draggable="true" id="${task.id}">
            <div class="task-card__category badge" data-type="${task.taskType}">${formatTaskTypeLabel(task.taskType)}</div>
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
                    <img src="assets/icons/priority/${task.priority}.svg" class="task-card__priority-icon" alt="${task.priority}">
                </div>
            </div>
        </article>
    `;
}

/* ==========================================================================
   TEMPLATES PROGRESS
   ========================================================================== */

/**
 * @description Renders the HTML for the progress section of a task card.
 * @param {Object} task
 * @return {string} HTML string representing the progress section
 */
function renderProgressSection(task) {
    return `
        <div class="task-card__progress">
            <div class="progress-bar">
                <div class="progress-bar__fill" style="width: ${task.progress}%"></div>
            </div>
            <!--<span class="progress-text">${task.subtaskStatus} Subtasks</span>-->
        </div>
    `;
}

/* ==========================================================================
   TEMPLATES AVATARS
   ========================================================================== */

/**
 * @description Generates the HTML for a single assignee avatar.
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
