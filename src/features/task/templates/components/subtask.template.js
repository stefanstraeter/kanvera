/* ==========================================================================
   SUBTASKS LIST COMPONENT
   ========================================================================== */

/**
 * @description Renders the list of subtasks for the task detail modal.
 * @param {Array<Object>} [subtasks=[]] - The array of subtasks
 * @return {string} HTML string representing the list of subtasks
 */
export function renderSubtasksList(subtasks = [], taskId) {
    if (subtasks.length === 0) return '<p class="task-detail__description"></p>';

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

