//src/pages/team/team-template.js

/**
 * @description Creates the HTML for a team member card.
 * @param {Object} member
 * @param {string} initials
 * @param {string} displayRole
 * @return {string} HTML string for the team member card
 */
export const createMemberCardHtml = (member, initials, displayRole) => {
    const imageTag = member.imageUrl
        ? `<img src="${member.imageUrl}" 
                alt="${member.name}" 
                style="display: none;" 
                onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                onerror="this.remove();">`
        : '';

    return `
        <div class="team-card team-card--clickable" data-id="${member.id}" role="button">
            <div class="team-card__avatar">
                <div class="team-avatar team-avatar--m">
                    ${imageTag}
                    <div class="avatar-placeholder">
                        ${initials}
                    </div>
                </div>
            </div>

            <div class="team-card__info">
                <h3 class="heading-l">${member.name}</h3>
                <p class="team-card__role">${displayRole}</p>
                
                <div class="team-card__contact-details">
                    <a href="mailto:${member.email}" class="team-card__link js-contact-link">
                        <i class="fa-regular fa-envelope"></i> ${member.email}
                    </a>
                    <a href="tel:${member.phone}" class="team-card__link js-contact-link">
                        <i class="fa-solid fa-phone"></i> ${member.phone}
                    </a>
                </div>
            </div>
        </div>
    `;
};


/**
 * @description Creates the HTML for the edit modal of a team member.
 * @param {Object} member
 * @param {string} initials
 * @param {string} displayRole
 * @return {string} HTML string for the edit modal of the team member
 */
export const createEditModalHtml = (member, initials, displayRole) => {
    return `
    <div class="modal-edit-container">
        <div class="team-card__delete">
            <button type="button" class="btn-icon btn-icon--danger js-delete-member" title="Delete Member">
               <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
        
        <div class="modal-edit-header">
            <div class="team-avatar team-avatar--l">
                ${member.imageUrl
            ? `<img src="${member.imageUrl}" alt="${member.name}">`
            : `<div class="avatar-placeholder">${initials}</div>`
        }
            </div>
            <h3 class="heading-l js-edit-field" data-field="name" contenteditable="true" spellcheck="false">${member.name}</h3>
        </div>
        
        <div class="modal-inline-edit-body">
            <div class="inline-field">
                <i class="fa-regular fa-user field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Role</label>
                    <span class="js-edit-field" data-field="role" contenteditable="true" spellcheck="false">${displayRole}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-regular fa-envelope field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Email Address</label>
                    <span class="js-edit-field" data-field="email" contenteditable="true" spellcheck="false">${member.email}</span>
                </div>
            </div>

            <div class="inline-field">
                <i class="fa-solid fa-phone field-icon"></i>
                <div class="inline-edit-wrapper">
                    <label class="modal-label">Phone Number</label>
                    <span class="js-edit-field" data-field="phone" contenteditable="true" spellcheck="false">${member.phone || 'No Number'}</span>
                </div>
            </div>
        </div>

        <div class="modal__actions">
            <button type="button" class="btn btn--s btn--full btn--primary js-save-inline">Save Changes</button>
            <button type="button" class="btn btn--s btn--full btn--secondary js-close-modal">Cancel</button>
        </div>
    </div>
    `;
};