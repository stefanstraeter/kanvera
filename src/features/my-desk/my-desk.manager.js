import { AddTaskManager } from '../task/components/add-task.manager.js';
import { getMyDeskTasks, createMyDeskTaskCardHtml } from './my-desk.service.js';

/* ==========================================================================
   MY DESK MANAGER
   ========================================================================== */

/**
 * @description Manages UI interactions and rendering flow for the My Desk page.
 * @export
 * @class MyDeskManager
 */
export class MyDeskManager {
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
        const wrapper = document.querySelector('.my-desk-wrapper');
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
        const buttons = document.querySelectorAll('.my-desk-filter__btn');

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
        const emptyStateBtn = document.querySelector('.js-my-desk-add-task');
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
        const list = document.getElementById('js-my-desk-list');
        const emptyState = document.getElementById('js-my-desk-empty');
        if (!list || !emptyState) return;

        const tasks = getMyDeskTasks(this.activeStatus);

        if (!tasks.length) {
            list.innerHTML = '';
            emptyState.classList.remove('is-hidden');
            return;
        }

        emptyState.classList.add('is-hidden');
        list.innerHTML = tasks.map(task => createMyDeskTaskCardHtml(task)).join('');
    }
}