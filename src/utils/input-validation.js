// src/utils/input-validation.js

/**
 * @description Validates that the input value is not empty (after trimming whitespace)
 * @export
 * @param {string} value - The input value to validate
 * @return {boolean} - Returns true if the input is not empty, false otherwise  
 */
export function validateNotEmpty(value) {
    return value.trim().length > 0;
}


/**
 * @description Validates that the input value is a valid email format
 * @export
 * @param {string} email - The email value to validate
 * @return {boolean} - Returns true if the email is in a valid format, false otherwise
 */
export function validateEmailFormat(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}


/**
 * @description Validates that the input value meets a minimum length requirement
 * @export
 * @param {string} value - The input value to validate
 * @param {number} min - The minimum length requirement
 * @return {boolean} - Returns true if the input meets the minimum length, false otherwise
 */
export function validateMinLength(value, min) {
    return value.length >= min;
}


/**
 * @description Toggles error state on the input element and displays an error message if provided
 * @export
 * @param {HTMLElement} inputElement - The input element to toggle error state on
 * @param {boolean} isValid - A boolean indicating whether the input is valid or not
 * @param {string} [message=""] - An optional error message to display when the input is invalid
 * @return {void} 
 */
export function toggleError(inputElement, isValid, message = "") {
    const wrapper = inputElement.closest('.field-wrapper');
    if (!wrapper) return;

    const errorDisplay = wrapper.querySelector('.error-msg');

    if (!isValid) {
        wrapper.classList.add('has-error');
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.classList.add('show');
        }
    } else {
        wrapper.classList.remove('has-error');
        if (errorDisplay) {
            errorDisplay.classList.remove('show');
        }
    }
}


/**
 * @description Get the value of an input element, handling different input types
 * @param {HTMLElement} inputElement - The input element to get the value from
 * @return {string|boolean} - The value of the input element, or its checked state for checkboxes
 */
function getInputValue(inputElement) {
    return inputElement.type === 'checkbox'
        ? inputElement.checked
        : inputElement.value;
}


/**
 * @description Attach live validation to an input element, providing immediate feedback as the user interacts with it. For text inputs, validation occurs on both 'input' and 'blur' events, while for checkboxes, validation occurs on 'change' events.
 * @export
 * @param {HTMLElement} inputElement - The input element to attach validation to
 * @param {Function} validationFn - The validation function to apply to the input value
 * @param {string} errorMessage - The error message to display when validation fails
 * @return {void} 
 */
export function attachLiveValidation(inputElement, validationFn, errorMessage) {
    if (!inputElement) return;

    const eventType = inputElement.type === 'checkbox' ? 'change' : 'input';

    inputElement.addEventListener(eventType, () => {
        const value = getInputValue(inputElement);
        if (validationFn(value)) {
            toggleError(inputElement, true);
        }
    });


    if (inputElement.type !== 'checkbox') {
        inputElement.addEventListener('blur', () => {
            const value = getInputValue(inputElement);
            toggleError(inputElement, validationFn(value), errorMessage);
        });
    }
}