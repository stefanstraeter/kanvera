// src/utils/ui-helpers.js

/* ==========================================================================
    UI COMPONENT HELPERS
   ========================================================================== */
/**
* @description Generates initials from a given name. 
* @export
* @param {string} name - The name from which to generate initials.
* @return {string} - The generated initials.
*/
export function getInitials(name) {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    const initials = parts.map(part => part.charAt(0).toUpperCase());

    if (initials.length > 1) {
        return initials[0] + initials[initials.length - 1];
    }
    return initials[0];
}
