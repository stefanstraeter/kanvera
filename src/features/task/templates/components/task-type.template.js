import { TASK_TYPES } from '../../../../shared/utils/constants.js';

/* ==========================================================================
   TASK TYPE SELECTOR
   ========================================================================== */

/**
 * @description Renders the task type selector in form style, matching the priority dropdown.
 * @param {string} [currentType='feature'] - The initially selected task type value
 * @return {string} HTML string
 */
export function renderTaskTypeSelector(currentType = 'feature') {
    const current = TASK_TYPES.find(type => type.value === currentType) || TASK_TYPES[0];

    return `
        <div class="priority-select-container priority-select--form">
            <input type="hidden" name="taskType" id="js-task-type-input" value="${current.value}">

            <div class="priority-trigger js-task-type-toggle" data-type="${current.value}">
                <span class="priority-text">${current.label}</span>
                <span class="priority-caret"><i class="fa-solid fa-angle-down"></i></span>
            </div>

            <div class="task-type-options-menu is-hidden js-task-type-menu">
                ${TASK_TYPES.map(renderOption).join('')}
            </div>
        </div>
    `;
}

function renderOption({ value, label }) {
    return `
        <div class="task-type-option" data-value="${value}">
            <span class="priority-text">${label}</span>
        </div>
    `;
}
