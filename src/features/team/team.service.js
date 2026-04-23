// src/features/team/team.service.js

/**
 * Team Service
 * Handles team member data and operations
 */

import { getCurrentUser } from '../auth/auth.service.js';
import { getState, saveToCache, convertToArrayList } from '../../core/state.js';
import { toggleError, validateNotEmpty, validateEmailFormat, attachLiveValidation } from '../../shared/utils/input-validation.js';
import { VALIDATION_ERRORS } from '../../shared/utils/constants.js';

/* ==========================================================================
    TEAM MEMBER SERVICE 
   ========================================================================== */

/**
 * @description Get a list of all team members, including the current user if they are not already in the team list. 
 * @export
 * @return {Array} - An array of team members.
 */
export function getAllTeamMembers() {
    const state = getState();
    const currentUser = getCurrentUser();
    let members = convertToArrayList(state.team);
    if (!currentUser) return members;

    const isAlreadyInList = members.some(m => m.email === currentUser.email);

    if (!isAlreadyInList) {
        members.push(createVirtualMember(currentUser));
    }
    return members;
}


/* ==========================================================================
   INTERNAL HELPERS
   ========================================================================== */

/**
 * @description Creates a virtual team member based on the current user.
 * @param {Object} user - The current user object.
 * @return {Object} - A virtual team member object.
 */
function createVirtualMember(user) {
    return {
        id: user.id || "guest-id",
        name: user.name,
        email: user.email,
        roles: user.isGuest ? ["@guest"] : ["@team member"],
        imageUrl: "",
        phone: user.isGuest ? "demo mode" : "no phone",
        isMe: true
    };
}
