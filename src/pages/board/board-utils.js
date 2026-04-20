import { resolveMemberDetails } from '../../services/task-service.js';
import { getInitials, calculateProgressPercent } from '../../utils/ui-helpers.js';
import { createAvatarHtml, createTaskCardHtml } from './board-template.js';

/* ==========================================================================
  GENERAL BOARD UTILITIES
   ========================================================================== */
/**
 * @description Generates HTML for assignee avatars based on their contact IDs by resolving member details and creating avatar HTML for each assignee.
 * @export
 * @param {Array<string>} assignedToIds - Array of contact IDs for the assignees
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
 * @description Prepares task data for rendering by calculating progress, generating assignee avatars, and adding properties needed for the task card template. This function takes a task object and enriches it with additional properties that are used when rendering the task card in the UI.
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
 * @description Renders a single task card by preparing the task data and creating the corresponding HTML using the task card template. This function is used to generate the HTML for each task when rendering tasks in the board columns.
 * @export
 * @param {Object} task - The task data object
 * @return {string} HTML string representing the task card
 */
export function renderSingleTask(task) {
    const preparedTask = prepareTaskData(task);
    return createTaskCardHtml(preparedTask);
}