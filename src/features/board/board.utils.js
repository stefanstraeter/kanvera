import { resolveMemberDetails } from '../member/member.utils.js';

import { getInitials, calculateProgressPercent } from '../../shared/utils/ui-helpers.js';

import { createAvatarHtml, createTaskCardHtml } from '../task/templates/task.template.js';

/* ==========================================================================
   TASK RENDERING PREPARATION
   ========================================================================== */

/**
 * @description Generates the HTML for assignee avatars based on their IDs, with an optional limit and overflow badge.
 * @export
 * @param {Array} assignedToIds - Array of user IDs assigned to the task
 * @param {number} [limit=5] - Maximum number of avatars to display before showing the overflow badge
 * @return {string} HTML string of avatars and optional overflow badge
 */
export function generateAvatarsHtml(assignedToIds, limit = 5) {
    if (!assignedToIds || assignedToIds.length === 0) return '';

    const total = assignedToIds.length;
    const showBadge = total > limit;
    const itemsToRender = showBadge ? limit - 1 : total;
    const displayIds = assignedToIds.slice(0, itemsToRender);
    const members = resolveMemberDetails(displayIds);

    let html = members.map(member => {
        const hasImage = member.imageUrl && member.imageUrl.trim() !== "";
        const initials = getInitials(member.name);
        return createAvatarHtml(member, initials, hasImage);
    }).join('');

    if (showBadge) {
        const extraCount = total - itemsToRender;
        html += `<div class="avatar avatar--s avatar--more" title="${total} Assignees">+${extraCount}</div>`;
    }
    return html;
}

/**
 * @description Prepares task data for rendering by calculating progress, generating assignee avatars, and adding properties needed for the task card template.
 * @export
 * @param {Object} task - The task data object
 * @return {Object} Prepared task data with additional properties for rendering
 */
export function prepareTaskData(task) {
    const subtasks = task.subtasks || [];
    const subCount = subtasks.length;
    const doneCount = subtasks.filter(st => st.done).length;

    return {
        ...task,
        hasSubtasks: subCount > 0,
        progress: calculateProgressPercent(doneCount, subCount),
        subtaskStatus: `${doneCount}/${subCount}`,
        assigneeAvatars: generateAvatarsHtml(task.assignedTo)
    };
}

/**
 * @description Renders a single task card by preparing the task data and creating the corresponding HTML.
 * @export
 * @param {Object} task - The task data object
 * @return {string} HTML string representing the task card
 */
export function renderSingleTask(task) {
    const preparedTask = prepareTaskData(task);
    return createTaskCardHtml(preparedTask);
}

/* ==========================================================================
   MODAL DATA EXTRACTION
   ========================================================================== */

/**
 * @description Extracts the edited values (title, description, priority, date) from the task detail modal.
 * @export
 * @return {Object} Object containing the edited values
 */
export function getTaskDataFromModal() {
    return {
        title: document.querySelector('[data-field="title"]')?.innerText.trim(),
        description: document.querySelector('[data-field="description"]')?.innerText.trim(),
        priority: document.querySelector('.js-priority-toggle')?.dataset.priority,
        dueDate: document.querySelector('.js-task-due-date')?.value
    };
}

/**
 * @description Extracts the index and status from the checkbox event.
 * @export
 * @param {Event} event - The change event triggered by the subtask checkbox
 * @return {Object} Object containing the index and status of the subtask
 */
export function getSubtaskChangeData(event) {
    return {
        index: event.target.dataset.index,
        isDone: event.target.checked
    };
}

/* ==========================================================================
   UI STATE & VISUALS
   ========================================================================== */

/**
 * @description Toggles the visual state of a subtask (strikethrough) without modifying the data.
 * @export
 * @param {number} index - The index of the subtask
 * @param {boolean} isDone - The completion status of the subtask
 */
export function toggleSubtaskVisuals(index, isDone) {
    const label = document.querySelector(`label[for="st-${index}"] .subtask-text`);
    label?.classList.toggle('is-done', isDone);
}

/**
 * @description Controls the visibility of the board wrapper.
 * @export
 */
export function showBoardWrapper() {
    const wrapper = document.querySelector('.board-wrapper');
    wrapper?.classList.add('is-visible');
}
