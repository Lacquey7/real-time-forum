// singlePageRouting.js
const routes = {
    '/': showAuth,
    '/login': showLogin,
    '/register': showRegister,
    '/main': showMainPage
};

function showAuth() {
    showPage('auth-container');
    showAuthSection('auth-buttons');
}

function showLogin() {
    showPage('auth-container');
    showAuthSection('login-section');
}

function showRegister() {
    showPage('auth-container');
    showAuthSection('register-section');
}

function showMainPage() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('main-page').classList.add('active');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showAuthSection(sectionId) {
    document.querySelectorAll('.auth-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = {
        nickname: document.getElementById('register-nickname').value.trim(),
        age: document.getElementById('register-age').value.toString(),
        gender: document.getElementById('register-gender').value,
        firstName: document.getElementById('register-firstname').value.trim(),
        lastName: document.getElementById('register-lastname').value.trim(),
        email: document.getElementById('register-email').value.trim(),
        password: document.getElementById('register-password').value
    };

    try {
       await fetch('http://localhost:8080/register', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(formData)
       });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        // Redirection vers la page de login après inscription réussie
        window.location.hash = '/login';
        // Afficher un message de succès
        const loginError = document.getElementById('login-error');
        if (loginError) {
            loginError.style.color = '#4CAF50';
            loginError.textContent = 'Registration successful! You can now log in.';
        }
    } catch (error) {
        const registerError = document.getElementById('register-error');
        if (registerError) {
            registerError.textContent = error.message;
        }
    }
});



// Event listeners pour le routing
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function router() {
    const path = window.location.hash.slice(1) || '/';
    if (routes[path]) {
        routes[path]();
    } else {
        routes['/']();
    }
}