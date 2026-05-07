
/* ==========================================================================
   SUB-TEMPLATES PRIORITY SELECTOR
   ========================================================================== */
/**
 * @description Renders the priority selector component for the task detail modal, allowing users to view and change the priority of the task.
 * @param {string} currentPriority - The current priority value of the task
 * @param {boolean} [isFormStyle=false] - Flag to determine if the selector is rendered in form style (with caret) or inline style
 * @return {string} HTML string representing the priority selector component
 */
export function renderPrioritySelector(currentPriority, isFormStyle = false) {
    let styleClass = 'priority-select--inline';
    let inputId = 'js-priority-input-edit';
    let caretHtml = '';

    if (isFormStyle) {
        styleClass = 'priority-select--form';
        inputId = 'js-priority-input';
        caretHtml = '<span class="priority-caret"><i class="fa-solid fa-angle-down"></i></span>';
    }

    return `
        <div class="priority-select-container ${styleClass}">
            <input type="hidden" name="priority" id="${inputId}" value="${currentPriority}">
            
            <div class="js-priority-toggle priority-trigger priority--${currentPriority}" 
                 data-priority="${currentPriority}">
                
                <div class="priority-content">
                    <img src="assets/icons/priority/${currentPriority}.svg" alt="" class="priority-icon">
                    <span class="priority-text">${currentPriority}</span>
                </div>
                
                ${caretHtml}
            </div>
            
            <div class="priority-options-menu is-hidden js-priority-menu">
                ${renderOption('low')}
                ${renderOption('medium')}
                ${renderOption('urgent')}
            </div>
        </div>
    `;
}

/**
 * @description Renders a single priority option for the priority selector component.
 * @param {string} value - The priority value (e.g., 'low', 'medium', 'urgent')
 * @return {string} HTML string representing the priority option
 */
function renderOption(value) {
    const label = value.charAt(0).toUpperCase() + value.slice(1);

    return `
        <div class="priority-option" data-value="${value}">
            <img src="assets/icons/priority/${value}.svg" alt=""> ${label}
        </div>
    `;
}

/* ==========================================================================
   SUB-TEMPLATES ASSIGNEES
   ========================================================================== */


export function renderAssigneeSelector(assigneeHtml = '', isFormStyle = false) {

    const wrapperClass = isFormStyle ? 'field-wrapper u-mb-md' : 'field-wrapper u-mb-lg';
    const triggerHtml = isFormStyle
        ? `
            <div class="field-group">
                <div class="assignee-trigger-field js-edit-assignees">
                    <div class="js-modal-avatars avatar-group">
                        ${assigneeHtml || '<span class="placeholder-text">Select members...</span>'}
                    </div>
                    <i class="fa-solid fa-angle-down u-ml-auto"></i>
                </div>
            </div>`
        : `
            <div class="avatar-group">
                <div class="js-modal-avatars">${assigneeHtml}</div>
                <button type="button" class="btn-icon btn-add-assignees u-ml-sm js-edit-assignees" title="Edit Assignees">
                    <i class="fa-solid fa-user-plus field-icon "></i>
                </button>
            </div>`;

    return `
        <div class="${wrapperClass}">
            <label class="modal-label u-mb-xs">Assignees</label>
            ${triggerHtml}
        </div>
    `;
}