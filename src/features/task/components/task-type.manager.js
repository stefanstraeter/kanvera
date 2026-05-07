import { TASK_TYPE_LABELS } from '../../../shared/utils/constants.js';

/* ==========================================================================
   TASK TYPE MANAGER
   ========================================================================== */

/**
 * @description Manager class for handling task type selection in the Add Task form.
 * @export
 * @class TaskTypeManager
 */
export class TaskTypeManager {

    /**
     * @description Initializes the task type dropdown by binding all event listeners.
     * @memberof TaskTypeManager
     */
    init() {
        const menu = document.querySelector('.js-task-type-menu');
        if (!menu) return;

        this.bindToggle(menu);
        this.bindOptions(menu);
        this.bindOutsideClick(menu);
    }

    /* ==========================================================================
       EVENT BINDING
       ========================================================================== */
    /**
     * @description Binds the toggle button click event to show or hide the task type menu.
     * @param {*} menu - The task type menu element.
     * @memberof TaskTypeManager
     */
    bindToggle(menu) {
        const toggle = document.querySelector('.js-task-type-toggle');
        toggle?.addEventListener('click', (event) => {
            event.stopPropagation();
            menu.classList.toggle('is-hidden');
        });
    }

    /**
     * @description Binds click events to each task type option in the menu to handle selection.
     * @param {*} menu - The task type menu element.
     * @memberof TaskTypeManager
     */
    bindOptions(menu) {
        menu.querySelectorAll('.task-type-option').forEach(option => {
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                this.handleSelection(option.dataset.value, menu);
            });
        });
    }

    /**
     * @description Binds a click event to the document to close the task type menu when clicking outside of it.
     * @param {*} menu - The task type menu element.
     * @memberof TaskTypeManager
     */
    bindOutsideClick(menu) {
        const listener = (event) => {
            if (!menu.contains(event.target) && !event.target.closest('.js-task-type-toggle')) {
                menu.classList.add('is-hidden');
                document.removeEventListener('click', listener);
            }
        };
        setTimeout(() => document.addEventListener('click', listener), 0);
    }

    /* ==========================================================================
       SELECTION LOGIC
       ========================================================================== */

    /**
     * @description Handles the selection of a task type from the menu.
     * @param {string} type - The selected task type value.
     * @param {*} menu - The task type menu element.
     * @memberof TaskTypeManager
     */
    handleSelection(type, menu) {
        this.updateHiddenInput(type);
        this.updateTrigger(type);
        menu.classList.add('is-hidden');
    }


    /**
     * @description Updates the hidden input field with the selected task type value.
     * @param {string} type - The selected task type value.
     * @memberof TaskTypeManager
     */
    updateHiddenInput(type) {
        const input = document.getElementById('js-task-type-input');
        if (input) input.value = type;
    }

    /**
     * @description Updates the task type toggle button with the selected task type value.
     * @param {string} type - The selected task type value.
     * @memberof TaskTypeManager
     */
    updateTrigger(type) {
        const toggle = document.querySelector('.js-task-type-toggle');
        if (!toggle) return;

        toggle.dataset.type = type;

        const text = toggle.querySelector('.priority-text');
        if (text) text.textContent = TASK_TYPE_LABELS[type] || type;
    }
}
