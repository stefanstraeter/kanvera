// src/features/board/board.template.js

/* ==========================================================================
   TEMPLATES FOR BOARD COLUMNS
   ========================================================================== */

/**
 * @description Renders the HTML for a single column on the board based on the provided column data, including the column title and a drop zone for tasks.
 * @export
 * @param {Object} data
 * @return {string} HTML string representing the column
 */
export function renderColumnHtml(data) {
    return `
        <section class="board-column">
            <div class="board-column__header">
                <span class="status-dot status-dot--${data.cssClass}"></span>
                <h2 class="board-column__title">${data.title}
                    <span class="column-count">(${data.taskCount})</span>
                </h2>
            </div>
            <div class="board-column__drop-zone js-drop-zone" id="${data.id}"></div>
        </section>
    `;
}
