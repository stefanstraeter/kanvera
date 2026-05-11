import { getPulseStats } from './pulse.service.js';
import { getGreetingConfig, formatDeadline } from './pulse.utils.js';
import { getInitials } from '../../shared/utils/ui-helpers.js';

/**
 * @description Handles rendering and live updates for the Pulse page.
 * @export
 * @class PulseManager
 */
export class PulseManager {
    constructor() {
        this.onStateChanged = this.onStateChanged.bind(this);
    }

    /* ==========================================================================
       LIFECYCLE
       ========================================================================== */
    /**
        * @description Initializes greeting, widgets, event listeners, and page visibility.
     * @memberof PulseManager
     */
    init() {
        this.setupUserGreeting();
        this.updatePulseWidgets();
        this.setupEventListeners();
        this.showContent();
    }
    /**
        * @description Registers page-level event listeners.
     * @memberof PulseManager
     */
    setupEventListeners() {
        window.addEventListener('kanvera:state-changed', this.onStateChanged);
    }

    /* ==========================================================================
             STATE UPDATE FLOW
             ========================================================================== */

    /**
         * @description Handles state changes by refreshing Pulse widgets.
         * @return {void}
         * @memberof PulseManager
         */
    onStateChanged() {
        this.updatePulseWidgets();
    }

    /**
         * @description Refreshes all widget areas using latest statistics.
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
         RENDERING
         ========================================================================== */

    /**
        * @description Renders greeting text based on the logged-in user.
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
        * @description Renders all numeric counter values.
        * @param {Object} stats - Pulse statistics object.
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
        * @description Renders the next urgent deadline label.
        * @param {Date|string} date - Next deadline date value.
     * @memberof PulseManager
     */
    renderDeadline(date) {
        this.updateText('nextDeadline', formatDeadline(date));
    }

    /**
        * @description Renders productivity percentage and gauge progress.
        * @param {number} percent - Productivity percentage.
     * @memberof PulseManager
     */
    renderProductivity(percent) {
        const value = percent || 0;
        const gauge = document.getElementById('productivityGauge');

        this.updateText('productivityPercent', `${value}%`);
        if (gauge) gauge.style.setProperty('--progress', `${value}%`);
    }

    /**
        * @description Renders the top busy members list or empty state.
        * @param {Array} members - Member rows with avatar and count data.
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
         TEMPLATES
         ========================================================================== */

    /**
        * @description Builds HTML for one busy-member row.
        * @param {Object} member - Member with name, avatar, and count.
        * @return {string} HTML string for a list row.
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
             DOM HELPERS
             ========================================================================== */
    /**
         * @description Updates text content of an element by id.
         * @param {string} id - Target element id.
         * @param {string|number} value - Text value to render.
         * @return {void}
         * @memberof PulseManager
         */
    updateText(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerText = value ?? '';
    }

    /**
         * @description Makes the Pulse content visible.
         * @return {void}
     * @memberof PulseManager
     */
    showContent() {
        const wrapper = document.querySelector('.pulse-wrapper');
        if (wrapper) wrapper.classList.add('is-visible');
    }
}