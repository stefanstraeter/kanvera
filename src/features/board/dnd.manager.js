// src/features/board/dnd.manager.js

import { updateTaskCategory } from '../task/task.service.js';

let currentDraggedId = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

/**
 * @description Initializes the drag-and-drop functionality for the board.
 * @export
 * @param {Array<Object>} columns - An array of column objects.
 * @param {Function} onUpdate - A callback function to be called when a task is updated.
 */
export function initDragAndDrop(columns, onUpdate) {
    columns.forEach(column => {
        const dropZone = document.getElementById(column.id);
        if (dropZone) {
            setupDropZone(dropZone, column.id, onUpdate);
        }
    });
}

/**
 * @description Binds all drag events to a specific drop zone.
 * @param {HTMLElement} dropZone - The drop zone element.
 * @param {string} columnId - The ID of the column.
 * @param {Function} onUpdate - A callback function to be called when a task is updated.
 */
function setupDropZone(dropZone, columnId, onUpdate) {
    dropZone.addEventListener('dragover', (event) => onDragOver(event, dropZone));
    dropZone.addEventListener('dragleave', () => onDragLeave(dropZone));
    dropZone.addEventListener('drop', (event) => onDrop(event, dropZone, columnId, onUpdate));
}

/* ==========================================================================
   EVENT HANDLER FOR DRAG AND DROP
   ========================================================================== */

/**
 * @description Handles the dragover event for a drop zone.
 * @param {DragEvent} event - The drag event.
 * @param {HTMLElement} element - The drop zone element.
 */
function onDragOver(event, element) {
    event.preventDefault();
    element.classList.add('board-column__drop-zone--highlight');
}

/**
 * @description Handles the dragleave event for a drop zone by removing the highlight class from the element.
 * @param {HTMLElement} element - The drop zone element.
 */
function onDragLeave(element) {
    element.classList.remove('board-column__drop-zone--highlight');
}

/**
 * @description Handles the drop event for a drop zone by updating the task's category and calling the onUpdate callback.
 * @param {DragEvent} event - The drag event.
 * @param {HTMLElement} element - The drop zone element.
 * @param {string} newCategory - The new category for the task.
 * @param {Function} onUpdate - A callback function to be called when a task is updated.
 */
async function onDrop(event, element, newCategory, onUpdate) {
    event.preventDefault();
    element.classList.remove('board-column__drop-zone--highlight');

    if (currentDraggedId) {
        updateTaskCategory(currentDraggedId, newCategory);
        onUpdate();
    }
}

/**
 * @description Attaches drag event listeners to a task card element to enable dragging functionality.
 * @export
 * @param {HTMLElement} cardElement - The task card element.
 */
export function attachDragEventToCard(cardElement) {
    cardElement.addEventListener('dragstart', () => {
        currentDraggedId = cardElement.id;
        cardElement.classList.add('task-card--dragging');
    });

    cardElement.addEventListener('dragend', () => {
        cardElement.classList.remove('task-card--dragging');
    });
}
