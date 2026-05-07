/* ==========================================================================
   ASSIGNEES SELECTOR
   ========================================================================== */

/**
 * @description Renders the assignee selector component for the task detail modal.
 * @param {string} [assigneeHtml=''] 
 * @param {boolean} [isFormStyle=false] 
 * @return {string}
 */
/**
 * @description Renders the assignee selector component for the task detail modal.
 * @param {string} [assigneeHtml=''] 
 * @param {boolean} [isFormStyle=false] 
 * @return {string}
 */
export function renderAssigneeSelector(assigneeHtml = '', isFormStyle = false) {
    const labelClass = isFormStyle ? 'modal-label u-mb-xs' : 'modal-label';
    const content = assigneeHtml || (isFormStyle ? '<span class="placeholder-text">Select members...</span>' : '');

    const triggerHtml = isFormStyle
        ? `<div class="field-group">
                <div class="assignee-trigger-field js-edit-assignees">
                    <div class="js-modal-avatars avatar-group">${content}</div>
                    <i class="fa-solid fa-angle-down priority-caret"></i>
                </div>
           </div>`
        : `<div class="inline-field">
                <div class="avatar-group">
                    <div class="js-modal-avatars">${content}</div>
                    <button type="button" class="btn-icon btn-add-assignees u-ml-sm js-edit-assignees" title="Edit Assignees">
                        <i class="fa-solid fa-user-plus field-icon"></i>
                    </button>
                </div>
           </div>`;

    return `
        <label class="${labelClass}">Assignees</label>
        ${triggerHtml}
    `;
}


/* ==========================================================================
   CREATE DROPDOWN HTML    
   ========================================================================== */

/**
 * @description Creates the HTML for the dropdown menu.
 * @param {Array<Object>} allMembers The list of all members.
 * @param {Array<string>} assignedIds The list of assigned member IDs.
 * @returns {string} The HTML string for the dropdown.
 * @memberof AssigneeManager
 */
export function createDropdownHtml(allMembers, assignedIds) {
    const items = allMembers
        .map(member => renderItem(member, assignedIds.includes(member.id)))
        .join('');

    return `
            <div class="assignee-dropdown js-assignee-dropdown">
                <ul class="assignee-list">${items}</ul>
            </div>`;
}

/**
 * @description Renders a single member item for the dropdown.
 * @param {Object} member The member object.
 * @param {boolean} isAssigned Whether the member is assigned.
 * @returns {string} The HTML string for the member item.
 * @memberof AssigneeManager
 */
export function renderItem(member, isAssigned) {
    return `
            <li class="assignee-item ${isAssigned ? 'is-selected' : ''}" data-id="${member.id}">
                <div class="assignee-item__info">
                    <img src="${member.imageUrl}" class="avatar avatar--s" alt="">
                    <span class="assignee-name">${member.name}</span>
                </div>
                ${isAssigned ? '<i class="fa-solid fa-check check-icon"></i>' : ''}
            </li>`;
}