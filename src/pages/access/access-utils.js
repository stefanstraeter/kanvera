// access-utils.js

function adjustCardHeight(wrapper) {
    const gateway = document.querySelector(".gateway");
    if (wrapper && gateway) {
        const height = wrapper.getBoundingClientRect().height;
        gateway.style.height = `${height}px`;
    }
}


function slideTo(view) {
    const gatewaySlider = document.getElementById('gatewaySlider');
    if (!gatewaySlider) return;

    if (view === 'signup') {
        gatewaySlider.style.transform = 'translateX(-50%)';
    } else {
        gatewaySlider.style.transform = 'translateX(0%)';
    }
}

function setupInitialState(loginWrapper) {
    const gateway = document.querySelector(".gateway");
    if (!gateway || !loginWrapper) return;

    gateway.style.transition = 'none';
    adjustCardHeight(loginWrapper);

    setTimeout(() => {
        gateway.style.transition = 'height 0.4s ease-in-out';
    }, 50);
}


export function initSliderLogic() {
    const loginWrapper = document.getElementById('loginWrapper');
    const signupWrapper = document.getElementById('signupWrapper');
    const toSignupBtn = document.getElementById('toSignupBtn');
    const toLoginArrow = document.getElementById('toLoginArrow');

    setupInitialState(loginWrapper);

    toSignupBtn?.addEventListener('click', () => {
        slideTo('signup');
        adjustCardHeight(signupWrapper);
    });

    toLoginArrow?.addEventListener('click', () => {
        slideTo('login');
        adjustCardHeight(loginWrapper);
    });
}

export function initPasswordToggles() {
    console.log("Passwort-Toggle Skelett geladen");
}