import { TASK_TYPE_LABELS } from '../../shared/utils/constants.js';

/* ==========================================================================
   FORMATTERS FOR TASK PROPERTIES
   ========================================================================== */

/**
 * @description Formats a raw task type value into its display label.
 * @param {string} type - The task type value (e.g. 'ui/ux')
 * @return {string} The display label (e.g. 'UI/UX')
 */
export function formatTaskTypeLabel(type) {
    return TASK_TYPE_LABELS[type] || type;
}