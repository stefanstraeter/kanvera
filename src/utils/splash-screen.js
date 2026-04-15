// src/utils/splash-screen.js

/* ==========================================================================
   SPLASH SCREEN HELPERS
   ========================================================================== */
/**
 * @description Delay execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @return {Promise<void>} A promise that resolves after the specified delay.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @description Get the appropriate logo source based on the current theme.
 * @return {string} The path to the logo image.
 */
function getTargetLogoSrc() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "dark" ? "assets/icons/logo-light.svg" : "assets/icons/logo-dark.svg";
}

/* ==========================================================================
   ANIMATION SEQUENCE
   ========================================================================== */
/**
 * @description Run the exit sequence for the splash screen.
 * @param {Object} elements - The elements involved in the splash screen sequence.
 * @param {HTMLElement} elements.splashScreen - The splash screen element.
 * @param {HTMLElement} elements.splashScreenLogo - The splash screen logo element.
 * @param {HTMLElement} elements.finalLogo - The final logo element.
 */
async function runExitSequence(elements) {
    const { splashScreen, splashScreenLogo, finalLogo } = elements;

    splashScreenLogo.classList.add("splash-screen__logo--exit");
    await delay(120);

    finalLogo.classList.add("header__logo-img--visible");
    await delay(180);

    splashScreen.classList.add("splash-screen--hidden");
    await delay(800);

    splashScreen.style.display = "none";
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
/**
 * @description Initialize the splash screen sequence.
 * @export
 * @return {Promise<void>} A promise that resolves when the splash screen sequence is complete.
 */
export async function initSplashScreen() {
    const elements = {
        splashScreen: document.getElementById("splashScreen"),
        splashScreenLogo: document.getElementById("splashScreenLogo"),
        finalLogo: document.getElementById("headerLogoFinal")
    };

    if (!elements.splashScreen || !elements.splashScreenLogo || !elements.finalLogo) return;

    elements.finalLogo.src = getTargetLogoSrc();

    await delay(800);
    runExitSequence(elements);

    setTimeout(() => {
        if (elements.splashScreen.style.display !== "none") {
            elements.splashScreen.style.display = "none";
        }
    }, 4000);
}