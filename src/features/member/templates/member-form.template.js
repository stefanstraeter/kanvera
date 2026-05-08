import { MEMBER_ROLE_OPTIONS } from '../../../shared/utils/constants.js';

/* ==========================================================================
   TEMPLATES FOR MEMBER FORM MODAL (ADD NEW MEMBER)
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
                
                    <div class="priority-select-container priority-select--form">
                        <input type="hidden" name="role" id="js-member-role-input" value="@developer">

                        <div class="priority-trigger js-member-role-toggle" data-role="@developer">
                            <div class="priority-content">
                                <span class="priority-text">developer</span>
                            </div>
                            <span class="priority-caret"><i class="fa-solid fa-angle-down"></i></span>
                        </div>

                        <div class="priority-options-menu is-hidden js-member-role-menu">
                            ${MEMBER_ROLE_OPTIONS.map(renderRoleOption).join('')}
                        </div>
                    </div>
                
                <div class="error-msg"></div>
            </div>

            <div class="field-wrapper u-margin-bottom-md">
                <label class="modal-label u-mb-xs">Email Address</label>
                <div class="field-group">
                    <input type="email" name="email" class="field-input" placeholder="mail@kanvera.com" required>
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

/* ==========================================================================
   HELPER FUNCTION TO RENDER ROLE OPTIONS
   ========================================================================== */

/**
 * @description Render a role option for the member form.
 * @param {string} role - The role to be rendered.
 * @return {string} HTML string for the role option.
 */
function renderRoleOption(role) {
    return `
        <div class="priority-option js-member-role-option" data-value="${role}">
            <span class="priority-text">${role}</span>
        </div>
    `;
}