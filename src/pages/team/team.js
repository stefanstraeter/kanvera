// src/pages/team.js
import { initDataService, getAllTeamMembers } from '../../services/data-service.js';
import { getInitials } from '../../services/auth-logic.js';

/**
 * @description Page class for the Team page, responsible for rendering team member cards and handling related interactions.
 * @export
 * @class TeamPage
 */
export class TeamPage {
    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    constructor() {
        this.gridId = 'js-team-grid';
    }

    /**
     * @description Initializes the Team page by setting up the data service and rendering the team member grid. 
     * @return {void}
     * @memberof TeamPage
     */
    async init() {
        await initDataService();
        this.renderTeamGrid();
    }

    /* ==========================================================================
       RENDERING TEAM GRID & CARD
       ========================================================================== */
    /**
     * @description Renders the team member grid by fetching all team members from the data service and generating HTML cards for each member.
     * @return {void}
     * @memberof TeamPage
     */
    renderTeamGrid() {
        const gridElement = document.getElementById(this.gridId);
        if (!gridElement) return;

        const teamMembers = getAllTeamMembers();
        gridElement.innerHTML = teamMembers.map(member => this.createCardHtml(member)).join('');
    }

    /**
     * @description Creates the HTML for a team member card.
     * @param {*} member - The team member object.
     * @return {string} The HTML string for the team member card.
     * @memberof TeamPage
     */
    createCardHtml(member) {
        const { id, name, email, phone, roles, imageUrl } = member;
        const initials = getInitials(name);
        const displayRole = Array.isArray(roles) ? roles[0] : (roles || "@Member");
        const finalImageUrl = imageUrl || "";

        return `
        <div class="team-card" data-id="${id}">
            <div class="team-card__edit">
                <button class="btn-icon" title="Edit Member">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
            
            <div class="team-card__avatar">
                <div class="user-avatar--m">
                    ${finalImageUrl
                ? `<img src="${finalImageUrl}" 
                                alt="${name}" 
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
                : ''
            }
                    <div class="avatar-placeholder" 
                         style="${finalImageUrl ? 'display:none;' : 'display:flex;'}">
                        ${initials}
                    </div>
                </div>
            </div>

            <div class="team-card__info">
                <h3 class="heading-l">${name}</h3>
                <p class="team-card__role">${displayRole}</p>
                
                <div class="team-card__contact-details">
                    <a href="mailto:${email}" class="team-card__link">
                        <i class="fa-regular fa-envelope"></i> ${email}
                    </a>
                    <p class="team-card__link text-body-m">
                        <i class="fa-solid fa-phone"></i> ${phone || 'Keine Nummer'}
                    </p>
                </div>
            </div>
        </div>
        `;
    }
}