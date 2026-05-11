/* ==========================================================================
   DELETE TASK TEMPLATE  
   ========================================================================== */

/**
 * @description Creates the HTML for the confirm delete modal of a task.
 * @param {string} taskTitle - The title of the task to be deleted.
 * @return {string} HTML string for the confirm delete modal.
 */
export const createConfirmDeleteTaskHtml = (taskTitle) => {
    return `
        <div class="confirm-modal">
            <p>Are you sure you want to delete the task <strong>"${taskTitle}"</strong>? This action cannot be reversed.</p>
            <div class="modal__actions u-margin-top-l">
                <button class="btn btn--destructive btn--full btn--s js-confirm-delete-task-btn">Delete Task</button>
                <button class="btn btn--secondary btn--full btn--s js-close-modal">Cancel</button>
            </div>
        </div>
    `;
};