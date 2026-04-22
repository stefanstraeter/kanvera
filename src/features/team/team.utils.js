// src/features/team/team.utils.js

/* ==========================================================================
   TEAM PAGE UTILS
   ========================================================================== */

/**
 * @description Extracts member data from the edit/add member modal.
 * @return {Object} - An object containing the member data.
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

/**
 * @description Creates a new member object based on form data. This is used when adding a new member to the team.
 * @export
 * @param {Object} formData - The form data containing member information.
 * @return {Object} - A new member object.
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
