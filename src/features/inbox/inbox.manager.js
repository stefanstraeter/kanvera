import { AddTaskManager } from '../task/components/add-task.manager.js';
import { getInboxTasks, createInboxTaskCardHtml } from './inbox.service.js';

/* ==========================================================================
   INBOX MANAGER
   ========================================================================== */

/**
 * @description Manages UI interactions and rendering flow for the Inbox page.
 * @export
 * @class InboxManager
 */
export class InboxManager {
    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */

    /**
     * @description Creates the manager with default filter state and Add Task modal integration.
     */
    constructor() {
        this.activeStatus = 'all';
        this.addTaskManager = new AddTaskManager(() => this.render());
    }

    /**
     * @description Initializes event bindings and triggers the first page render.
     * @return {void}
     */
    init() {
        this.bindFilterButtons();
        this.bindCreateButtons();
        this.render();
        this.showWrapper();
    }

    /**
     * @description Adds visibility class to the wrapper for page fade-in behavior.
     * @return {void}
     */
    showWrapper() {
        const wrapper = document.querySelector('.inbox-wrapper');
        if (wrapper) {
            wrapper.classList.add('is-visible');
        }
    }

    /* ==========================================================================
       EVENT BINDINGS
       ========================================================================== */

    /**
     * @description Binds click handlers for status filter buttons and rerenders the list.
     * @return {void}
     */
    bindFilterButtons() {
        const buttons = document.querySelectorAll('.inbox-filter__btn');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.activeStatus = button.dataset.status || 'all';
                this.updateActiveFilterButton(buttons, button);
                this.render();
            });
        });
    }

    /**
     * @description Binds create-task actions from empty state and optional header button.
     * @return {void}
     */
    bindCreateButtons() {
        const emptyStateBtn = document.querySelector('.js-inbox-add-task');
        const headerBtn = document.getElementById('js-header-action');

        emptyStateBtn?.addEventListener('click', () => this.addTaskManager.init());

        if (headerBtn?.classList.contains('js-header-add-task')) {
            headerBtn.addEventListener('click', () => this.addTaskManager.init());
        }
    }

    /**
     * @description Updates active styling so only the selected filter button is highlighted.
     * @param {NodeListOf<Element>} allButtons - All available filter buttons.
     * @param {Element} activeButton - Button that should become active.
     * @return {void}
     */
    updateActiveFilterButton(allButtons, activeButton) {
        allButtons.forEach(button => button.classList.remove('is-active'));
        activeButton.classList.add('is-active');
    }

    /* ==========================================================================
       RENDERING
       ========================================================================== */

    /**
     * @description Renders task cards for current filter and toggles empty-state visibility.
     * @return {void}
     */
    render() {
        const list = document.getElementById('js-inbox-list');
        const emptyState = document.getElementById('js-inbox-empty');
        if (!list || !emptyState) return;

        const tasks = getInboxTasks(this.activeStatus);

        if (!tasks.length) {
            list.innerHTML = '';
            emptyState.classList.remove('is-hidden');
            return;
        }

        emptyState.classList.add('is-hidden');
        list.innerHTML = tasks.map(task => createInboxTaskCardHtml(task)).join('');
    }
}