
/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
/**
 * @description Opens the modal, populates it, and initializes all logic.
 * @export
 * @param {string} title - The title to display in the modal header.
 * @param {string} bodyHtml - The HTML string to inject into the modal body.
 * @param {Function} onSave - Callback function that receives form data on submission.
 * @param {Function} [validator] - Optional validation function for the form.
 */
export function openModal(title, bodyHtml, onSave, validator = null) {
    const modal = getModalElement();
    if (!modal) return;

    renderModalContent(title, bodyHtml);
    initCloseEvents(modal);
    initFormHandler(modal, onSave, validator);

    modal.classList.add('is-active');
}

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
   MODAL CONTENT & RENDERING
   ========================================================================== */
/**
 * @description Private helper to retrieve the global modal element from the DOM.
 * @returns {HTMLElement|null}
 */
const getModalElement = () => document.getElementById('js-global-modal');

/**
 * @description Injects the title and body HTML into the modal structure.
 * @param {string} title
 * @param {string} bodyHtml
 */
function renderModalContent(title, bodyHtml) {
    const modal = getModalElement();
    if (!modal) return;

    const titleEl = modal.querySelector('.js-modal-title');

    modal.classList.remove('modal--no-title');

    if (!title) {
        modal.classList.add('modal--no-title');
    } else {
        titleEl.innerText = title;
    }

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
    const closeButtons = modal.querySelectorAll('.js-close-modal');
    closeButtons.forEach(btn => {
        btn.onclick = () => closeModal();
    });

    modal.onclick = (event) => {
        if (event.target === modal) closeModal();
    };
}

/**
 * @description Handles form submission, extracts data and triggers the callback.
 * @param {HTMLElement} modal
 * @param {Function} onSave
 * @param {Function} [validator] - Optional validation function for the form.
 */
function initFormHandler(modal, onSave, validator) {
    const form = modal.querySelector('form');
    if (!form) return;

    form.onsubmit = async (event) => {
        event.preventDefault();

        if (validator && !validator(form)) {
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        await onSave(data);
        closeModal();
    };
}

/* ==========================================================================
   GLOBAL LISTENERS
   ========================================================================== */
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});
