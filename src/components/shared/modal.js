/* styles/ui/modal.css */

/* ==========================================================================
   MODAL COMPONENT
   ========================================================================== */
/**
 * @description Private helper to retrieve the global modal element from the DOM.
 * @returns {HTMLElement|null}
 */
const getModalElement = () => document.getElementById('js-global-modal');

/**
 * @description Closes the modal by removing the 'is-active' class.
 * @export
 */
export function closeModal() {
    const modal = getModalElement();
    if (modal) {
        modal.classList.remove('is-active');
    }
}

/* ==========================================================================
   CONTENT RENDERING
   ========================================================================== */
/**
 * @description Injects the title and body HTML into the modal structure.
 * @param {string} title 
 * @param {string} bodyHtml 
 */
function renderModalContent(title, bodyHtml) {
    const modal = getModalElement();
    if (!modal) return;

    modal.querySelector('.js-modal-title').innerText = title;
    modal.querySelector('.js-modal-body').innerHTML = bodyHtml;
}

/* ==========================================================================
   EVENT HANDLING
   ========================================================================== */
/**
 * @description Sets up all click events for closing the modal (buttons and overlay).
 * @param {HTMLElement} modal 
 */
function initCloseEvents(modal) {
    // Close via buttons
    const closeButtons = modal.querySelectorAll('.js-close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = () => closeModal();
    });

    // Close via overlay click
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}

/**
 * @description Handles form submission, extracts data and triggers the callback.
 * @param {HTMLElement} modal 
 * @param {Function} onSave 
 */
function initFormHandler(modal, onSave) {
    const form = modal.querySelector('form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        onSave(data);
        closeModal();
    };
}

/* ==========================================================================
   PUBLIC API / INITIALIZATION
   ========================================================================== */
/**
 * @description Opens the modal, populates it, and initializes all logic.
 * @export
 * @param {string} title 
 * @param {string} bodyHtml 
 * @param {Function} onSave 
 */
export function openModal(title, bodyHtml, onSave) {
    const modal = getModalElement();
    if (!modal) return;

    renderModalContent(title, bodyHtml);
    initCloseEvents(modal);
    initFormHandler(modal, onSave);

    modal.classList.add('is-active');
}

/* ==========================================================================
   GLOBAL LISTENERS
   ========================================================================== */
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});