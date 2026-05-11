import { getPulseStats } from './pulse.service.js';
import { getGreetingConfig, formatDeadline } from './pulse.utils.js';
import { getInitials } from '../../shared/utils/ui-helpers.js';

/**
 * @description
 * @export
 * @class PulseManager
 */
export class PulseManager {
    constructor() {
        this.onStateChanged = this.onStateChanged.bind(this);
    }

    /* ==========================================================================
        INITIALIZATION 
       ========================================================================== */
    /**
     * @description Initializes the Pulse Manager by setting up the user greeting, rendering initial stats, and attaching event listeners for state changes.
     * @memberof PulseManager
     */
    init() {
        this.setupUserGreeting();
        this.updatePulseWidgets();
        this.setupEventListeners();
        this.showContent();
    }
    /**
     * @description Sets up event listeners for the Pulse Manager.
     * @memberof PulseManager
     */
    setupEventListeners() {
        window.addEventListener('kanvera:state-changed', this.onStateChanged);
    }

    /* ==========================================================================
        MAIN RENDERING LOGIC
       ========================================================================== */

    /**
  * @description Handles state changes by updating the Pulse Dashboard widgets with the latest statistics.
  * @return {void}
  * @memberof PulseManager
  */
    onStateChanged() {
        this.updatePulseWidgets();
    }

    /**
     * @description Updates the Pulse Dashboard widgets with the latest statistics.
     * @memberof PulseManager
     */
    updatePulseWidgets() {
        const stats = getPulseStats();

        this.renderCounterStats(stats);
        this.renderDeadline(stats.nextDeadline);
        this.renderProductivity(stats.productivity);
        this.renderBusiestTeamMembers(stats.busiestMembers);
    }

    /* ==========================================================================
       RENDERING METHODS
       ========================================================================== */

    /**
     * @description Sets up the user greeting on the Pulse Dashboard based on the logged-in user's information, including their name, a personalized title, symbol, and subline.
     * @memberof PulseManager
     */
    setupUserGreeting() {
        const user = JSON.parse(sessionStorage.getItem("loggedInUser")) || { guest: true };
        const config = getGreetingConfig(user);

        this.updateText('greetingTitle', config.title);
        this.updateText('greetingSymbol', config.symbol);
        this.updateText('pulseUserName', config.name);
        this.updateText('greetingSubline', config.subline);
    }

    /**
     * @description Renders the counter statistics on the Pulse Dashboard, including total tasks, urgent tasks, and counts for each status category (To Do, Doing, Awaiting Review, Done).
     * @param {Object} stats - An object containing all relevant stats for the Pulse Dashboard
     * @memberof PulseManager
     */
    renderCounterStats(stats) {
        const mapping = {
            totalTasks: stats.total,
            urgentCount: stats.urgent,
            countTodo: stats.todo,
            countDoing: stats.doing,
            countAwait: stats.await,
            countDone: stats.done
        };

        Object.entries(mapping).forEach(([id, value]) => this.updateText(id, value));
    }

    /**
     * @description Renders the next deadline on the Pulse Dashboard.
     * @param {Date|string} date - The date of the next deadline
     * @memberof PulseManager
     */
    renderDeadline(date) {
        this.updateText('nextDeadline', formatDeadline(date));
    }

    /**
     * @description Renders the productivity percentage on the Pulse Dashboard.
     * @param {number} percent - The productivity percentage
     * @memberof PulseManager
     */
    renderProductivity(percent) {
        const value = percent || 0;
        const gauge = document.getElementById('productivityGauge');

        this.updateText('productivityPercent', `${value}%`);
        if (gauge) gauge.style.setProperty('--progress', `${value}%`);
    }

    /**
     * @description Renders the busiest team members on the Pulse Dashboard, showing their avatars, names, and workload counts. If there are no active workloads, displays a placeholder message.
     * @param {Array} members - An array of member objects containing id, name, imageUrl, color, and count properties
     * @return {void}
     * @memberof PulseManager
     */
    renderBusiestTeamMembers(members) {
        const list = document.getElementById('busyList');
        if (!list) return;

        if (members.length === 0) {
            list.innerHTML = '<li class="busy-empty color-medium-grey">No active workload yet</li>';
            return;
        }

        list.innerHTML = members.map(m => this.createMemberItemHtml(m)).join('');
    }

    /* ==========================================================================
       HTML TEMPLATES
       ========================================================================== */

    /**
     * @description Creates the HTML string for a single busiest team member item, including their avatar (with fallback to initials), name, and workload count.
     * @param {Object} member - An object containing id, name, imageUrl, color, and count properties
     * @return {string} The HTML string for a member item
     * @memberof PulseManager
     */
    createMemberItemHtml(member) {
        const initials = getInitials(member.name);
        const avatarContent = member.imageUrl
            ? `<img src="${member.imageUrl}" alt="${member.name}" class="avatar__img">`
            : initials;

        const bgStyle = member.imageUrl ? 'transparent' : member.color;

        return `
            <li class="busy-item">
                <div class="busy-member">
                    <div class="avatar avatar--s" style="background-color: ${bgStyle}">
                        ${avatarContent}
                    </div>
                    <span class="busy-name">${member.name}</span>
                </div>
                <span class="busy-count">${member.count}</span>
            </li>
        `;
    }

    /* ==========================================================================
       HELPERS
       ========================================================================== */
    /**
     * @description Updates the inner text of an HTML element with a given ID. If the element is not found, it does nothing.
     * @param {string} id - The ID of the HTML element to update
     * @param {string|number} value - The value to set as the inner text of the element
      * @return {void}
      * @memberof PulseManager
      */
    updateText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value ?? '';
    }

    /**
     * @description Shows the Pulse Dashboard content by adding the 'is-visible' class to the wrapper element. This method is called after the initial setup to reveal the dashboard to the user.
      * @return {void}
     * @memberof PulseManager
     */
    showContent() {
        const wrapper = document.querySelector('.pulse-wrapper');
        if (wrapper) wrapper.classList.add('is-visible');
    }
}