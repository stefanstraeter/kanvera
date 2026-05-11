
import { getAllTasks } from '../task/task.service.js';

const TODO_CATEGORIES = ['up next'];
const DOING_CATEGORIES = ['in progress'];
const REVIEW_CATEGORIES = ['review'];
const DONE_CATEGORIES = ['done'];

/* ==========================================================================
   PULSE STATS
   ========================================================================== */

/**
 * @description Returns the statistics for the Pulse page based on the current tasks.
 * @export
 * @return {Object} An object containing the task statistics
 */
export function getPulseStats() {
    const tasks = getAllTasks();
    return {
        total: tasks.length,
        todo: countTasksByCategories(tasks, TODO_CATEGORIES),
        doing: countTasksByCategories(tasks, DOING_CATEGORIES),
        await: countTasksByCategories(tasks, REVIEW_CATEGORIES),
        done: countTasksByCategories(tasks, DONE_CATEGORIES),
        urgent: tasks.filter(task => task.priority === 'urgent').length,
        nextDeadline: tasks
            .filter(task => task.priority === 'urgent' && task.dueDate)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || null
    };
}

function countTasksByCategories(tasks, categories) {
    return tasks.filter(task => categories.includes(task.category)).length;
}
