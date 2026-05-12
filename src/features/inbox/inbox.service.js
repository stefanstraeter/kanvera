import { getAllTasks } from '../task/task.service.js';
import { getCurrentUser } from '../auth/auth.service.js';


/* ==========================================================================
   PUBLIC API
   ========================================================================== */

/**
 * @description Returns inbox tasks for the current user filtered by status and sorted by due date.
 * @export
 * @param {string} activeStatus - Selected filter value.
 * @return {Array} Filtered task list.
 */
export function getInboxTasks(activeStatus) {
    const user = getCurrentUser();
    const userId = user?.id || 'guest-id';

    const myTasks = getAllTasks().filter(task => {
        const assignees = Array.isArray(task.assignedTo) ? task.assignedTo : [];
        return assignees.includes(userId);
    });

    const byStatus = activeStatus === 'all'
        ? myTasks
        : myTasks.filter(task => task.category === activeStatus);

    return byStatus.sort((a, b) => {
        const dateA = parseDateToTimestamp(a.dueDate);
        const dateB = parseDateToTimestamp(b.dueDate);
        return dateA - dateB;
    });
}

/**
 * @description Creates the Inbox task card markup for one task.
 * @export
 * @param {Object} task - Task item.
 * @return {string} HTML string.
 */
export function createInboxTaskCardHtml(task) {
    const dueLabel = formatDate(task.dueDate);
    const taskType = task.taskType || 'feature';
    const statusClass = getStatusDotClass(task.category);
    const statusLabel = formatStatus(task.category);
    const priority = task.priority || 'medium';

    return `
        <article class="task-card inbox-task-card">
            <div class="inbox-task-card__top">
                <span class="task-card__category inbox-task-card__type" data-type="${taskType}">${formatTaskType(taskType)}</span>
                <div class="inbox-task-card__priority">
                    <img src="assets/icons/priority/${priority}.svg" alt="${priority}" class="task-card__priority-icon">
                </div>
            </div>
            <h3 class="inbox-task-card__title">${task.title}</h3>
            <p class="inbox-task-card__description">${task.description || 'No description yet.'}</p>
            <div class="inbox-task-card__meta">
                <span class="inbox-task-card__status"><span class="status-dot ${statusClass}"></span>${statusLabel}</span>
                <span class="inbox-task-card__due">Due: ${dueLabel}</span>
                <a href="board.html" class="inbox-task-card__link">Open in Board</a>
            </div>
        </article>
    `;
}

/* ==========================================================================
   PRIVATE HELPERS
   ========================================================================== */

/**
 * @description Converts an optional date value into a sortable timestamp.
 * @param {string|null|undefined} value - Date input.
 * @return {number} Milliseconds timestamp or MAX_SAFE_INTEGER when invalid.
 */
function parseDateToTimestamp(value) {
    if (!value) return Number.MAX_SAFE_INTEGER;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return Number.MAX_SAFE_INTEGER;

    return date.getTime();
}

/**
 * @description Formats a date value for card display.
 * @param {string|null|undefined} value - Date input.
 * @return {string} Human-readable date label.
 */
function formatDate(value) {
    if (!value) return 'No date';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No date';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * @description Maps raw task type values to UI labels.
 * @param {string|undefined} value - Raw task type.
 * @return {string} Normalized task type label.
 */
function formatTaskType(value) {
    const typeMap = {
        feature: 'Feature',
        'ui/ux': 'UI/UX',
        'bug fix': 'Bug Fix'
    };

    return typeMap[value] || 'Feature';
}

/**
 * @description Maps raw status values to readable UI labels.
 * @param {string|undefined} value - Raw status.
 * @return {string} Normalized status label.
 */
function formatStatus(value) {
    const statusMap = {
        'up next': 'Up Next',
        'in progress': 'In Progress',
        review: 'Review',
        done: 'Done'
    };

    return statusMap[value] || 'Up Next';
}

/**
 * @description Maps raw status values to status-dot CSS modifier classes.
 * @param {string|undefined} value - Raw status.
 * @return {string} CSS class name for the dot color.
 */
function getStatusDotClass(value) {
    const statusMap = {
        'up next': 'status-dot--up-next',
        'in progress': 'status-dot--in-progress',
        review: 'status-dot--review',
        done: 'status-dot--done'
    };

    return statusMap[value] || 'status-dot--up-next';
}