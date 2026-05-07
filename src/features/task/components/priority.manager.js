/**
 * @description Manager class for handling priority selection logic and UI updates within the task management features.
 * @export
 * @class PriorityManager
 */
export class PriorityManager {
    constructor(hiddenInputId = 'js-priority-input') {
        this.hiddenInputId = hiddenInputId;
    }

    /**
     * @description Initializes the priority manager by binding event listeners to the priority menu and its options.
     * @return {void} 
     * @memberof PriorityManager
     */
    init() {
        const menu = document.querySelector('.js-priority-menu');
        if (!menu) return;

        this.bindPriorityToggle(menu);
        this.bindPriorityOptions(menu);
        this.bindOutsideClick(menu);
    }

    /* ==========================================================================
       LOGIC & DATA HANDLING
       ========================================================================== */

    /**
     * @description Handles the selection of a priority option, updating both the UI and the hidden input value to reflect the chosen priority.
     * @param {string} priority - The selected priority value.
     * @memberof PriorityManager
     */
    handlePrioritySelection(priority) {
        this.updatePriorityUI(priority);
        this.updateHiddenPriorityInput(priority);
    }

    /**
     * @description Updates the value of the hidden priority input element.
     * @param {string} priority - The selected priority value.
     * @memberof PriorityManager
     */
    updateHiddenPriorityInput(priority) {
        const hiddenInput = document.getElementById(this.hiddenInputId);
        if (hiddenInput) {
            hiddenInput.value = priority;
        }
    }

    /* ==========================================================================
       UI UPDATES 
       ========================================================================== */

    /**
     * @description Updates the priority display in the UI based on the selected priority, including text, icon, and styling.
     * @param {string} priority - The selected priority value.
     * @return {void}
     * @memberof PriorityManager
     */
    updatePriorityUI(priority) {
        const display = document.querySelector('.js-priority-toggle');
        if (!display) return;

        this.setPriorityText(display, priority);
        this.setPriorityIcon(display, priority);
        this.setPriorityClasses(display, priority);
    }

    /**
     * @description Sets the text content of the priority display based on the selected priority.
     * @param {HTMLElement} display - The priority display element.
     * @param {string} priority - The selected priority value.
     * @memberof PriorityManager
     */
    setPriorityText(display, priority) {
        const textElement = display.querySelector('.priority-text');
        if (textElement) textElement.textContent = priority;
    }

    /**
     * @description Sets the icon of the priority display based on the selected priority.
     * @param {HTMLElement} display - The priority display element.
     * @param {string} priority - The selected priority value.
     * @memberof PriorityManager
     */
    setPriorityIcon(display, priority) {
        const iconElement = display.querySelector('.priority-icon');
        if (iconElement) {
            iconElement.src = `assets/icons/priority/${priority}.svg`;
        }
    }

    /**
     * @description Updates the CSS classes of the priority display element to reflect the selected priority, ensuring the correct styling is applied.
     * @param {HTMLElement} display - The priority display element.
     * @param {string} priority - The selected priority value.
     * @memberof PriorityManager
     */
    setPriorityClasses(display, priority) {
        display.dataset.priority = priority;
        display.classList.remove('priority--low', 'priority--medium', 'priority--urgent');
        display.classList.add(`priority--${priority}`);
    }


    /* ==========================================================================
     EVENT BINDING
     ========================================================================== */

    /**
     * @description Binds the click event to the priority toggle button to show/hide the priority options menu.
     * @param {HTMLElement} menu - The priority options menu element.
     * @memberof PriorityManager
     */
    bindPriorityToggle(menu) {
        const toggle = document.querySelector('.js-priority-toggle');
        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('is-hidden');
        });
    }

    /**
     * @description Binds click events to each priority option in the menu to handle priority selection and update the UI accordingly.
     * @param {HTMLElement} menu - The priority options menu element.
     * @memberof PriorityManager
     */
    bindPriorityOptions(menu) {
        const options = document.querySelectorAll('.priority-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlePrioritySelection(option.dataset.value);
                menu.classList.add('is-hidden');
            });
        });
    }

    /**
     * @description Binds a click event to the document to hide the priority menu when clicking outside of it.
     * @param {HTMLElement} menu - The priority options menu element.
     * @memberof PriorityManager
     */
    bindOutsideClick(menu) {
        document.addEventListener('click', () => {
            menu.classList.add('is-hidden');
        });
    }
}