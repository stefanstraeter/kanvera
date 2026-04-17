import { getCurrentUser } from './auth-service.js';
import { getState, saveToCache, convertToArrayList } from './data-service.js';

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

/**
 * @description Updates a team member's data locally in the state and cache. If the member does not exist, it will be created.
 * @export
 * @param {string} id - The ID of the member.
 * @param {Object} newData - The new data (e.g., {name, roles}).
 */
export function updateMemberLocally(id, newData) {
    const state = getState();

    if (state.team && state.team[id]) {
        state.team[id] = { ...state.team[id], ...newData };
    } else {
        state.team[id] = { id, ...newData };
    }
    saveToCache();
}

/**
 * @description Deletes a team member locally from the state and cache.
 * @export
 * @param {string} id - The ID of the member.
 * @return {void}
 */
export function deleteMemberLocally(id) {
    const state = getState();

    if (state.team && state.team[id]) {
        delete state.team[id];
    }
    saveToCache();
}

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






