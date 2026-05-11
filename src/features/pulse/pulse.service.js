import { getAllTasks } from '../task/task.service.js';
import { getAllTeamMembers } from '../team/team.service.js';

/* ==========================================================================
    CONFIGURATION
    ========================================================================== */

const CATEGORIES = {
    TODO: ['up next'],
    DOING: ['in progress'],
    REVIEW: ['review'],
    DONE: ['done']
};


/* ==========================================================================
    PUBLIC API
    ========================================================================== */

/**
 * @description Returns top busy members based on in-progress assignments.
 * @export
 * @param {number} [limit=3] - Maximum number of members to return.
 * @return {Array} List of member workload rows.
 */
export function getBusiestMembers(limit = 3) {
    const tasks = getAllTasks();
    const members = getAllTeamMembers();
    const workload = getWorkloadMap(tasks);

    return members
        .map(member => ({
            id: member.id,
            name: member.name,
            imageUrl: member.imageUrl || '',
            color: member.color || 'var(--color-main)',
            count: workload[member.id] || 0
        }))
        .filter(member => member.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, limit);
}

/**
 * @description Returns all statistics needed by the Pulse page.
 * @export
 * @return {Object} Pulse stats object.
 */
export function getPulseStats() {
    const tasks = getAllTasks();
    const doneCount = filterByStatus(tasks, CATEGORIES.DONE).length;
    const totalCount = tasks.length;

    return {
        total: totalCount,
        todo: filterByStatus(tasks, CATEGORIES.TODO).length,
        doing: filterByStatus(tasks, CATEGORIES.DOING).length,
        await: filterByStatus(tasks, CATEGORIES.REVIEW).length,
        done: doneCount,
        urgent: filterUrgent(tasks).length,
        nextDeadline: findNextDeadline(tasks),
        productivity: calculateProductivity(totalCount, doneCount),
        busiestMembers: getBusiestMembers()
    };
}

/* ==========================================================================
    PRIVATE HELPERS
    ========================================================================== */
/**
 * @description Filters tasks by category values.
 * @param {Array} tasks - Source task list.
 * @param {Array} statusList - Allowed category values.
 * @return {Array} Filtered task list.
 */
const filterByStatus = (tasks, statusList) =>
    tasks.filter(t => statusList.includes(t.category));

/**
 * @description Filters urgent tasks.
 * @param {Array} tasks - Source task list.
 * @return {Array} Urgent tasks.
 */
const filterUrgent = (tasks) =>
    tasks.filter(t => t.priority === 'urgent');

/**
 * @description Calculates productivity percent.
 * @param {number} total - Total task count.
 * @param {number} done - Done task count.
 * @return {number} Percent value.
 */
function calculateProductivity(total, done) {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
}

/**
 * @description Finds next urgent task deadline.
 * @param {Array} tasks - Source task list.
 * @return {string|null} Next date or null.
 */
function findNextDeadline(tasks) {
    const urgentWithDate = filterUrgent(tasks).filter(t => t.dueDate);

    if (urgentWithDate.length === 0) return null;

    const sorted = urgentWithDate.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return sorted[0].dueDate;
}

/**
 * @description Builds workload map from in-progress tasks.
 * @param {Array} tasks - Source task list.
 * @return {Object} Member id to count map.
 */
function getWorkloadMap(tasks) {
    const workload = {};
    const doingTasks = filterByStatus(tasks, CATEGORIES.DOING);

    doingTasks.forEach(task => {
        const assignees = Array.isArray(task.assignedTo) ? task.assignedTo : [];
        assignees.forEach(memberId => {
            workload[memberId] = (workload[memberId] || 0) + 1;
        });
    });

    return workload;
}