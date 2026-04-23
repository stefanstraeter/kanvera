// src/features/member/member-modal.template.js

/* ==========================================================================
   TEMPLATES FOR MEMBER DETAIL MODAL - EDIT
   ========================================================================== */

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
            <button type="button" class="btn-icon btn-icon--danger modal__delete-icon js-delete-member" title="Delete Member">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>

        <div class="modal__edit-header-member">
            <div class="avatar avatar--l">
                ${member.imageUrl
            ? `<img src="${member.imageUrl}" alt="${member.name}">`
            : `<div class="avatar-placeholder">${initials}</div>`
        }
            </div>
            <h3 class="heading-l modal-edit-field js-edit-field" data-field="name" contenteditable="true" spellcheck="false">${member.name}</h3>
        </div>

        <div class="modal-inline-edit-body">
            <div class="inline-field">
                <i class="fa-regular fa-user field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Role</label>
                    <span class="modal-edit-field js-edit-field" data-field="role" contenteditable="true" spellcheck="false">${displayRole}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-regular fa-envelope field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Email Address</label>
                    <span class="modal-edit-field js-edit-field" data-field="email" contenteditable="true" spellcheck="false">${member.email}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-solid fa-phone field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Phone Number</label>
                    <span class="modal-edit-field js-edit-field" data-field="phone" contenteditable="true" spellcheck="false">${member.phone || 'No Number'}</span>
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


/* ==========================================================================
   TEMPLATES FOR MEMBER DETAIL MODAL - DELETE
   ========================================================================== */

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


/* ==========================================================================
   TEMPLATES FOR MEMBER DETAIL MODAL - ADD NEW MEMBER
   ========================================================================== */

/**
 * @description Creates the HTML for adding a new team member using consistent input styles.
 * @return {string} HTML string for the add member form
 */
export const createAddMemberModalHtml = () => {
    return `
    <form id="js-add-member-form" class="modal-add-member" novalidate>
        <div class="modal-inline-edit-body">

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-mb-xs">Full Name</label>
                <div class="field-group">
                    <input type="text" name="name" class="field-input" placeholder="e.g. Jane Doe" required>
                </div>
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-mb-xs">Role</label>
                <div class="field-group">
                    <select name="role" class="field-input">
                        <option value="@developer">@developer</option>
                        <option value="@designer">@designer</option>
                        <option value="@marketing">@marketing</option>
                        <option value="@guest">@guest</option>
                    </select>
                </div>
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-mb-xs">Email Address</label>
                <div class="field-group">
                    <input type="email" name="email" class="field-input" placeholder="mail@example.com" required>
                </div>
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-margin-bottom-l">
                <label class="modal-label u-mb-xs">Phone Number</label>
                <div class="field-group">
                    <input type="tel" name="phone" class="field-input" placeholder="+49 123 456 789">
                </div>
                <div class="error-msg"></div>
            </div>

        </div>

        <div class="modal__actions">
            <button type="submit" class="btn btn--s btn--full btn--primary">Add Member</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Cancel</button>
        </div>
    </form>
    `;
};
