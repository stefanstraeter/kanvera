
/* ==========================================================================
   UI HELPERS
   ========================================================================== */

/**
 * @description Makes the team wrapper visible with a transition.
 * @export
 */
export function showTeamWrapper() {
    const wrapper = document.querySelector('.team-wrapper');
    if (wrapper) {
        wrapper.classList.add('is-visible');
    }
}