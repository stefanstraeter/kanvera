/* ==========================================================================
   SUBTASKS SECTION COMPONENT
   ========================================================================== */

/**
 * @description Renders the subtask section in either form style or inline-edit style.
 * @param {Array<Object>} [subtasks=[]] - The array of subtasks
 * @param {string|null} [taskId=null] - Task ID for persistent tasks
 * @param {boolean} [isFormStyle=false] - Switches between add-form and inline-edit layout
 * @return {string} HTML string
 */
export function renderSubtaskSection(subtasks = [], taskId = null, isFormStyle = false) {
    if (isFormStyle) {
        return `
            <label class="modal-label u-mb-xs">Subtasks</label>
            <div class="field-group subtask-input-group" style="display: flex; gap: 0.5rem;">
                <input type="text" id="js-add-subtask-input" class="field-input" placeholder="e.g. Make coffee">
                <button type="button" id="js-add-subtask-btn" class="btn-add-subtask js-add-subtask-btn" title="Add Subtask">
                    <i class="fa-solid fa-plus btn-icon"></i>
                </button>
            </div>
            <div id="js-temp-subtask-list" class="subtask-preview-list u-mt-sm">
                ${renderSubtasksList(subtasks, taskId, true)}
            </div>
        `;
    }

    return `
        <label class="modal-label u-mb-xs">Subtasks</label>
        <div class="subtask-list u-mb-sm">
            ${renderSubtasksList(subtasks, taskId)}
        </div>
        <button type="button" class="btn btn--s btn--full btn--secondary js-add-subtask-btn">
            <div class="btn-group">
                <i class="fa-solid fa-plus btn-icon"></i>
                <span>Add Subtask</span>
            </div>
        </button>
    `;
}

/* ==========================================================================
   SUBTASKS LIST COMPONENT
   ========================================================================== */

/**
 * @description Renders the list of subtasks for the task detail modal.
 * @param {Array<Object>} [subtasks=[]] - The array of subtasks
 * @param {boolean} [isFormStyle=false] - Renders add-form style list without checkbox controls
 * @return {string} HTML string representing the list of subtasks
 */
export function renderSubtasksList(subtasks = [], taskId, isFormStyle = false) {
    if (subtasks.length === 0) return '<p class="task-detail__description"></p>';

    if (isFormStyle) {
        return subtasks.map((st, i) => `
            <div class="subtask-item">
                <span class="subtask-text modal-edit-field js-subtask-text" 
                      contenteditable="true" 
                      data-index="${i}">${st.title || ''}</span>

                <button type="button" class="btn-icon btn-trash-icon u-pl-sm u-pr-sm js-delete-subtask" data-index="${i}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }

    return subtasks.map((st, i) => `
        <div class="subtask-item">
            <input type="checkbox" 
                   id="st-${taskId}-${i}" 
                   class="subtask-input js-subtask-toggle" 
                   data-index="${i}" 
                   ${st.done ? 'checked' : ''} 
                   hidden />
            
            <label for="st-${taskId}-${i}" class="subtask-checkbox-label">
                <i class="fa-regular fa-square icon-unchecked"></i>
                <i class="fa-solid fa-square-check icon-checked"></i>
            </label>

            <span class="subtask-text modal-edit-field js-subtask-text ${st.done ? 'is-done' : ''}" 
                  contenteditable="true" 
                  data-index="${i}">${st.title}</span>

            <button type="button" class="btn-icon btn-trash-icon u-pl-sm u-pr-sm js-delete-subtask" data-index="${i}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

