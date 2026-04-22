// src/features/team/team-card.template.js

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
                class="avatar__img team-card__avatar-image"
                data-avatar-image>
            `
        : '';

    return `
        <div class="team-card team-card--clickable" data-id="${member.id}" role="button">
            <div class="team-card__avatar">
                <div class="avatar avatar--m">
                    ${imageTag}
                    <div class="avatar-placeholder team-card__avatar-placeholder" data-avatar-placeholder>
                        ${initials}
                    </div>
                </div>
            </div>

            <div class="team-card__info">
                <h3 class="heading-l u-text-truncate">${member.name}</h3>
                <p class="team-card__role u-text-truncate">${displayRole}</p>

                <div class="team-card__contact-details">
                    <a href="mailto:${member.email}" class="team-card__link u-text-truncate js-contact-link">
                        <i class="fa-regular fa-envelope"></i> ${member.email}
                    </a>
                    <a href="tel:${member.phone}" class="team-card__link u-text-truncate js-contact-link">
                        <i class="fa-solid fa-phone"></i> ${member.phone}
                    </a>
                </div>
            </div>
        </div>
    `;
};
