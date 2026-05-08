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