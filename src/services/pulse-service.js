// src/services/pulse-service.js

import { getAllTasks } from './task-service.js';
// import { calculateProgressPercent } from '../utils/ui-helpers.js';

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
        todo: tasks.filter(task => task.category === 'to do').length,
        doing: tasks.filter(task => task.category === 'in progress').length,
        await: tasks.filter(task => task.category === 'await feedback').length,
        done: tasks.filter(task => task.category === 'done').length,
        urgent: tasks.filter(task => task.priority === 'urgent').length,
        nextDeadline: tasks
            .filter(task => task.priority === 'urgent' && task.dueDate)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || null
    };
}
