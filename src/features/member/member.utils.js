import { getState } from '../../core/state.js';


/* ==========================================================================
   MEMBER DATA RESOLUTION
   ========================================================================== */

/**
 * @description Gets the details of assignees based on their member IDs.
 * @export
 * @param {Array<string>} memberIds - An array of member IDs.
 * @return {Array<Object>} An array of assignee objects.
 */
export function resolveMemberDetails(memberIds) {
    if (!memberIds || !Array.isArray(memberIds)) return [];

    const state = getState();
    const team = state.team || {};

    return memberIds
        .map(id => team[id])
        .filter(member => !!member && member.name);
}

/* ==========================================================================
   DATA EXTRACTION FROM INPUT FIELDS
   ========================================================================== */

/**
 * @description Extracts member data from the contenteditable fields in the modal.
 * @export
 * @returns {Object} An object containing the extracted member data.
 */
export function getMemberDataFromModal() {
    const name = document.querySelector('[data-field="name"]')?.innerText.trim();
    const role = document.querySelector('[data-field="role"]')?.innerText.trim();
    const email = document.querySelector('[data-field="email"]')?.innerText.trim();
    const phone = document.querySelector('[data-field="phone"]')?.innerText.trim();

    return {
        name: name,
        roles: [role],
        email: email,
        phone: phone
    };
}


/* ==========================================================================
    MEMBER OBJECT CREATION
   ========================================================================== */
/**
 * @description Creates a structured member object from raw form data (used for new members).
 * @export
 * @param {Object} formData - The data from the add member form.
 * @returns {Object} A fresh member object.
 */
export function createNewMemberObject(formData) {
    return {
        name: formData.name,
        email: formData.email,
        roles: [formData.role],
        phone: formData.phone || "no phone",
        imageUrl: ""
    };
}