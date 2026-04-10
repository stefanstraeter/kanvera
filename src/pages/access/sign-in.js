// src/pages/access/sign-in.js

export function initSignInLogic() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("SignIn Formular wurde abgeschickt!");
    });
}