//src/pages/team/team-template.js

/**
 * @description Creates the HTML for a team member card.
 * @param {Object} member
 * @param {string} initials
 * @param {string} displayRole
 * @return {string} HTML string for the team member card
 */
export const createMemberCardHtml = (member, initials, displayRole) => {
    const imageTag = member.imageUrl
        ? `<img src="${member.imageUrl}" 
                alt="${member.name}" 
                style="display: none;" 
                onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                onerror="this.remove();">`
        : '';

    return `
        <div class="team-card team-card--clickable" data-id="${member.id}" role="button">
            <div class="team-card__avatar">
                <div class="team-avatar team-avatar--m">
                    ${imageTag}
                    <div class="avatar-placeholder">
                        ${initials}
                    </div>
                </div>
            </div>

            <div class="team-card__info">
                <h3 class="heading-l">${member.name}</h3>
                <p class="team-card__role">${displayRole}</p>
                
                <div class="team-card__contact-details">
                    <a href="mailto:${member.email}" class="team-card__link js-contact-link">
                        <i class="fa-regular fa-envelope"></i> ${member.email}
                    </a>
                    <a href="tel:${member.phone}" class="team-card__link js-contact-link">
                        <i class="fa-solid fa-phone"></i> ${member.phone}
                    </a>
                </div>
            </div>
        </div>
    `;
};


/**
 * @description Creates the HTML for the edit modal of a team member.
 * @param {Object} member
 * @param {string} initials
 * @param {string} displayRole
 * @return {string} HTML string for the edit modal of the team member
 */
export const createEditModalHtml = (member, initials, displayRole) => {
    return `
    <div class="modal-edit-container">
        <div class="team-card__delete">
            <button type="button" class="btn-icon btn-icon--danger js-delete-member" title="Delete Member">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
        
        <div class="modal-edit-header">
            <div class="team-avatar team-avatar--l">
                ${member.imageUrl
            ? `<img src="${member.imageUrl}" alt="${member.name}">`
            : `<div class="avatar-placeholder">${initials}</div>`
        }
            </div>
            <h3 class="heading-l js-edit-field" data-field="name" contenteditable="true" spellcheck="false">${member.name}</h3>
        </div>
        
        <div class="modal-inline-edit-body">
            <div class="inline-field">
                <i class="fa-regular fa-user field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Role</label>
                    <span class="js-edit-field" data-field="role" contenteditable="true" spellcheck="false">${displayRole}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-regular fa-envelope field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Email Address</label>
                    <span class="js-edit-field" data-field="email" contenteditable="true" spellcheck="false">${member.email}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-solid fa-phone field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Phone Number</label>
                    <span class="js-edit-field" data-field="phone" contenteditable="true" spellcheck="false">${member.phone || 'No Number'}</span>
                </div>
            </div>
        </div>

        <div class="modal__actions">
            <button type="button" class="btn btn--s btn--full btn--primary js-save-inline">Save Changes</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Cancel</button>
        </div>
    </div>
    `;
};

/**
 * @description Creates the HTML for the confirm delete modal.
 * @param {string} name - The name of the member to be deleted.
 * @return {string} HTML string for the confirm delete modal
 */
export const createConfirmDeleteHtml = (name) => {
    return `
        <div class="confirm-modal">
            <p>Are you sure you want to delete <strong>${name}</strong>? This action cannot be reversed.</p>
            <div class="modal__actions u-margin-top-l">
                <button class="btn btn--destructive btn--full btn--s js-confirm-delete-btn">Delete</button>
                <button class="btn btn--secondary btn--full btn--s js-close-modal">Cancel</button>
            </div>
        </div>
    `;
};

/**
 * @description Creates the HTML for adding a new team member using consistent input styles.
 * @return {string} HTML string for the add member form
 */
export const createAddMemberModalHtml = () => {
    return `
    <form id="js-add-member-form" class="modal-add-member">
        <div class="modal-inline-edit-body">
            
            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-margin-bottom-xs">Full Name</label>
                <div class="field-group">
                    <i class="fa-regular fa-user field-icon"></i>
                    <input type="text" name="name" class="field-input" placeholder="e.g. Jane Doe" required>
                </div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-margin-bottom-xs">Email Address</label>
                <div class="field-group">
                    <i class="fa-regular fa-envelope field-icon"></i>
                    <input type="email" name="email" class="field-input" placeholder="mail@example.com" required>
                </div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-margin-bottom-xs">Role</label>
                <div class="field-group">
                    <i class="fa-solid fa-briefcase field-icon"></i>
                    <select name="role" class="field-input">
                        <option value="@developer">@developer</option>
                        <option value="@designer">@designer</option>
                        <option value="@marketing">@marketing</option>
                        <option value="@guest">@guest</option>
                    </select>
                </div>
            </div>

            <div class="field-wrapper u-margin-bottom-l">
                <label class="modal-label u-margin-bottom-xs">Phone Number</label>
                <div class="field-group">
                    <i class="fa-solid fa-phone field-icon"></i>
                    <input type="tel" name="phone" class="field-input" placeholder="+49 123 456 789">
                </div>
            </div>

        </div>

        <div class="modal__actions">
            <button type="submit" class="btn btn--s btn--full btn--primary">Create Member</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Cancel</button>
        </div>
    </form>
    `;
};