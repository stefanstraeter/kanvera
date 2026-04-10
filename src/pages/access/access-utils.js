// access-utils.js

function adjustCardHeight(gateway, wrapper) {
    if (wrapper && gateway) {
        const height = wrapper.getBoundingClientRect().height;
        gateway.style.height = `${height}px`;
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