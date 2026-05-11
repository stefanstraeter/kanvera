/**
 * @description Manager for the board search functionality. Handles live filtering of tasks across all columns.
 * @export
 * @class BoardSearchManager
 */
export class BoardSearchManager {
    constructor() {
        this.searchInput = null;
        this.resetButton = null;
    }

    /**
     * @description Initializes the search functionality by attaching event listeners
     * @memberof BoardSearchManager
     */
    init() {
        this.searchInput = document.getElementById('js-search-task');
        this.resetButton = document.getElementById('js-search-reset');

        if (!this.searchInput || !this.resetButton) return;

        this.attachInputListener();
        this.attachResetListener();
    }

    /**
     * @description Attaches the input event listener for live search
     * @private
     * @memberof BoardSearchManager
     */
    attachInputListener() {
        this.searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            this.performSearch(searchTerm);
        });
    }

    /**
     * @description Attaches the click listener to the reset button
     * @private
     * @memberof BoardSearchManager
     */
    attachResetListener() {
        this.resetButton.addEventListener('click', () => {
            this.clearSearch();
        });
    }

    /**
     * @description Filters all tasks based on search term and updates visibility
     * @param {string} searchTerm - The text to search for
     * @memberof BoardSearchManager
     */
    performSearch(searchTerm) {
        const trimmedTerm = searchTerm.toLowerCase().trim();

        if (trimmedTerm === '') {
            this.showAllTasks();
            return;
        }

        this.filterTasksByTerm(trimmedTerm);
    }

    /**
     * @description Filters tasks by matching the search term against task title and description
     * @private
     * @param {string} searchTerm - The lowercase search term
     * @memberof BoardSearchManager
     */
    filterTasksByTerm(searchTerm) {
        const allTaskCards = document.querySelectorAll('[data-task-id]');

        allTaskCards.forEach((card) => {
            const title = card.querySelector('.task-card__title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.task-card__description')?.textContent.toLowerCase() || '';

            const matches = title.includes(searchTerm) || description.includes(searchTerm);
            this.setTaskVisibility(card, matches);
        });

        this.updateEmptyStates();
    }

    /**
     * @description Shows all tasks and removes hidden state
     * @private
     * @memberof BoardSearchManager
     */
    showAllTasks() {
        const allTaskCards = document.querySelectorAll('[data-task-id]');
        allTaskCards.forEach((card) => {
            this.setTaskVisibility(card, true);
        });

        this.updateEmptyStates();
    }

    /**
     * @description Sets the visibility of a task card
     * @private
     * @param {HTMLElement} card - The task card element
     * @param {boolean} isVisible - Whether the card should be visible
     * @memberof BoardSearchManager
     */
    setTaskVisibility(card, isVisible) {
        if (isVisible) {
            card.classList.remove('is-hidden');
        } else {
            card.classList.add('is-hidden');
        }
    }

    /**
     * @description Updates empty state messages for each column when no tasks match
     * @private
     * @memberof BoardSearchManager
     */
    updateEmptyStates() {
        const columns = document.querySelectorAll('[data-column-id]');

        columns.forEach((column) => {
            const visibleTasks = column.querySelectorAll('[data-task-id]:not(.is-hidden)');
            const emptyMessage = column.querySelector('.column-empty-message');

            if (visibleTasks.length === 0 && emptyMessage) {
                emptyMessage.classList.remove('is-hidden');
            } else if (emptyMessage) {
                emptyMessage.classList.add('is-hidden');
            }
        });
    }

    /**
     * @description Clears the search input and shows all tasks
     * @memberof BoardSearchManager
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.showAllTasks();
    }

    /**
     * @description Gets the current search term
     * @return {string} The current search input value
     * @memberof BoardSearchManager
     */
    getSearchTerm() {
        return this.searchInput ? this.searchInput.value.trim() : '';
    }
}
