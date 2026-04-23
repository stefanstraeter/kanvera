/**
 * Member Utilities
 * Helper functions for extracting and formatting member-specific data.
 */

/* ==========================================================================
   DATA EXTRACTION FROM INPUT FIELDS AND CREATION OF MEMBER OBJECTS
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