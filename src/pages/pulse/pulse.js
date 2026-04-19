// src/pages/pulse/pulse.js

import { initDataService } from '../../services/data-service.js';
import { getPulseStats } from '../../services/task-service.js';
import { getGreetingConfig, formatDeadline } from './pulse-utils.js';

/**
 * @description Page class for the Pulse page.
 * @export
 * @class PulsePage
 */
export class PulsePage {
    constructor() {
        this.statsMap = [
            { id: 'totalTasks', statKey: 'total' },
            { id: 'urgentCount', statKey: 'urgent' },
            { id: 'countTodo', statKey: 'todo' },
            { id: 'countDoing', statKey: 'doing' },
            { id: 'countAwait', statKey: 'await' },
            { id: 'countDone', statKey: 'done' }
        ];
    }
    /**
     * @description Initialize the Pulse page by loading necessary data and rendering the greeting and stats, then showing the pulse wrapper
     * @memberof PulsePage
     */
    init() {
        const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser")) || { guest: true };
        const stats = getPulseStats();

        this.renderGreeting(currentUser);
        this.renderStats(stats);
        this.showPulseWrapper();
    }

    /* ==========================================================================
     RENDERING GREETING & STATS
      ========================================================================== */
    /**
     * @description Show the pulse wrapper by adding the 'is-visible' class to it, making the content visible to the user
     * @memberof PulsePage
     */
    showPulseWrapper() {
        const wrapper = document.querySelector('.pulse-wrapper');
        if (wrapper) {
            wrapper.classList.add('is-visible');
        }
    }

    /**
     * @description Render the greeting section with the user's information
     * @param {Object} user - The user object containing user information
     * @memberof PulsePage
     */
    renderGreeting(user) {
        const config = getGreetingConfig(user);
        this.setElementText('greetingTitle', config.title);
        this.setElementText('greetingSymbol', config.symbol);
        this.setElementText('pulseUserName', config.name);
        this.setElementText('greetingSubline', config.subline);
    }

    /**
     * @description Set the text content of an HTML element by its ID
     * @param {string} id - The ID of the HTML element
     * @param {string} value - The text content to set
     * @memberof PulsePage
     */
    setElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = value;
        }
    }

    /**
     * @description Render the statistics section with the provided stats
     * @param {Object} stats - The statistics object containing various stats
     * @memberof PulsePage
     */
    renderStats(stats) {
        this.statsMap.forEach(item => {
            this.setElementText(item.id, stats[item.statKey]);
        });

        this.setElementText('nextDeadline', formatDeadline(stats.nextDeadline));
    }

    /**
     * @description Set the text content of an HTML element by its ID
     * @param {string} id - The ID of the HTML element
     * @param {string} value - The text content to set
     * @memberof PulsePage
     */
    setElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = value;
        }
    }
}