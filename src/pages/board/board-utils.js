// src/pages/board/board-utils.js

import { resolveMemberDetails } from '../../services/task-service.js';
import { getInitials, calculateProgressPercent } from '../../utils/ui-helpers.js';
import { createAvatarHtml, createTaskCardHtml } from './task-template.js';

/* ==========================================================================
   TASK RENDERING PREPARATION
   ========================================================================== */
/**
 * @description Generates HTML for assignee avatars based on their member IDs by resolving member details and creating avatar HTML for each assignee.
 * @export
 * @param {Array<string>} assignedToIds - Array of member IDs for the assignees
 * @return {string} HTML string representing the avatars of the assignees
 */
export function generateAvatarsHtml(assignedToIds) {
    const members = resolveMemberDetails(assignedToIds);

    return members.map(member => {
        const hasImage = member.imageUrl && member.imageUrl.trim() !== "";
        const initials = getInitials(member.name);
        return createAvatarHtml(member, initials, hasImage);
    }).join('');
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
 * @description Extracts the edited values (title, description) from the task detail modal.
 * @export
 * @return {Object} Object containing the edited values
 */
export function getTaskDataFromModal() {
    return {
        title: document.querySelector('[data-field="title"]')?.innerText.trim(),
        description: document.querySelector('[data-field="description"]')?.innerText.trim()
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