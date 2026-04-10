// access-utils.js

function adjustCardHeight(gateway, wrapper) {
    if (wrapper && gateway) {

        const contentHeight = wrapper.getBoundingClientRect().height;
        const offset = window.innerWidth < 600 ? 10 : 0;

        gateway.style.height = `${contentHeight + offset}px`;
    }
}

function toggleHeaderElements(show) {
    const navText = document.querySelector('.access-nav-text');
    const toSignupBtn = document.getElementById('toSignupBtn');

    if (show) {
        navText?.classList.remove('u-invisible');
        toSignupBtn?.classList.remove('u-invisible');
    } else {
        navText?.classList.add('u-invisible');
        toSignupBtn?.classList.add('u-invisible');
    }
}


function slideTo(slider, view) {
    if (!slider) return;

    if (view === 'signup') {
        slider.style.transform = 'translateX(-50%)';
        toggleHeaderElements(false);
    } else {
        slider.style.transform = 'translateX(0%)';
        toggleHeaderElements(true);
    }
}

function setupInitialState(gateway, loginWrapper) {
    if (!gateway || !loginWrapper) return;

    gateway.style.transition = 'none';
    adjustCardHeight(gateway, loginWrapper);

    setTimeout(() => {
        gateway.style.transition = 'height 0.4s ease-in-out';
    }, 50);
}

function closeMenu(content) {
    content.classList.remove('is-active');
}

function toggleMenu(e, content) {
    e.stopPropagation();
    content.classList.toggle('is-active');
}

export function initDropdownLogic() {
    const trigger = document.getElementById('js-menu-trigger');
    const content = document.getElementById('js-menu-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', (e) => toggleMenu(e, content));
    content.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => closeMenu(content));
}

export function initSliderLogic() {
    const gateway = document.querySelector(".gateway");
    const slider = document.getElementById('gatewaySlider');
    const loginWrapper = document.getElementById('loginWrapper');
    const signupWrapper = document.getElementById('signupWrapper');
    const toSignupBtn = document.getElementById('toSignupBtn');
    const toLoginArrow = document.getElementById('toLoginArrow');

    setupInitialState(gateway, loginWrapper);

    toSignupBtn?.addEventListener('click', () => {
        slideTo(slider, 'signup');
        adjustCardHeight(gateway, signupWrapper);
    });

    toLoginArrow?.addEventListener('click', () => {
        slideTo(slider, 'login');
        adjustCardHeight(gateway, loginWrapper);
    });
}

export function initPasswordToggles() {
    console.log("Passwort-Toggle Skelett geladen");
}