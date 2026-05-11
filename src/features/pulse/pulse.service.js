import { getAllTasks } from '../task/task.service.js';
import { getAllTeamMembers } from '../team/team.service.js';

/* ==========================================================================
   CONFIG & CONSTANTS
   ========================================================================== */

const CATEGORIES = {
    TODO: ['up next'],
    DOING: ['in progress'],
    REVIEW: ['review'],
    DONE: ['done']
};


/* ==========================================================================
   PUBLIC SERVICE FUNCTIONS
   ========================================================================== */

/**
 * @description Gathers and calculates all necessary statistics for the Pulse Dashboard, including task counts, productivity, and busiest team members.
 * @export
 * @param {number} [limit=3] - Optional limit for the number of busiest members to return
 * @return {Object} An object containing all relevant stats for the Pulse Dashboard
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
 * @description Gathers all relevant statistics for the Pulse Dashboard, including task counts by category, productivity percentage, next deadline, and busiest team members.
 * @export
 * @return {Object} An object containing all relevant stats for the Pulse Dashboard
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
   HELPERS & INTERNAL LOGIC 
   ========================================================================== */
/**
 * @description Filters tasks by their status category.
 * @param {Array} tasks - The list of tasks to filter.
 * @param {Array} statusList - The list of status categories to filter by.
 * @return {Array} The filtered list of tasks.
 */
const filterByStatus = (tasks, statusList) =>
    tasks.filter(t => statusList.includes(t.category));

/**
 * @description Filters tasks by their urgency.
 * @param {Array} tasks - The list of tasks to filter.
 * @return {Array} The filtered list of urgent tasks.
 */
const filterUrgent = (tasks) =>
    tasks.filter(t => t.priority === 'urgent');

/**
 * @description Calculates the productivity percentage based on the total number of tasks and the number of completed tasks.
 * @param {number} total - The total number of tasks.
 * @param {number} done - The number of completed tasks.
 * @return {number} The productivity percentage.
 */
function calculateProductivity(total, done) {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
}

/**
 * @description Finds the next upcoming deadline among urgent tasks.
 * @param {Array} tasks - The list of tasks to check.
 * @return {string|null} The next deadline date as a string, or null if none found.
 */
function findNextDeadline(tasks) {
    const urgentWithDate = filterUrgent(tasks).filter(t => t.dueDate);

    if (urgentWithDate.length === 0) return null;

    const sorted = urgentWithDate.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return sorted[0].dueDate;
}

/**
 * @description Generates a workload map for team members based on their assigned tasks.
 * @param {Array} tasks - The list of tasks to process.
 * @return {Object} A map of member IDs to their respective workload counts.
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