// src/pages/team/team-utils.js


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


export function createNewMemberObject(formData) {
    return {
        name: formData.name,
        email: formData.email,
        roles: [formData.role],
        phone: formData.phone || "no phone",
        imageUrl: ""
    };
}