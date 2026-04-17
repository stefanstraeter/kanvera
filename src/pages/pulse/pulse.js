// src/pages/pulse/pulse.js

import { initDataService } from '../../services/data-service.js';
import { getAllTasks, getPulseStats } from '../../services/task-service.js';
import { getGreetingConfig, formatDeadline } from './pulse-utils.js';


/* ==========================================================================
    INITIALIZATION
   ========================================================================== */
/**
 * @description Initialize the Pulse page by fetching necessary data and rendering the greeting and stats
 * @export
 */
export async function initPulsePage() {
    await initDataService();

    const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser")) || { guest: true };
    const stats = getPulseStats();

    renderPulseGreeting(currentUser);
    renderPulseStats(stats);
}

/* ==========================================================================
    RENDERING GREETING AND STATS
   ========================================================================== */
/**
 * @description Render the greeting section of the Pulse page based on user information and time of day
 * @param {Object} user - The user object containing user information
 */
function renderPulseGreeting(user) {
    const config = getGreetingConfig(user);

    document.getElementById('greetingTitle').innerText = config.title;
    document.getElementById('greetingSymbol').innerText = config.symbol;
    document.getElementById('pulseUserName').innerText = config.name;
    document.getElementById('greetingSubline').innerText = config.subline;
}

/**
 * @description Render the task statistics section of the Pulse page based on the provided stats data
 * @param {Object} stats - The stats object containing task statistics
 */
function renderPulseStats(stats) {
    document.getElementById('totalTasks').innerText = stats.total;
    document.getElementById('urgentCount').innerText = stats.urgent;
    document.getElementById('countTodo').innerText = stats.todo;
    document.getElementById('countDoing').innerText = stats.doing;
    document.getElementById('countAwait').innerText = stats.await;
    document.getElementById('countDone').innerText = stats.done;

    const deadlineEl = document.getElementById('nextDeadline');
    if (deadlineEl) {
        deadlineEl.innerText = formatDeadline(stats.nextDeadline);
    }
}

